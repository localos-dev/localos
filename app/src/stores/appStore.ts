import { create } from 'zustand';

interface AppState {
  currentProjectId: number | null;
  currentChatId: number | null;
  currentFileId: number | null;
  rightPanelFileId: number | null;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeTab: 'chat' | 'editor' | 'preview';
  theme: 'dark' | 'light' | 'system';
  selectedModel: string;
  setCurrentProjectId: (id: number | null) => void;
  setCurrentChatId: (id: number | null) => void;
  setCurrentFileId: (id: number | null) => void;
  setRightPanelFileId: (id: number | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setActiveTab: (tab: 'chat' | 'editor' | 'preview') => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setSelectedModel: (model: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentProjectId: null,
  currentChatId: null,
  currentFileId: null,
  rightPanelFileId: null,
  sidebarOpen: true,
  rightPanelOpen: true,
  activeTab: 'chat',
  theme: 'dark',
  selectedModel: 'tinyllama',
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setCurrentFileId: (id) => set({ currentFileId: id }),
  setRightPanelFileId: (id) => set({ rightPanelFileId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
