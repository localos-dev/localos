import Dexie, { type Table } from 'dexie';

export interface LocalProject {
  id?: number;
  name: string;
  description: string;
  color: string;
  createdAt: number;
}

export interface LocalMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface LocalChat {
  id?: number;
  projectId: number;
  title: string;
  messages: LocalMessage[];
  createdAt: number;
}

export interface LocalFile {
  id?: number;
  projectId: number;
  name: string;
  path: string;
  language: string;
  content: string;
  createdAt: number;
}

export interface LocalKnowledge {
  id?: number;
  projectId: number;
  name: string;
  content: string;
  type: string;
  createdAt: number;
}

class LocalOSDatabase extends Dexie {
  projects!: Table<LocalProject, number>;
  chats!: Table<LocalChat, number>;
  files!: Table<LocalFile, number>;
  knowledge!: Table<LocalKnowledge, number>;

  constructor() {
    super('LocalOSDB');
    this.version(1).stores({
      projects:  '++id, createdAt',
      chats:     '++id, projectId, createdAt',
      files:     '++id, projectId, createdAt',
      knowledge: '++id, projectId, createdAt',
    });
  }
}

export const db = new LocalOSDatabase();

db.on('blocked', () => {
  console.warn('LocalOSDB open is blocked by another connection. Close other tabs and reload.');
});

export function openDB(): Promise<void> {
  return db.open().then(() => {}).catch((err: unknown) => {
    console.error('LocalOSDB failed to open:', err);
  });
}

export function withTimeout<T>(promise: Promise<T>, ms = 6000, label = 'operation'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out. Try reloading the page.`)), ms)
    ),
  ]);
}
