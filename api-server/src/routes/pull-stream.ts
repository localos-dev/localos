import { Router } from "express";
import { ollama, isOllamaRunning, listInstalledModels } from "../lib/ollama";

const router = Router();

router.post("/models/pull-stream", async (req, res) => {
  const { name } = req.body as { name: string };

  if (!name) {
    res.status(400).json({ error: "Model name is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const running = await isOllamaRunning();
  if (!running) {
    send({ type: "error", message: "LLM runtime is not running. Make sure it is installed and running." });
    res.end();
    return;
  }

  const installed = await listInstalledModels();
  const alreadyInstalled = installed.some(
    (m) => m === name || m.startsWith(name.split(":")[0])
  );

  if (alreadyInstalled) {
    send({ type: "already_installed", model: name });
    res.end();
    return;
  }

  try {
    const stream = await ollama.pull({ model: name, stream: true });

    for await (const progress of stream) {
      send({
        type: "progress",
        status: progress.status ?? "",
        completed: progress.completed ?? 0,
        total: progress.total ?? 0,
      });
    }

    send({ type: "done", model: name });
  } catch (err) {
    send({
      type: "error",
      message: `Pull failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  res.end();
});

export default router;
