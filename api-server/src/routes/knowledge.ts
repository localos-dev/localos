import { Router } from "express";
import { db, knowledgeDocs } from "../lib/localos-db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/projects/:projectId/knowledge", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const docs = db.select().from(knowledgeDocs).where(eq(knowledgeDocs.projectId, projectId)).all();
  res.json(docs);
});

router.post("/projects/:projectId/knowledge", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const { name, content, type = "text" } = req.body as {
    name: string;
    content: string;
    type?: string;
  };

  if (!name?.trim() || !content) {
    res.status(400).json({ error: "Name and content are required" });
    return;
  }

  const doc = db
    .insert(knowledgeDocs)
    .values({
      projectId,
      name: name.trim(),
      content,
      type,
      size: Buffer.byteLength(content, "utf8"),
    })
    .returning()
    .get();

  res.status(201).json(doc);
});

router.delete("/projects/:projectId/knowledge/:docId", (req, res) => {
  const docId = parseInt(req.params.docId);
  db.delete(knowledgeDocs).where(eq(knowledgeDocs.id, docId)).run();
  res.status(204).send();
});

export default router;
