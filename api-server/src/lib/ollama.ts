import { Ollama } from "ollama";

export const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

export async function isOllamaRunning(): Promise<boolean> {
  try {
    await ollama.list();
    return true;
  } catch {
    return false;
  }
}

export async function getOllamaVersion(): Promise<string | null> {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/version");
    const data = await response.json() as { version: string };
    return data.version;
  } catch {
    return null;
  }
}

export async function listInstalledModels(): Promise<string[]> {
  try {
    const { models } = await ollama.list();
    return models.map((m) => m.name);
  } catch {
    return [];
  }
}

export const MODEL_CATALOG = [
  {
    name: "smollm2:360m",
    displayName: "SmolLM2 360M",
    type: "reasoning" as const,
    size: "271 MB",
    ram: "1 GB",
    vram: "512 MB",
    ollamaId: "smollm2:360m",
  },
  {
    name: "qwen2.5:0.5b",
    displayName: "Qwen 2.5 0.5B",
    type: "reasoning" as const,
    size: "397 MB",
    ram: "1 GB",
    vram: "512 MB",
    ollamaId: "qwen2.5:0.5b",
  },
  {
    name: "tinyllama",
    displayName: "TinyLlama 1.1B",
    type: "reasoning" as const,
    size: "637 MB",
    ram: "2 GB",
    vram: "1 GB",
    ollamaId: "tinyllama",
  },
  {
    name: "llama3.2",
    displayName: "Llama 3.2 3B",
    type: "reasoning" as const,
    size: "2.0 GB",
    ram: "4 GB",
    vram: "3 GB",
    ollamaId: "llama3.2",
  },
  {
    name: "llama3.1:8b",
    displayName: "Llama 3.1 8B",
    type: "reasoning" as const,
    size: "4.7 GB",
    ram: "8 GB",
    vram: "6 GB",
    ollamaId: "llama3.1:8b",
  },
  {
    name: "qwen2.5-coder:7b",
    displayName: "Qwen 2.5 Coder 7B",
    type: "coding" as const,
    size: "4.3 GB",
    ram: "8 GB",
    vram: "5 GB",
    ollamaId: "qwen2.5-coder:7b",
  },
  {
    name: "llava:7b",
    displayName: "LLaVA 1.6 7B",
    type: "vision" as const,
    size: "5.1 GB",
    ram: "10 GB",
    vram: "8 GB",
    ollamaId: "llava:7b",
  },
  {
    name: "nomic-embed-text",
    displayName: "Nomic Embed Text",
    type: "embedding" as const,
    size: "270 MB",
    ram: "1 GB",
    vram: "512 MB",
    ollamaId: "nomic-embed-text",
  },
  {
    name: "deepseek-r1:7b",
    displayName: "DeepSeek R1 7B",
    type: "reasoning" as const,
    size: "5.0 GB",
    ram: "8 GB",
    vram: "6 GB",
    ollamaId: "deepseek-r1:7b",
  },
  {
    name: "phi3.5",
    displayName: "Phi-3.5 Mini 3.8B",
    type: "coding" as const,
    size: "2.2 GB",
    ram: "4 GB",
    vram: "3 GB",
    ollamaId: "phi3.5",
  },
  {
    name: "mistral:7b",
    displayName: "Mistral 7B v0.3",
    type: "reasoning" as const,
    size: "4.1 GB",
    ram: "8 GB",
    vram: "6 GB",
    ollamaId: "mistral:7b",
  },
];

export const DEFAULT_SETUP_MODEL = "tinyllama";
