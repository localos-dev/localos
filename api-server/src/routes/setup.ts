import { Router } from "express";
import { spawn } from "child_process";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { isOllamaRunning } from "../lib/ollama";

const router = Router();

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function decompressZstdToTar(src: string, dest: string): Promise<void> {
  const { Decompress } = await import("fzstd");
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    let errored = false;
    const decomp = new Decompress((chunk: Uint8Array) => {
      if (!errored) output.write(Buffer.from(chunk));
    });
    const input = fs.createReadStream(src, { highWaterMark: 512 * 1024 });
    input.on("data", (chunk: Buffer) => {
      if (errored) return;
      try {
        decomp.push(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
      } catch (e) {
        errored = true;
        input.destroy();
        output.destroy();
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
    input.on("end", () => {
      if (errored) return;
      try {
        decomp.push(new Uint8Array(), true);
        output.end(() => resolve());
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
    input.on("error", (e) => { errored = true; reject(e); });
    output.on("error", (e) => { errored = true; reject(e); });
  });
}

function httpsGet(url: string, redirectCount = 0): Promise<import("http").IncomingMessage> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 15) { reject(new Error("Too many redirects")); return; }
    const u = new URL(url);
    const req = https.get(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { "User-Agent": "LocalOS/1.0", "Accept-Encoding": "identity" },
      },
      (res) => {
        const code = res.statusCode ?? 0;
        if (code >= 300 && code < 400 && res.headers.location) {
          res.resume();
          httpsGet(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
        } else {
          resolve(res);
        }
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function fetchText(url: string): Promise<string> {
  const res = await httpsGet(url);
  return new Promise((resolve, reject) => {
    let raw = "";
    res.on("data", (c: Buffer) => { raw += c.toString(); });
    res.on("end", () => resolve(raw));
    res.on("error", reject);
  });
}

async function fetchJson(url: string): Promise<unknown> {
  return JSON.parse(await fetchText(url));
}

// Returns free bytes on the filesystem containing the given path
function getFreeBytes(dir: string): number {
  try {
    const stat = fs.statfsSync(dir);
    return stat.bfree * stat.bsize;
  } catch {
    return Infinity;
  }
}

// Stream download to file with progress events
async function downloadFile(
  url: string,
  dest: string,
  onProgress: (downloaded: number, total: number) => void
): Promise<void> {
  const res = await httpsGet(url);
  const code = res.statusCode ?? 0;
  if (code >= 400) throw new Error(`HTTP ${code}`);
  const total = parseInt(res.headers["content-length"] ?? "0", 10);
  let downloaded = 0;
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    res.on("data", (chunk: Buffer) => {
      downloaded += chunk.length;
      onProgress(downloaded, total);
    });
    res.pipe(file);
    file.on("finish", () => { file.close(); resolve(); });
    file.on("error", (e) => { fs.unlink(dest, () => {}); reject(e); });
    res.on("error", (e) => { reject(e); });
  });
}

// Clean up all leftover temp files from previous attempts
function cleanTempFiles(workDir: string) {
  const entries = [
    path.join(workDir, "ollama.tar.zst"),
    path.join(workDir, "ollama.tar"),
    path.join(workDir, "ollama-extract"),
    path.join(os.tmpdir(), "ollama.tar.zst"),
    path.join(os.tmpdir(), "ollama.tar"),
    path.join(os.tmpdir(), "ollama-extract"),
    path.join(os.tmpdir(), "Ollama-darwin.zip"),
    path.join(os.tmpdir(), "ollama-mac"),
  ];
  for (const entry of entries) {
    try {
      const stat = fs.statSync(entry);
      if (stat.isDirectory()) fs.rmSync(entry, { recursive: true, force: true });
      else fs.unlinkSync(entry);
    } catch {}
  }
}

interface GithubAsset { name: string; browser_download_url: string; }
interface GithubRelease { assets: GithubAsset[]; }

async function getRelease(): Promise<GithubRelease> {
  return await fetchJson(
    "https://api.github.com/repos/ollama/ollama/releases/latest"
  ) as GithubRelease;
}

function findAsset(assets: GithubAsset[], ...names: string[]): GithubAsset | undefined {
  for (const name of names) {
    const found = assets.find((a) => a.name === name);
    if (found) return found;
  }
  return undefined;
}

router.get("/setup/platform", (_req, res) => {
  res.json({ platform: process.platform, arch: process.arch });
});

router.post("/setup/install-llm", async (_req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  if (await isOllamaRunning()) {
    send({ type: "already_installed" });
    res.end();
    return;
  }

  const platform = process.platform;
  const arch = process.arch;
  const home = os.homedir();

  // Use a dedicated work directory in home (avoids /tmp quota limits)
  const workDir = path.join(home, ".localos-tmp");
  fs.mkdirSync(workDir, { recursive: true });

  // Always clean up leftovers from previous failed attempts FIRST
  send({ type: "log", message: "Preparing installation environment..." });
  cleanTempFiles(workDir);

  // Check free disk space: need at least 3 GB for download + extract
  const requiredBytes = 3 * 1024 * 1024 * 1024;
  const freeHome = getFreeBytes(home);
  if (freeHome < requiredBytes) {
    const freeGB = (freeHome / 1024 / 1024 / 1024).toFixed(1);
    send({
      type: "error",
      message: `Not enough disk space. Need 3 GB free, only ${freeGB} GB available. Free up space and retry.`,
    });
    res.end();
    return;
  }

  try {
    send({ type: "log", message: "Checking latest LLM runtime version..." });
    const release = await getRelease();
    const assets = release.assets ?? [];

    // ── Linux ─────────────────────────────────────────────────────────────────
    if (platform === "linux") {
      const archKey = arch === "arm64" ? "arm64" : "amd64";
      const pkg = findAsset(
        assets,
        `ollama-linux-${archKey}.tar.zst`,
        `ollama-linux-${archKey}.tgz`,
        `ollama-linux-${archKey}.tar.gz`,
      );
      if (!pkg) {
        send({ type: "error", message: `No LLM runtime binary found for Linux ${archKey}.` });
        res.end(); return;
      }

      const tmpTgz = path.join(workDir, "ollama.tar.zst");
      const tmpTar = path.join(workDir, "ollama.tar");
      const localDir = path.join(home, ".local");
      fs.mkdirSync(localDir, { recursive: true });

      send({ type: "log", message: "Downloading LLM runtime (this may take a few minutes)..." });
      await downloadFile(pkg.browser_download_url, tmpTgz, (d, t) => {
        send({ type: "download_progress", downloaded: d, total: t });
      });

      // Decompress .zst to .tar using fzstd (no external zstd binary needed)
      send({ type: "log", message: "Decompressing..." });
      await decompressZstdToTar(tmpTgz, tmpTar);
      try { fs.unlinkSync(tmpTgz); } catch {}

      // Extract .tar to ~/.local/, preserves full directory structure:
      // bin/ollama, lib/ollama/llama-server, lib/ollama/cuda/, etc.
      send({ type: "log", message: "Extracting LLM runtime..." });
      await new Promise<void>((resolve, reject) => {
        const p = spawn("tar", ["-xf", tmpTar, "-C", localDir], { stdio: ["ignore", "ignore", "pipe"] });
        let stderr = "";
        p.stderr?.on("data", (d: Buffer) => { stderr += d.toString(); });
        p.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`tar failed (${code}): ${stderr.trim()}`));
        });
        p.on("error", reject);
      });
      try { fs.unlinkSync(tmpTar); } catch {}
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}

      // Make all extracted binaries executable
      const binPath = path.join(localDir, "bin", "ollama");
      const libDir = path.join(localDir, "lib", "ollama");
      if (fs.existsSync(binPath)) fs.chmodSync(binPath, 0o755);
      if (fs.existsSync(libDir)) {
        await new Promise<void>((r) => {
          spawn("find", [libDir, "-type", "f", "-exec", "chmod", "+x", "{}", ";"], { stdio: "ignore" })
            .on("close", () => r());
        });
      }

      if (!fs.existsSync(binPath)) {
        send({ type: "error", message: "Could not locate LLM runtime binary after extraction." });
        res.end(); return;
      }

      send({ type: "log", message: "Starting LLM runtime..." });
      const binDir = path.join(localDir, "bin");
      spawn(binPath, ["serve"], {
        detached: true,
        stdio: "ignore",
        env: { ...process.env, HOME: home, PATH: `${binDir}:${process.env.PATH ?? ""}` },
      }).unref();

      // Wait up to 14 seconds for it to start
      for (let i = 0; i < 7; i++) {
        await sleep(2000);
        if (await isOllamaRunning()) { send({ type: "done" }); res.end(); return; }
      }
      send({ type: "error", message: "LLM runtime installed but did not start in time. Try reloading." });
      res.end();
      return;
    }

    // ── macOS ─────────────────────────────────────────────────────────────────
    if (platform === "darwin") {
      let brewOk = false;
      try {
        const brewProc = spawn("brew", ["install", "ollama"], { stdio: ["ignore", "pipe", "pipe"] });
        send({ type: "log", message: "Installing via Homebrew..." });
        brewProc.stdout?.on("data", (d: Buffer) => {
          const l = d.toString().trim();
          if (l) send({ type: "log", message: l });
        });
        brewOk = await new Promise<boolean>((resolve) => {
          brewProc.on("close", (code) => resolve(code === 0));
          brewProc.on("error", () => resolve(false));
        });
      } catch {}

      if (brewOk) {
        try { spawn("ollama", ["serve"], { detached: true, stdio: "ignore" }).unref(); } catch {}
        for (let i = 0; i < 4; i++) {
          await sleep(2000);
          if (await isOllamaRunning()) { send({ type: "done" }); res.end(); return; }
        }
        send({ type: "error", message: "LLM runtime installed but did not start. Try reloading." });
        res.end(); return;
      }

      // Direct zip download
      const zip = findAsset(assets, "Ollama-darwin.zip", "ollama-darwin.zip");
      if (!zip) { send({ type: "error", message: "No macOS package in release." }); res.end(); return; }
      const tmpZip = path.join(workDir, "Ollama-darwin.zip");
      const extDir = path.join(workDir, "ollama-mac");
      send({ type: "log", message: "Downloading LLM runtime..." });
      await downloadFile(zip.browser_download_url, tmpZip, (d, t) => {
        send({ type: "download_progress", downloaded: d, total: t });
      });
      try {
        fs.mkdirSync(extDir, { recursive: true });
        await new Promise<void>((r, j) => {
          spawn("unzip", ["-o", tmpZip, "-d", extDir], { stdio: "pipe" })
            .on("close", (c) => c === 0 ? r() : j(new Error("unzip failed")));
        });
        const appDest = "/Applications/Ollama.app";
        if (fs.existsSync(appDest)) await new Promise<void>((r) => spawn("rm", ["-rf", appDest]).on("close", () => r()));
        await new Promise<void>((r, j) => {
          spawn("cp", ["-r", path.join(extDir, "Ollama.app"), appDest])
            .on("close", (c) => c === 0 ? r() : j(new Error("copy failed")));
        });
        spawn("open", ["-a", "Ollama"]).unref();
        for (let i = 0; i < 4; i++) {
          await sleep(2000);
          if (await isOllamaRunning()) { send({ type: "done" }); res.end(); return; }
        }
        send({ type: "error", message: "LLM runtime installed. Open it from Applications, then click Retry." });
      } catch (err) {
        send({ type: "error", message: `Install failed: ${err instanceof Error ? err.message : String(err)}` });
      }
      try { fs.unlinkSync(tmpZip); } catch {}
      try { fs.rmSync(extDir, { recursive: true, force: true }); } catch {}
      res.end(); return;
    }

    // ── Windows ───────────────────────────────────────────────────────────────
    if (platform === "win32") {
      const exe = findAsset(assets, "OllamaSetup.exe");
      if (!exe) { send({ type: "error", message: "No Windows installer in release." }); res.end(); return; }
      send({ type: "log", message: "Downloading installer..." });
      const tmpExe = path.join(workDir, "OllamaSetup.exe");
      await downloadFile(exe.browser_download_url, tmpExe, (d, t) => {
        send({ type: "download_progress", downloaded: d, total: t });
      });
      send({ type: "log", message: "Running installer silently..." });
      await new Promise<void>((resolve) => {
        const proc = spawn(tmpExe, ["/S"], { stdio: "ignore" });
        proc.on("close", async (code) => {
          if (code === 0) {
            for (let i = 0; i < 4; i++) {
              await sleep(2000);
              if (await isOllamaRunning()) { send({ type: "done" }); return; }
            }
            send({ type: "error", message: "Installer finished but LLM runtime did not start. Try reloading." });
          } else {
            send({ type: "error", message: `Installer failed (code ${code}).` });
          }
          resolve();
        });
        proc.on("error", (e) => { send({ type: "error", message: e.message }); resolve(); });
      });
      try { fs.unlinkSync(tmpExe); } catch {}
      res.end(); return;
    }

    send({ type: "error", message: "Unsupported platform." });
  } catch (err) {
    send({ type: "error", message: err instanceof Error ? err.message : String(err) });
  }

  res.end();
});

export default router;
