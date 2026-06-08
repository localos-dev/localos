import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const PROJECTS_ROOT = process.env.LOCALOS_PROJECTS_ROOT || path.join(process.cwd(), "localos-projects");

// Ensure projects root exists
if (!fs.existsSync(PROJECTS_ROOT)) {
  fs.mkdirSync(PROJECTS_ROOT, { recursive: true });
}

function safePath(userPath: string): string {
  const normalized = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(PROJECTS_ROOT, normalized);
}

router.get("/filesystem", (req, res) => {
  const userPath = (req.query.path as string) || "/";
  const fullPath = safePath(userPath);

  if (!fs.existsSync(fullPath)) {
    res.json([]);
    return;
  }

  if (!fs.statSync(fullPath).isDirectory()) {
    res.status(400).json({ error: "Path is not a directory" });
    return;
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true }).map((entry) => {
    const entryPath = path.join(userPath, entry.name);
    const fullEntryPath = path.join(fullPath, entry.name);
    const isDir = entry.isDirectory();
    let size: number | null = null;
    if (!isDir) {
      try {
        size = fs.statSync(fullEntryPath).size;
      } catch {
        size = null;
      }
    }
    return {
      name: entry.name,
      path: entryPath,
      type: isDir ? "directory" : "file",
      size,
      extension: isDir ? null : path.extname(entry.name).slice(1) || null,
    };
  });

  res.json(entries);
});

router.get("/filesystem/read", (req, res) => {
  const userPath = req.query.path as string;
  if (!userPath) {
    res.status(400).json({ error: "Path is required" });
    return;
  }

  const fullPath = safePath(userPath);

  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  const size = fs.statSync(fullPath).size;

  res.json({ path: userPath, content, size });
});

router.post("/filesystem/write", (req, res) => {
  const { path: userPath, content } = req.body as { path: string; content: string };

  if (!userPath || content === undefined) {
    res.status(400).json({ error: "Path and content are required" });
    return;
  }

  const fullPath = safePath(userPath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, "utf-8");

  res.json({ success: true, path: userPath });
});

export default router;
