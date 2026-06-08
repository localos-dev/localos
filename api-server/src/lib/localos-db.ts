import { db, projects, chats, messages, files, knowledgeDocs, paymentSessions, modelAccess } from "@workspace/db";
import { eq, count, sql, and } from "drizzle-orm";

export { db, projects, chats, messages, files, knowledgeDocs, paymentSessions, modelAccess };
export { eq, count, sql, and };

export function initializeDatabase() {
  const sqlite = (db as unknown as { $client: { exec(sql: string): void; pragma(val: string): void } }).$client;

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '#0052FF',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      model TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'text',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      size INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payment_sessions (
      id TEXT PRIMARY KEY,
      user_wallet TEXT NOT NULL,
      model_id TEXT NOT NULL,
      amount_usdc INTEGER NOT NULL,
      fresh_address TEXT NOT NULL UNIQUE,
      fresh_pk_encrypted TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      usdc_received INTEGER,
      relay_tx_hash TEXT,
      gas_tx_hash TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_payment_sessions_fresh  ON payment_sessions(fresh_address);
    CREATE INDEX IF NOT EXISTS idx_payment_sessions_user   ON payment_sessions(user_wallet, status);

    CREATE TABLE IF NOT EXISTS model_access (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_wallet TEXT NOT NULL,
      model_id TEXT NOT NULL,
      session_id TEXT NOT NULL REFERENCES payment_sessions(id),
      granted_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_wallet, model_id)
    );

    CREATE INDEX IF NOT EXISTS idx_model_access_wallet ON model_access(user_wallet);
  `);

  // Seed sample data if empty
  const projectCount = db.select({ count: count() }).from(projects).get();
  if (projectCount && projectCount.count === 0) {
    const project = db.insert(projects).values({
      name: "Welcome to LocalOS",
      description: "Your first local AI project. Everything runs on your machine.",
      color: "#0052FF",
    }).returning().get();

    if (project) {
      const chat = db.insert(chats).values({
        projectId: project.id,
        title: "Getting Started",
      }).returning().get();

      if (chat) {
        db.insert(messages).values([
          { chatId: chat.id, role: "user", content: "What is LocalOS?" },
          {
            chatId: chat.id,
            role: "assistant",
            content: "# Welcome to LocalOS\n\nLocalOS is a fully self-hosted AI operating system that runs entirely on your machine.\n\n**Key features:**\n- All inference runs locally via the LLM runtime\n- Projects and files stored in SQLite\n- No cloud, no API keys, no tracking\n\nDownload a model from the Models page and start chatting.",
          },
        ]).run();
      }

      db.insert(files).values([
        {
          projectId: project.id,
          name: "index.ts",
          path: "/index.ts",
          content: "// LocalOS Project\n// Running entirely on your machine\n\nexport const greet = (name: string) => {\n  return `Hello, ${name}! Welcome to LocalOS.`;\n};\n\nconsole.log(greet(\"World\"));",
          language: "typescript",
        },
        {
          projectId: project.id,
          name: "README.md",
          path: "/README.md",
          content: "# LocalOS Project\n\nThis project runs entirely on your machine.\n\n## Getting Started\n\n1. Download a model from the Models page\n2. Start chatting with your local AI\n",
          language: "markdown",
        },
      ]).run();
    }
  }
}
