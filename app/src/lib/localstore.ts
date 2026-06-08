// Synchronous localStorage-based store.
// Replaces Dexie/IndexedDB entirely. Never hangs, always works offline.

export interface LocalMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface LocalProject {
  id: number;
  name: string;
  description: string;
  color: string;
  createdAt: number;
}

export interface LocalChat {
  id: number;
  projectId: number;
  title: string;
  messages: LocalMessage[];
  createdAt: number;
}

export interface LocalFile {
  id: number;
  projectId: number;
  name: string;
  path: string;
  language: string;
  content: string;
  createdAt: number;
}

export interface LocalKnowledge {
  id: number;
  projectId: number;
  name: string;
  content: string;
  type: string;
  createdAt: number;
}

// ── Internal helpers ────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('[LocalOS] storage write failed:', e);
  }
}

function nextId(): number {
  const n = read<number>('los_seq', 0) + 1;
  write('los_seq', n);
  return n;
}

// ── Projects ────────────────────────────────────────────────────────────────

export function listProjects(): LocalProject[] {
  return read<LocalProject[]>('los_projects', []).sort((a, b) => a.createdAt - b.createdAt);
}

export function getProject(id: number): LocalProject | undefined {
  return listProjects().find((p) => p.id === id);
}

export function createProject(data: { name: string; description: string; color: string }): LocalProject {
  const project: LocalProject = { ...data, id: nextId(), createdAt: Date.now() };
  write('los_projects', [...listProjects(), project]);
  return project;
}

// ── Chats ───────────────────────────────────────────────────────────────────

function allChats(): LocalChat[] {
  return read<LocalChat[]>('los_chats', []);
}

export function listChats(projectId: number): LocalChat[] {
  return allChats()
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function getChat(id: number): LocalChat | undefined {
  return allChats().find((c) => c.id === id);
}

export function createChat(projectId: number, data: { title: string }): LocalChat {
  const chat: LocalChat = { projectId, title: data.title, messages: [], id: nextId(), createdAt: Date.now() };
  write('los_chats', [...allChats(), chat]);
  return chat;
}

export function appendMessage(chatId: number, role: 'user' | 'assistant', content: string): void {
  const chats = allChats();
  const idx = chats.findIndex((c) => c.id === chatId);
  if (idx === -1) return;
  const msg: LocalMessage = { id: Date.now(), role, content, createdAt: Date.now() };
  chats[idx] = { ...chats[idx], messages: [...chats[idx].messages, msg] };
  write('los_chats', chats);
}

// ── Files ───────────────────────────────────────────────────────────────────

function allFiles(): LocalFile[] {
  return read<LocalFile[]>('los_files', []);
}

export function listFiles(projectId: number): LocalFile[] {
  return allFiles()
    .filter((f) => f.projectId === projectId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function getFile(id: number): LocalFile | undefined {
  return allFiles().find((f) => f.id === id);
}

export function createFile(projectId: number, data: { name: string; path: string; language: string; content: string }): LocalFile {
  const file: LocalFile = { projectId, ...data, id: nextId(), createdAt: Date.now() };
  write('los_files', [...allFiles(), file]);
  return file;
}

export function updateFile(id: number, content: string): void {
  const files = allFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return;
  files[idx] = { ...files[idx], content };
  write('los_files', files);
}

// ── Knowledge ───────────────────────────────────────────────────────────────

function allKnowledge(): LocalKnowledge[] {
  return read<LocalKnowledge[]>('los_knowledge', []);
}

export function listKnowledge(projectId: number): LocalKnowledge[] {
  return allKnowledge()
    .filter((k) => k.projectId === projectId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function createKnowledge(projectId: number, data: { name: string; content: string; type: string }): LocalKnowledge {
  const item: LocalKnowledge = { projectId, ...data, id: nextId(), createdAt: Date.now() };
  write('los_knowledge', [...allKnowledge(), item]);
  return item;
}

// ── Counts (for project cards) ───────────────────────────────────────────────

export function countChats(projectId: number): number {
  return allChats().filter((c) => c.projectId === projectId).length;
}

export function countFiles(projectId: number): number {
  return allFiles().filter((f) => f.projectId === projectId).length;
}
