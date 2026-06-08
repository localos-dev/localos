import Dexie, { Table } from 'dexie';

export interface Project {
  id?: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id?: number;
  projectId: number;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalFile {
  id?: number;
  projectId: number;
  name: string;
  path: string;
  content: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeDoc {
  id?: number;
  projectId: number;
  name: string;
  content: string;
  type: string;
  createdAt: Date;
}

class LocalOSDB extends Dexie {
  projects!: Table<Project>;
  chats!: Table<Chat>;
  files!: Table<LocalFile>;
  knowledge!: Table<KnowledgeDoc>;
  
  constructor() {
    super('LocalOS');
    this.version(1).stores({
      projects: '++id, name, createdAt',
      chats: '++id, projectId, title, createdAt',
      files: '++id, projectId, path, name',
      knowledge: '++id, projectId, name, type',
    });
  }
}

export const db = new LocalOSDB();
