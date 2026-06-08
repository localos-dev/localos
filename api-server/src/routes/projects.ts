import { Router } from "express";
import { db, projects, chats, files } from "../lib/localos-db";
import { eq, count, sql } from "drizzle-orm";

const router = Router();

router.get("/projects", (_req, res) => {
  const rows = db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      color: projects.color,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      chatCount: count(chats.id),
    })
    .from(projects)
    .leftJoin(chats, eq(chats.projectId, projects.id))
    .groupBy(projects.id)
    .all();

  // Get file counts
  const fileCounts = db
    .select({ projectId: files.projectId, fileCount: count(files.id) })
    .from(files)
    .groupBy(files.projectId)
    .all();

  const fileCountMap = new Map(fileCounts.map((r) => [r.projectId, r.fileCount]));

  const result = rows.map((r) => ({
    ...r,
    fileCount: fileCountMap.get(r.id) ?? 0,
  }));

  res.json(result);
});

router.post("/projects", (req, res) => {
  const { name, description = "", color = "#0052FF" } = req.body as {
    name: string;
    description?: string;
    color?: string;
  };

  if (!name?.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const project = db
    .insert(projects)
    .values({ name: name.trim(), description, color })
    .returning()
    .get();

  res.status(201).json({ ...project, chatCount: 0, fileCount: 0 });
});

router.get("/projects/:projectId", (req, res) => {
  const id = parseInt(req.params.projectId);
  const project = db.select().from(projects).where(eq(projects.id, id)).get();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const chatCount = db.select({ count: count() }).from(chats).where(eq(chats.projectId, id)).get()?.count ?? 0;
  const fileCount = db.select({ count: count() }).from(files).where(eq(files.projectId, id)).get()?.count ?? 0;

  res.json({ ...project, chatCount, fileCount });
});

router.patch("/projects/:projectId", (req, res) => {
  const id = parseInt(req.params.projectId);
  const { name, description, color } = req.body as Partial<{
    name: string;
    description: string;
    color: string;
  }>;

  const existing = db.select().from(projects).where(eq(projects.id, id)).get();
  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const updated = db
    .update(projects)
    .set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(color !== undefined && { color }),
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(projects.id, id))
    .returning()
    .get();

  const chatCount = db.select({ count: count() }).from(chats).where(eq(chats.projectId, id)).get()?.count ?? 0;
  const fileCount = db.select({ count: count() }).from(files).where(eq(files.projectId, id)).get()?.count ?? 0;

  res.json({ ...updated, chatCount, fileCount });
});

router.delete("/projects/:projectId", (req, res) => {
  const id = parseInt(req.params.projectId);
  db.delete(projects).where(eq(projects.id, id)).run();
  res.status(204).send();
});

export default router;
