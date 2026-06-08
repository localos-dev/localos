import { Router } from "express";
import { ollama, isOllamaRunning } from "../lib/ollama";
import { db, chats, messages } from "../lib/localos-db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// POST /api/chat/stream: SSE streaming chat endpoint
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

  const isAboutLocalOS =
    lower.includes("localos") ||
    lower.includes("local os") ||
    lower.includes("what is") ||
    lower.includes("who are you") ||
    lower.includes("who made") ||
    lower.includes("who built") ||
    lower.includes("about you") ||
    lower.includes("github") ||
    lower.includes("website") ||
    lower.includes("link") ||
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("usdc") ||
    lower.includes("model") ||
    lower.includes("offline") ||
    lower.includes("payment") ||
    lower.includes("twitter") ||
    lower.includes(" x ") ||
    lower.includes("docs") ||
    lower.includes("feature");

  if (isAboutLocalOS) {
    if (lower.includes("who are you") || lower.includes("what are you")) {
      response = "I am LocalOS AI, built by the LocalOS team. I run entirely on your device using WebLLM. No data leaves your machine, no internet is required after the model is downloaded.";
    } else if (lower.includes("github") || lower.includes("source") || lower.includes("open source")) {
      response = "LocalOS is open source. The source code is at github.com/localos-dev. The main repos are localos (app source), localos-contracts (smart contract on Base), localos-site (website), and localos-docs (documentation).";
    } else if (lower.includes("price") || lower.includes("pricing") || lower.includes("usdc") || lower.includes("cost") || lower.includes("payment")) {
      response = "Free models: TinyLlama 1.1B, Llama 3.2 1B, SmolLM2 1.7B, Gemma 2 2B (all under 2 GB, no payment needed).\n\nPaid models require a one-time USDC payment on Base:\n\n15 USDC: Llama 3.2 3B, Qwen 2.5 3B, Phi 3.5 Mini, Phi 4 Mini.\n20 USDC: Mistral 7B, Qwen 2.5 7B.\n25 USDC: Llama 3.1 8B, Hermes 3 8B, DeepSeek R1 7B and 8B.\n\nPayment is per wallet per model. Once paid, access is permanent. No subscription.";
    } else if (lower.includes("offline") || lower.includes("internet") || lower.includes("air")) {
      response = "LocalOS works fully offline after the first model download. Open localos.xyz/app, download a model from the Models page (one-time, takes a few minutes), then disconnect from the internet. Everything still works. No telemetry, no cloud calls, air-gap compatible.";
    } else if (lower.includes("link") || lower.includes("website") || lower.includes("twitter") || lower.includes(" x ") || lower.includes("contact")) {
      response = "Official LocalOS links:\n\nWebsite: localos.xyz\nApp: localos.xyz/app\nDocs: localos.xyz/docs\nGitHub: github.com/localos-dev\nX: x.com/localos_xyz";
    } else if (lower.includes("feature") || lower.includes("what can")) {
      response = "LocalOS features:\n\nChat: ask questions, get writing help, code review, and reasoning.\nCode Editor: write and edit code files with syntax highlighting.\nWeb Builder: describe a page and the AI generates it instantly.\nProjects: organize chats and files by project.\nKnowledge Base: save documents for the AI to reference.\nModels: browse and download models, all cached in your browser.";
    } else {
      response = "LocalOS is a self-hosted local AI operating system that runs entirely in the browser. Open localos.xyz/app, download a model once, and the app works fully offline from that point.\n\nWebsite: localos.xyz\nGitHub: github.com/localos-dev\nX: x.com/localos_xyz\nDocs: localos.xyz/docs\n\nThe LLM runtime is finishing setup in the background. Once ready, you will have full AI assistance running on your device.";
    }
  } else if (
    lower.includes("build") ||
    lower.includes("create") ||
    lower.includes("make") ||
    lower.includes("landing") ||
    lower.includes("html")
  ) {
    response = `Here is a starter webpage for you:\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>My Page</title>\n  <style>\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: system-ui, sans-serif; background: #0a0f1c; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }\n    h1 { font-size: 3rem; font-weight: 800; color: #0052FF; margin-bottom: 1rem; }\n    p { font-size: 1.2rem; color: #94a3b8; max-width: 600px; text-align: center; line-height: 1.6; }\n    .btn { margin-top: 2rem; padding: 0.75rem 2rem; background: #0052FF; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; }\n  </style>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <p>Your page is ready. Customize the content, colors, and layout to make it yours.</p>\n  <a class="btn" href="#">Get Started</a>\n</body>\n</html>\n\`\`\`\n\nThe LLM runtime is still setting up. Once ready, you will get fully AI-generated pages tailored to your request.`;
  } else if (
    lower.includes("code") ||
    lower.includes("function") ||
    lower.includes("typescript") ||
    lower.includes("javascript") ||
    lower.includes("python") ||
    lower.includes("component") ||
    lower.includes("react")
  ) {
    response = `Here is an example TypeScript utility:\n\n\`\`\`typescript\nexport function formatDate(date: Date): string {\n  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });\n}\n\nexport function slugify(text: string): string {\n  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");\n}\n\`\`\`\n\nThe LLM runtime is still setting up. Once ready, you will get AI-generated code specific to your project.`;
  } else if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("test")
  ) {
    response = `Hello. I am LocalOS AI, built by the LocalOS team. I run entirely on your device with no data sent to any server.\n\nThe LLM runtime is finishing setup in the background. Once ready, you will have full AI assistance running entirely on your machine.\n\nLocalOS: localos.xyz`;
  } else {
    response = `LocalOS is running in demo mode while the LLM runtime finishes setting up.\n\nYou can ask me to build a webpage, write code, start a new project, or ask anything about LocalOS.\n\nLocalOS: localos.xyz\nGitHub: github.com/localos-dev\nX: x.com/localos_xyz`;
  }

  return response.split("").map((ch) => ch);
}

export default router;
