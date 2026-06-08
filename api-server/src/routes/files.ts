import { Router } from "express";
import { db, files } from "../lib/localos-db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/projects/:projectId/files", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const rows = db.select().from(files).where(eq(files.projectId, projectId)).all();
  res.json(rows);
});

router.post("/projects/:projectId/files", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const { name, path, content = "", language = "text" } = req.body as {
    name: string;
    path: string;
    content?: string;
    language?: string;
  };

  if (!name?.trim() || !path?.trim()) {
    res.status(400).json({ error: "Name and path are required" });
    return;
  }

  const file = db
    .insert(files)
    .values({ projectId, name: name.trim(), path: path.trim(), content, language })
    .returning()
    .get();

  res.status(201).json(file);
});

router.get("/projects/:projectId/files/:fileId", (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const file = db.select().from(files).where(eq(files.id, fileId)).get();

  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.json(file);
});

router.patch("/projects/:projectId/files/:fileId", (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const { name, content, language } = req.body as Partial<{
    name: string;
    content: string;
    language: string;
  }>;

  const existing = db.select().from(files).where(eq(files.id, fileId)).get();
  if (!existing) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const updated = db
    .update(files)
    .set({
      ...(name !== undefined && { name }),
      ...(content !== undefined && { content }),
      ...(language !== undefined && { language }),
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(files.id, fileId))
    .returning()
    .get();

  res.json(updated);
});

router.delete("/projects/:projectId/files/:fileId", (req, res) => {
  const fileId = parseInt(req.params.fileId);
  db.delete(files).where(eq(files.id, fileId)).run();
  res.status(204).send();
});

export default router;
