import { Router } from "express";
import { isOllamaRunning, getOllamaVersion, listInstalledModels } from "../lib/ollama";
import { db, projects } from "../lib/localos-db";
import { count } from "drizzle-orm";
import fs from "fs";

const router = Router();

router.get("/status", async (req, res) => {
  // Check database
  let databaseReady = false;
  try {
    db.select({ count: count() }).from(projects).get();
    databaseReady = true;
  } catch {
    databaseReady = false;
  }

  // Check Ollama
  const ollamaReady = await isOllamaRunning();
  const ollamaVersion = ollamaReady ? await getOllamaVersion() : null;
  const models = ollamaReady ? await listInstalledModels() : [];

  // Check storage
  let storageReady = false;
  let storageSize: string | null = null;
  try {
    const dbPath = process.env.LOCALOS_DB_PATH || "./localos.db";
    if (fs.existsSync(dbPath)) {
      const stat = fs.statSync(dbPath);
      const mb = (stat.size / 1024 / 1024).toFixed(1);
      storageSize = `${mb} MB`;
    } else {
      storageSize = "0 MB";
    }
    storageReady = true;
  } catch {
    storageReady = false;
  }

  res.json({
    backend: true,
    database: databaseReady,
    ollama: ollamaReady,
    storage: storageReady,
    version: "1.0.0",
    ollamaVersion,
    models,
    storageSize,
  });
});

export default router;
