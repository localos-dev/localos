import { Router } from "express";
import { ollama, isOllamaRunning } from "../lib/ollama";
import { db, chats, messages } from "../lib/localos-db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// POST /api/chat/stream — SSE streaming chat endpoint
router.post("/chat/stream", async (req, res) => {
  const {
    chatId,
    content,
    model = "tinyllama",
    noSave = false,
  } = req.body as {
    chatId: number;
    content: string;
    model?: string;
    noSave?: boolean;
  };

  if (!content) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  if (!noSave && !chatId) {
    res.status(400).json({ error: "chatId is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  if (!noSave) {
    const userMsg = db
      .insert(messages)
      .values({ chatId, role: "user", content })
      .returning()
      .get();
    send({ type: "user_message", message: userMsg });
    db.update(chats)
      .set({ updatedAt: sql`(datetime('now'))` })
      .where(eq(chats.id, chatId))
      .run();
  }

  const ollamaRunning = await isOllamaRunning();

  if (!ollamaRunning) {
    const fallbackResponse = generateFallbackResponse(content);
    let fullContent = "";

    for (const chunk of fallbackResponse) {
      fullContent += chunk;
      send({ type: "chunk", content: chunk });
      await sleep(20);
    }

    if (!noSave) {
      const assistantMsg = db
        .insert(messages)
        .values({ chatId, role: "assistant", content: fullContent })
        .returning()
        .get();
      send({ type: "done", message: assistantMsg });
    } else {
      send({ type: "done" });
    }

    res.end();
    return;
  }

  try {
    let ollamaMessages: { role: "user" | "assistant" | "system"; content: string }[] = [];

    if (!noSave) {
      const chatMessages = db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .all();
      ollamaMessages = chatMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
    } else {
      ollamaMessages = [{ role: "user", content }];
    }

    const stream = await ollama.chat({
      model,
      messages: ollamaMessages,
      stream: true,
    });

    let fullContent = "";
    for await (const part of stream) {
      const chunk = part.message.content;
      if (chunk) {
        fullContent += chunk;
        send({ type: "chunk", content: chunk });
      }
    }

    if (!noSave) {
      const assistantMsg = db
        .insert(messages)
        .values({ chatId, role: "assistant", content: fullContent })
        .returning()
        .get();
      send({ type: "done", message: assistantMsg });
    } else {
      send({ type: "done" });
    }
  } catch (err) {
    send({
      type: "error",
      message: `Ollama error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  res.end();
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateFallbackResponse(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  let response: string;

  if (
    lower.includes("build") ||
    lower.includes("create") ||
    lower.includes("make") ||
    lower.includes("website") ||
    lower.includes("page") ||
    lower.includes("landing") ||
    lower.includes("html")
  ) {
    response = `Here is a starter webpage for you:\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>My Page</title>\n  <style>\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n    body {\n      font-family: system-ui, -apple-system, sans-serif;\n      background: #0a0f1c;\n      color: #e2e8f0;\n      min-height: 100vh;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n    }\n    h1 { font-size: 3rem; font-weight: 800; color: #0052FF; margin-bottom: 1rem; }\n    p { font-size: 1.2rem; color: #94a3b8; max-width: 600px; text-align: center; line-height: 1.6; }\n    .btn {\n      margin-top: 2rem;\n      padding: 0.75rem 2rem;\n      background: #0052FF;\n      color: white;\n      border: none;\n      border-radius: 8px;\n      font-size: 1rem;\n      font-weight: 600;\n      cursor: pointer;\n      text-decoration: none;\n    }\n    .btn:hover { background: #003dd6; }\n  </style>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <p>Your page is ready. Customize the content, colors, and layout to make it yours.</p>\n  <a class="btn" href="#">Get Started</a>\n</body>\n</html>\n\`\`\`\n\nThe LLM runtime is still setting up. Once ready, you will get fully AI-generated pages tailored to your request.`;
  } else if (
    lower.includes("code") ||
    lower.includes("function") ||
    lower.includes("typescript") ||
    lower.includes("javascript") ||
    lower.includes("python") ||
    lower.includes("component") ||
    lower.includes("react")
  ) {
    response = `Here is an example TypeScript utility:\n\n\`\`\`typescript\nexport function formatDate(date: Date): string {\n  return date.toLocaleDateString("en-US", {\n    year: "numeric",\n    month: "long",\n    day: "numeric",\n  });\n}\n\nexport function slugify(text: string): string {\n  return text\n    .toLowerCase()\n    .replace(/[^a-z0-9]+/g, "-")\n    .replace(/(^-|-$)/g, "");\n}\n\`\`\`\n\nThe LLM runtime is still setting up. Once ready, you will get AI-generated code specific to your project.`;
  } else if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("test")
  ) {
    response = `Hello. LocalOS is running and ready to help you build websites, write code, and manage projects.\n\nThe local LLM runtime is finishing setup in the background. Once complete, you will have full AI assistance running entirely on your machine, with no data sent to any server.`;
  } else {
    response = `LocalOS is running in demo mode while the local LLM runtime finishes setting up.\n\nYou can:\n- Ask me to build a website or landing page\n- Ask me to write code or components\n- Start a new project in the sidebar\n- Browse your files\n\nOnce setup is complete, you will have a private AI assistant running entirely on your hardware.`;
  }

  return response.split("").map((ch) => ch);
}

export default router;
