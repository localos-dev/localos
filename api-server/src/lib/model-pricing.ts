// Price in USDC base units (6 decimals) for each paid model.
// Free models return 0. Matches the frontend getModelPrice logic.
// 2-3 GB VRAM = 15 USDC, 3-4 GB = 20 USDC, 4 GB+ = 25 USDC.

const USDC_15 = 15_000_000;
const USDC_20 = 20_000_000;
const USDC_25 = 25_000_000;

// Model VRAM sizes in MB (source of truth: lib/models in frontend)
const MODEL_VRAM: Record<string, number> = {
  "Llama-3.2-1B-Instruct-q4f16_1-MLC":       910,
  "Llama-3.2-3B-Instruct-q4f16_1-MLC":       2140,
  "Llama-3.1-8B-Instruct-q4f16_1-MLC":       5000,
  "Qwen2.5-3B-Instruct-q4f16_1-MLC":         2000,
  "Qwen2.5-7B-Instruct-q4f16_1-MLC":         4700,
  "Qwen2.5-72B-Instruct-q4f32_0-MLC":        45000,
  "Hermes-3-Llama-3.1-8B-q4f16_1-MLC":       5000,
  "Mistral-7B-Instruct-v0.3-q4f16_1-MLC":    4200,
  "Phi-3.5-mini-instruct-q4f16_1-MLC":       3100,
  "Phi-4-mini-instruct-q4f16_1-MLC":         3500,
  "Gemma-2-2b-it-q4f16_1-MLC":              1500,
  "SmolLM2-1.7B-Instruct-q4f16_1-MLC":       1100,
  "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC": 4700,
  "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC":5000,
  "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC":    700,
};

export function getModelPrice(modelId: string): number {
  const vramMb = MODEL_VRAM[modelId];
  if (vramMb === undefined) return 0;
  const gb = vramMb / 1024;
  if (gb < 2.0) return 0;
  if (gb < 3.0) return USDC_15;
  if (gb < 4.0) return USDC_20;
  return USDC_25;
}
