import { Router } from "express";
import { db, chats, messages } from "../lib/localos-db";
import { eq, count, sql } from "drizzle-orm";

const router = Router({ mergeParams: true });

router.get("/projects/:projectId/chats", (req, res) => {
  const projectId = parseInt(req.params.projectId);

  const rows = db
    .select({
      id: chats.id,
      projectId: chats.projectId,
      title: chats.title,
      model: chats.model,
      createdAt: chats.createdAt,
      updatedAt: chats.updatedAt,
      messageCount: count(messages.id),
    })
    .from(chats)
    .leftJoin(messages, eq(messages.chatId, chats.id))
    .where(eq(chats.projectId, projectId))
    .groupBy(chats.id)
    .all();

  res.json(rows);
});

router.post("/projects/:projectId/chats", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const { title, model } = req.body as { title: string; model?: string };

  if (!title?.trim()) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const chat = db
    .insert(chats)
    .values({ projectId, title: title.trim(), model })
    .returning()
    .get();

  res.status(201).json({ ...chat, messageCount: 0 });
});

router.get("/projects/:projectId/chats/:chatId", (req, res) => {
  const chatId = parseInt(req.params.chatId);

  const chat = db.select().from(chats).where(eq(chats.id, chatId)).get();
  if (!chat) {
    res.status(404).json({ error: "Chat not found" });
    return;
  }

  const chatMessages = db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .all();

  res.json({ ...chat, messages: chatMessages });
});

router.patch("/projects/:projectId/chats/:chatId", (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const { title, model } = req.body as Partial<{ title: string; model: string }>;

  const existing = db.select().from(chats).where(eq(chats.id, chatId)).get();
  if (!existing) {
    res.status(404).json({ error: "Chat not found" });
    return;
  }

  const updated = db
    .update(chats)
    .set({
      ...(title !== undefined && { title }),
      ...(model !== undefined && { model }),
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(chats.id, chatId))
    .returning()
    .get();

  const messageCount = db.select({ count: count() }).from(messages).where(eq(messages.chatId, chatId)).get()?.count ?? 0;

  res.json({ ...updated, messageCount });
});

router.delete("/projects/:projectId/chats/:chatId", (req, res) => {
  const chatId = parseInt(req.params.chatId);
  db.delete(chats).where(eq(chats.id, chatId)).run();
  res.status(204).send();
});

router.post("/projects/:projectId/chats/:chatId/messages", (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const { role, content } = req.body as { role: "user" | "assistant" | "system"; content: string };

  if (!role || !content) {
    res.status(400).json({ error: "Role and content are required" });
    return;
  }

  const message = db
    .insert(messages)
    .values({ chatId, role, content })
    .returning()
    .get();

  // Update chat updatedAt
  db.update(chats).set({ updatedAt: sql`(datetime('now'))` }).where(eq(chats.id, chatId)).run();

  res.status(201).json(message);
});

export default router;
