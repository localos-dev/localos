import { Router } from "express";
import { ollama, MODEL_CATALOG, listInstalledModels, isOllamaRunning } from "../lib/ollama";

const router = Router();

router.get("/models", async (_req, res) => {
  const installedNames = await listInstalledModels();
  const installedSet = new Set(installedNames);

  const models = MODEL_CATALOG.map((m) => ({
    name: m.name,
    displayName: m.displayName,
    type: m.type,
    size: m.size,
    ram: m.ram,
    vram: m.vram,
    status: installedSet.has(m.name) || installedSet.has(m.ollamaId) ? "ready" : "not_installed",
    progress: null,
    ollamaId: m.ollamaId,
  }));

  res.json(models);
});

router.post("/models/pull", async (req, res) => {
  const { name } = req.body as { name: string };

  if (!name) {
    res.status(400).json({ error: "Model name is required" });
    return;
  }

  const running = await isOllamaRunning();
  if (!running) {
    res.json({
      success: false,
      message: "Ollama is not running. Install Ollama from https://ollama.ai and start it to download models.",
    });
    return;
  }

  try {
    // Start pull (non-streaming for simplicity in response)
    await ollama.pull({ model: name });
    res.json({ success: true, message: `Model ${name} pulled successfully` });
  } catch (err) {
    res.json({
      success: false,
      message: `Failed to pull model: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
});

router.delete("/models/:modelName", async (req, res) => {
  const { modelName } = req.params;

  const running = await isOllamaRunning();
  if (!running) {
    res.status(503).json({ error: "Ollama is not running" });
    return;
  }

  try {
    await ollama.delete({ model: modelName });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: `Failed to delete model: ${err instanceof Error ? err.message : String(err)}` });
  }
});

export default router;
