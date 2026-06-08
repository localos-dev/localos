import { create } from 'zustand';

export interface Model {
  id: string;
  name: string;
  type: 'reasoning' | 'coding' | 'vision' | 'embedding' | 'search';
  size: string;
  ram: string;
  vram: string;
  status: 'Not Installed' | 'Downloading' | 'Ready';
  progress: number;
}

interface ModelsState {
  models: Model[];
  downloadModel: (id: string) => void;
  deleteModel: (id: string) => void;
}

const initialModels: Model[] = [
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', type: 'reasoning', size: '4.7 GB', ram: '8 GB', vram: '6 GB', status: 'Ready', progress: 100 },
  { id: 'qwen-2.5-coder-7b', name: 'Qwen 2.5 Coder 7B', type: 'coding', size: '4.3 GB', ram: '8 GB', vram: '5 GB', status: 'Not Installed', progress: 0 },
  { id: 'llava-1.6-7b', name: 'LLaVA 1.6 7B', type: 'vision', size: '5.1 GB', ram: '10 GB', vram: '8 GB', status: 'Not Installed', progress: 0 },
  { id: 'nomic-embed-text', name: 'Nomic Embed Text', type: 'embedding', size: '270 MB', ram: '1 GB', vram: '512 MB', status: 'Ready', progress: 100 },
  { id: 'minilm-l6', name: 'MiniLM L6', type: 'search', size: '90 MB', ram: '512 MB', vram: '256 MB', status: 'Ready', progress: 100 },
  { id: 'deepseek-r1-7b', name: 'DeepSeek R1 7B', type: 'reasoning', size: '5.0 GB', ram: '8 GB', vram: '6 GB', status: 'Not Installed', progress: 0 },
  { id: 'phi-3.5-mini', name: 'Phi-3.5 Mini 3.8B', type: 'coding', size: '2.2 GB', ram: '4 GB', vram: '3 GB', status: 'Not Installed', progress: 0 },
  { id: 'mistral-7b', name: 'Mistral 7B v0.3', type: 'reasoning', size: '4.1 GB', ram: '8 GB', vram: '6 GB', status: 'Not Installed', progress: 0 },
];

export const useModelsStore = create<ModelsState>((set, get) => ({
  models: initialModels,
  downloadModel: (id) => {
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, status: 'Downloading', progress: 0 } : m
      ),
    }));

    const interval = setInterval(() => {
      set((state) => {
        const model = state.models.find((m) => m.id === id);
        if (!model || model.progress >= 100) {
          clearInterval(interval);
          return {
            models: state.models.map((m) =>
              m.id === id ? { ...m, status: 'Ready', progress: 100 } : m
            ),
          };
        }
        return {
          models: state.models.map((m) =>
            m.id === id ? { ...m, progress: Math.min(100, m.progress + 10) } : m
          ),
        };
      });
    }, 200);
  },
  deleteModel: (id) => {
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, status: 'Not Installed', progress: 0 } : m
      ),
    }));
  },
}));
