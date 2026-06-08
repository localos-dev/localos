import { spawn } from "child_process";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { logger } from "./logger";

const home = os.homedir();
const localDir = path.join(home, ".local");
const binPath = path.join(localDir, "bin", "ollama");
const llamaServerPath = path.join(localDir, "lib", "ollama", "llama-server");
const workDir = path.join(home, ".localos-tmp");

let isRunning = false;

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

async function streamDownload(url: string, dest: string): Promise<void> {
  const res = await httpsGet(url);
  const code = res.statusCode ?? 0;
  if (code >= 400) throw new Error(`HTTP ${code}`);
  const total = parseInt(res.headers["content-length"] ?? "0", 10);
  let downloaded = 0;
  let lastLogPct = 0;
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    res.on("data", (chunk: Buffer) => {
      downloaded += chunk.length;
      if (total > 0) {
        const pct = Math.floor((downloaded / total) * 100);
        if (pct - lastLogPct >= 10) {
          lastLogPct = pct;
          logger.info({ pct, mbDownloaded: Math.floor(downloaded / 1024 / 1024) }, "LLM runtime download progress");
        }
      }
    });
    res.pipe(file);
    file.on("finish", () => { file.close(); resolve(); });
    file.on("error", (e) => { try { fs.unlinkSync(dest); } catch {} reject(e); });
    res.on("error", reject);
  });
}

// Decompress .zst file to .tar using fzstd (streaming, no full RAM load)
async function decompressZstd(src: string, dest: string): Promise<void> {
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

async function getDownloadUrl(): Promise<string> {
  const res = await httpsGet("https://api.github.com/repos/ollama/ollama/releases/latest");
  const raw = await new Promise<string>((resolve, reject) => {
    let data = "";
    res.on("data", (c: Buffer) => { data += c.toString(); });
    res.on("end", () => resolve(data));
    res.on("error", reject);
  });
  const release = JSON.parse(raw) as { assets: { name: string; browser_download_url: string }[] };
  const archKey = process.arch === "arm64" ? "arm64" : "amd64";
  const asset = release.assets.find((a) => a.name === `ollama-linux-${archKey}.tar.zst`);
  if (!asset) throw new Error(`No ollama-linux-${archKey}.tar.zst in release`);
  return asset.browser_download_url;
}

function cleanWorkDir() {
  try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
}

export function startBackgroundSetup(): void {
  if (process.platform !== "linux") return;
  if (isRunning) return;

  if (fs.existsSync(binPath) && fs.existsSync(llamaServerPath)) {
    logger.info("LLM runtime already fully installed");
    return;
  }

  isRunning = true;
  logger.info("LLM runtime inference backend missing: starting background install");

  // Wrap in a self-contained async IIFE so errors never reach the process level
  (async () => {
    const tmpTgz = path.join(workDir, "ollama.tar.zst");
    const tmpTar = path.join(workDir, "ollama.tar");
    try {
      fs.mkdirSync(workDir, { recursive: true });
      fs.mkdirSync(localDir, { recursive: true });

      // Clean up leftover files from any previous failed attempt
      try { fs.unlinkSync(tmpTgz); } catch {}
      try { fs.unlinkSync(tmpTar); } catch {}

      logger.info("Fetching LLM runtime release info...");
      const downloadUrl = await getDownloadUrl();

      logger.info({ url: downloadUrl }, "Downloading LLM runtime (1.3 GB)...");
      await streamDownload(downloadUrl, tmpTgz);
      logger.info("Download complete. Decompressing to tar...");

      await decompressZstd(tmpTgz, tmpTar);
      // Free the compressed archive immediately to reclaim disk space
      try { fs.unlinkSync(tmpTgz); } catch {}
      logger.info("Decompression complete. Extracting to ~/.local/...");

      // Extract tar to ~/.local/, preserves bin/ollama + lib/ollama/llama-server + all backends
      await new Promise<void>((resolve, reject) => {
        const proc = spawn("tar", ["-xf", tmpTar, "-C", localDir], {
          stdio: ["ignore", "ignore", "pipe"],
        });
        let stderr = "";
        proc.stderr?.on("data", (d: Buffer) => { stderr += d.toString(); });
        proc.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`tar failed (${code}): ${stderr.trim()}`));
        });
        proc.on("error", reject);
      });

      // Free the tar immediately after extraction
      try { fs.unlinkSync(tmpTar); } catch {}
      cleanWorkDir();
      logger.info("Extraction complete. Setting permissions...");

      try { fs.chmodSync(binPath, 0o755); } catch {}
      const libDir = path.join(localDir, "lib", "ollama");
      if (fs.existsSync(libDir)) {
        await new Promise<void>((r) => {
          spawn("find", [libDir, "-type", "f", "-exec", "chmod", "+x", "{}", ";"], { stdio: "ignore" })
            .on("close", () => r());
        });
      }

      logger.info("Restarting LLM runtime with full inference backend...");
      try {
        await new Promise<void>((r) => {
          spawn("pkill", ["-f", "ollama serve"], { stdio: "ignore" }).on("close", () => r());
        });
      } catch {}

      await new Promise<void>((r) => setTimeout(r, 1500));

      const binDir = path.join(localDir, "bin");
      spawn(binPath, ["serve"], {
        detached: true,
        stdio: "ignore",
        env: {
          ...process.env,
          HOME: home,
          PATH: `${binDir}:${process.env.PATH ?? ""}`,
        },
      }).unref();

      logger.info("LLM runtime fully installed: inference backend ready");
    } catch (err) {
      logger.error({ err }, "Background LLM runtime install failed");
      try { fs.unlinkSync(tmpTgz); } catch {}
      try { fs.unlinkSync(tmpTar); } catch {}
      cleanWorkDir();
    } finally {
      isRunning = false;
    }
  })();
}
