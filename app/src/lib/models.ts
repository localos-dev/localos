export interface ModelInfo {
  id: string;
  name: string;
  family: string;
  vramMB: number;
  contextTokens: number;
  category: "nano" | "small" | "medium" | "large";
  tags: string[];
  description: string;
}

export const MODEL_CATALOG: ModelInfo[] = [
  // ── Llama ────────────────────────────────────────────────────────────────
  { id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",       name: "Llama 3.2 1B",              family: "Llama",   vramMB: 879,  contextTokens: 8192,  category: "nano",   tags: ["recommended"],              description: "Meta Llama 3.2 1B. Fastest model, works on any device." },
  { id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",       name: "Llama 3.2 3B",              family: "Llama",   vramMB: 2264, contextTokens: 8192,  category: "medium", tags: ["recommended"],              description: "Meta Llama 3.2 3B. Best balance of quality and speed." },
  { id: "Llama-3.1-8B-Instruct-q4f16_1-MLC",       name: "Llama 3.1 8B",              family: "Llama",   vramMB: 5001, contextTokens: 16384, category: "large",  tags: ["recommended"],              description: "Meta Llama 3.1 8B. Industry standard for general AI tasks." },

  // ── Qwen ─────────────────────────────────────────────────────────────────
  { id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",       name: "Qwen 2.5 1.5B",             family: "Qwen",    vramMB: 1630, contextTokens: 4096,  category: "small",  tags: ["multilingual"],             description: "Qwen 2.5 compact. Multilingual including Indonesian." },
  { id: "Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC", name: "Qwen 2.5 Coder 1.5B",      family: "Qwen",    vramMB: 1630, contextTokens: 4096,  category: "small",  tags: ["coding"],                   description: "Code-focused Qwen 2.5. Great for programming tasks." },
  { id: "Qwen2.5-3B-Instruct-q4f16_1-MLC",          name: "Qwen 2.5 3B",               family: "Qwen",    vramMB: 2505, contextTokens: 8192,  category: "medium", tags: ["multilingual"],             description: "Qwen 2.5 3B. Strong multilingual and reasoning." },
  { id: "Qwen2.5-Coder-3B-Instruct-q4f16_1-MLC",   name: "Qwen 2.5 Coder 3B",        family: "Qwen",    vramMB: 2505, contextTokens: 8192,  category: "medium", tags: ["coding"],                   description: "Code-specialized Qwen 2.5 3B. Excellent for development." },
  { id: "Qwen2.5-7B-Instruct-q4f16_1-MLC",          name: "Qwen 2.5 7B",               family: "Qwen",    vramMB: 5107, contextTokens: 8192,  category: "large",  tags: ["multilingual"],             description: "Qwen 2.5 full 7B. Best multilingual performance." },
  { id: "Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC",   name: "Qwen 2.5 Coder 7B",        family: "Qwen",    vramMB: 5107, contextTokens: 8192,  category: "large",  tags: ["coding", "recommended"],    description: "Best-in-class coding model at 7B. All programming tasks." },

  // ── Gemma ─────────────────────────────────────────────────────────────────
  { id: "gemma-2-2b-it-q4f16_1-MLC",                name: "Gemma 2 2B",                family: "Gemma",   vramMB: 1895, contextTokens: 8192,  category: "small",  tags: ["recommended"],              description: "Google Gemma 2 2B. Punches above its weight class." },
  { id: "gemma-2-9b-it-q4f16_1-MLC",                name: "Gemma 2 9B",                family: "Gemma",   vramMB: 6422, contextTokens: 8192,  category: "large",  tags: ["recommended"],              description: "Google Gemma 2 9B. Best quality Gemma model available." },

  // ── Phi ───────────────────────────────────────────────────────────────────
  { id: "Phi-4-mini-instruct-q4f16_1-MLC",          name: "Phi 4 Mini",                family: "Phi",     vramMB: 3438, contextTokens: 16384, category: "medium", tags: ["reasoning", "recommended"], description: "Microsoft Phi 4 Mini. State-of-the-art reasoning at medium size." },
  { id: "Phi-3.5-mini-instruct-q4f16_1-MLC",        name: "Phi 3.5 Mini",              family: "Phi",     vramMB: 3672, contextTokens: 16384, category: "medium", tags: ["reasoning"],                description: "Microsoft Phi 3.5 Mini. Excellent at math and structured tasks." },

  // ── Mistral ───────────────────────────────────────────────────────────────
  { id: "Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC", name: "Ministral 3B",         family: "Mistral", vramMB: 2864, contextTokens: 32768, category: "medium", tags: [],                           description: "Mistral compact 3B. Efficient and capable." },
  { id: "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",    name: "Mistral 7B v0.3",           family: "Mistral", vramMB: 4573, contextTokens: 32768, category: "large",  tags: [],                           description: "Mistral 7B latest version. Great for general tasks." },

  // ── Hermes ────────────────────────────────────────────────────────────────
  { id: "Hermes-3-Llama-3.2-3B-q4f16_1-MLC",       name: "Hermes 3 Llama 3.2 3B",    family: "Hermes",  vramMB: 2264, contextTokens: 8192,  category: "medium", tags: ["reasoning"],                description: "Hermes fine-tune of Llama 3.2 3B. Better instruction following." },
  { id: "OpenHermes-2.5-Mistral-7B-q4f16_1-MLC",   name: "OpenHermes 2.5 Mistral 7B",family: "Hermes",  vramMB: 4573, contextTokens: 32768, category: "large",  tags: [],                           description: "Hermes fine-tune of Mistral 7B. Strong at following instructions." },
  { id: "NeuralHermes-2.5-Mistral-7B-q4f16_1-MLC", name: "NeuralHermes 2.5 Mistral 7B",family:"Hermes", vramMB: 4573, contextTokens: 32768, category: "large",  tags: [],                           description: "Neural fine-tune of Mistral 7B. Enhanced conversational ability." },
  { id: "Hermes-2-Pro-Mistral-7B-q4f16_1-MLC",     name: "Hermes 2 Pro Mistral 7B",  family: "Hermes",  vramMB: 4033, contextTokens: 32768, category: "large",  tags: [],                           description: "Hermes Pro on Mistral 7B. Function calling and JSON capable." },
  { id: "Hermes-3-Llama-3.1-8B-q4f16_1-MLC",       name: "Hermes 3 Llama 3.1 8B",    family: "Hermes",  vramMB: 4876, contextTokens: 16384, category: "large",  tags: ["reasoning"],                description: "Hermes 3 on Llama 3.1 8B. Superior instruction following." },
];

export const FAMILIES = [...new Set(MODEL_CATALOG.map((m) => m.family))];

export const CATEGORY_LABELS: Record<ModelInfo["category"], string> = {
  nano:   "Nano (under 1 GB)",
  small:  "Small (1 to 2.5 GB)",
  medium: "Medium (2.5 to 4.5 GB)",
  large:  "Large (4.5 GB and up)",
};

export function formatSize(vramMB: number): string {
  if (vramMB < 1024) return `${vramMB} MB`;
  return `${(vramMB / 1024).toFixed(1)} GB`;
}

export function getModelById(id: string): ModelInfo | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

export const STORAGE_KEY = "localos_model_id";
