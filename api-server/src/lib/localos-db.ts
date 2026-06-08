import { db, projects, chats, messages, files, knowledgeDocs } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";

export { db, projects, chats, messages, files, knowledgeDocs };
export { eq, count, sql };

export function initializeDatabase() {
  // Access raw better-sqlite3 client via drizzle's $client property
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
  `);

  // Seed sample data if empty
  const projectCount = db.select({ count: count() }).from(projects).get();
  if (projectCount && projectCount.count === 0) {
    const project = db.insert(projects).values({
      name: "Welcome to LocalOS",
      description: "Your first local AI project — everything runs on your machine.",
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
            content: "# Welcome to LocalOS\n\nLocalOS is a fully self-hosted AI operating system that runs entirely on your machine.\n\n**Key features:**\n- All inference runs locally via Ollama\n- Projects and files stored in SQLite\n- No cloud, no API keys, no tracking\n\nConnect Ollama at http://localhost:11434 and install a model to start chatting with real AI.",
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
          content: "# LocalOS Project\n\nThis project runs entirely on your machine.\n\n## Getting Started\n\n1. Install [Ollama](https://ollama.ai)\n2. Pull a model: `ollama pull llama3.2`\n3. Start chatting with your local AI\n",
          language: "markdown",
        },
      ]).run();
    }
  }
}
