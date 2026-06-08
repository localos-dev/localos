import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listProjects, getProject, createProject,
  listChats, getChat, createChat, appendMessage,
  listFiles, getFile, createFile, updateFile,
  listKnowledge, createKnowledge,
  countChats, countFiles,
  type LocalProject, type LocalChat, type LocalFile, type LocalKnowledge, type LocalMessage,
} from './localstore';

export type { LocalProject, LocalChat, LocalFile, LocalKnowledge, LocalMessage };

// ── Query key factories ────────────────────────────────────────────────────

export const getListProjectsQueryKey    = ()                                   => ['projects'] as const;
export const getGetProjectQueryKey      = (projectId: number)                  => ['projects', projectId] as const;
export const getListChatsQueryKey       = (projectId: number)                  => ['projects', projectId, 'chats'] as const;
export const getGetChatQueryKey         = (projectId: number, chatId: number)  => ['projects', projectId, 'chats', chatId] as const;
export const getListFilesQueryKey       = (projectId: number)                  => ['projects', projectId, 'files'] as const;
export const getGetFileQueryKey         = (projectId: number, fileId: number)  => ['projects', projectId, 'files', fileId] as const;
export const getListKnowledgeQueryKey   = (projectId: number)                  => ['projects', projectId, 'knowledge'] as const;

// ── Options type ───────────────────────────────────────────────────────────

interface LocalQueryOptions {
  query?: {
    queryKey?: readonly unknown[];
    enabled?: boolean;
  };
}

// ── Project with computed counts ───────────────────────────────────────────

export interface ProjectWithCounts extends LocalProject {
  chatCount: number;
  fileCount: number;
}

// ── Query hooks (all synchronous reads wrapped in Promise.resolve) ──────────

export function useListProjects() {
  return useQuery({
    queryKey: getListProjectsQueryKey(),
    staleTime: Infinity,
    queryFn: (): ProjectWithCounts[] =>
      listProjects().map((p) => ({
        ...p,
        chatCount: countChats(p.id),
        fileCount: countFiles(p.id),
      })),
  });
}

export function useGetProject(projectId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getGetProjectQueryKey(projectId),
    staleTime: Infinity,
    queryFn: () => getProject(projectId),
    enabled: options?.query?.enabled ?? projectId > 0,
  });
}

export function useListChats(projectId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getListChatsQueryKey(projectId),
    staleTime: Infinity,
    queryFn: () => listChats(projectId),
    enabled: options?.query?.enabled ?? projectId > 0,
  });
}

export function useGetChat(projectId: number, chatId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getGetChatQueryKey(projectId, chatId),
    staleTime: Infinity,
    queryFn: () => getChat(chatId),
    enabled: options?.query?.enabled ?? (projectId > 0 && chatId > 0),
  });
}

export function useListFiles(projectId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getListFilesQueryKey(projectId),
    staleTime: Infinity,
    queryFn: () => listFiles(projectId),
    enabled: options?.query?.enabled ?? projectId > 0,
  });
}

export function useGetFile(projectId: number, fileId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getGetFileQueryKey(projectId, fileId),
    staleTime: Infinity,
    queryFn: () => getFile(fileId),
    enabled: options?.query?.enabled ?? (projectId > 0 && fileId > 0),
  });
}

export function useListKnowledge(projectId: number, options?: LocalQueryOptions) {
  return useQuery({
    queryKey: getListKnowledgeQueryKey(projectId),
    staleTime: Infinity,
    queryFn: () => listKnowledge(projectId),
    enabled: options?.query?.enabled ?? projectId > 0,
  });
}

// ── Mutation hooks (all synchronous — never hang) ──────────────────────────

export function useCreateProject() {
  return useMutation({
    mutationFn: async (vars: { data: { name: string; description: string; color: string } }): Promise<LocalProject> =>
      createProject(vars.data),
  });
}

export function useCreateChat() {
  return useMutation({
    mutationFn: async (vars: { projectId: number; data: { title: string } }): Promise<LocalChat> =>
      createChat(vars.projectId, vars.data),
  });
}

export function useCreateFile() {
  return useMutation({
    mutationFn: async (vars: { projectId: number; data: { name: string; path: string; language: string; content: string } }): Promise<LocalFile> =>
      createFile(vars.projectId, vars.data),
  });
}

export function useUpdateFile() {
  return useMutation({
    mutationFn: async (vars: { projectId: number; fileId: number; data: { content: string } }): Promise<void> => {
      updateFile(vars.fileId, vars.data.content);
    },
  });
}

export function useCreateKnowledge() {
  return useMutation({
    mutationFn: async (vars: { projectId: number; data: { name: string; content: string; type: string } }): Promise<LocalKnowledge> =>
      createKnowledge(vars.projectId, vars.data),
  });
}

// ── Message persistence helper ─────────────────────────────────────────────

export function addMessageToChat(chatId: number, role: 'user' | 'assistant', content: string): void {
  appendMessage(chatId, role, content);
}
