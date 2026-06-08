import app from "./app";
import { logger } from "./lib/logger";
import { initializeDatabase } from "./lib/localos-db";
import { startBackgroundSetup } from "./lib/setup-runner";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Initialize SQLite database and seed sample data
try {
  initializeDatabase();
  logger.info("LocalOS database initialized");
} catch (err) {
  logger.error({ err }, "Failed to initialize database");
  process.exit(1);
}

// Auto-start Ollama if installed but not running
function tryAutoStartOllama() {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".local", "bin", "ollama"),
    "/usr/local/bin/ollama",
    "/usr/bin/ollama",
  ];

  for (const binPath of candidates) {
    if (!fs.existsSync(binPath)) continue;
    try {
      const binDir = path.dirname(binPath);
      spawn(binPath, ["serve"], {
        detached: true,
        stdio: "ignore",
        env: {
          ...process.env,
          HOME: home,
          PATH: `${binDir}:${process.env.PATH ?? ""}`,
        },
      }).unref();
      logger.info({ binPath }, "Auto-started Ollama");
      return;
    } catch {
      // continue to next candidate
    }
  }
}

// Attempt to start Ollama on boot (no-op if already running or not installed)
tryAutoStartOllama();

// If llama-server backend is missing, download and install it in the background
startBackgroundSetup();

// Start payment session monitor (polls Base RPC every 15s for USDC arrivals)
import("./lib/payment-worker.js").then(({ startPaymentWorker }) => {
  startPaymentWorker();
}).catch((err) => {
  logger.warn({ err }, "Payment worker failed to start");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "LocalOS backend listening");
});
