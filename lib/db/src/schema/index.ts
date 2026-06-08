import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull().default("#0052FF"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  model: text("model"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: integer("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: text("content").notNull().default(""),
  language: text("language").notNull().default("text"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const knowledgeDocs = sqliteTable("knowledge_docs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("text"),
  size: integer("size"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type ProjectFile = typeof files.$inferSelect;
export type InsertProjectFile = typeof files.$inferInsert;
export type KnowledgeDoc = typeof knowledgeDocs.$inferSelect;
export type InsertKnowledgeDoc = typeof knowledgeDocs.$inferInsert;
