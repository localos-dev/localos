import { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import type { MLCEngine } from "@mlc-ai/web-llm";
import { STORAGE_KEY } from "@/lib/models";

export type LLMStatus = "idle" | "loading" | "ready" | "error";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LLMState {
  status: LLMStatus;
  modelId: string | null;
  loadingText: string;
  loadingProgress: number;
  error: string | null;
}

interface LLMContextValue extends LLMState {
  loadModel: (modelId: string, onProgress?: (text: string, progress: number) => void) => Promise<void>;
  chat: (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ) => Promise<string>;
  reset: () => void;
}

const LLMContext = createContext<LLMContextValue | null>(null);

export function LLMProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<MLCEngine | null>(null);
  const [state, setState] = useState<LLMState>({
    status: "idle",
    modelId: null,
    loadingText: "",
    loadingProgress: 0,
    error: null,
  });

  const loadModel = useCallback(async (
    modelId: string,
    onProgress?: (text: string, progress: number) => void
  ) => {
    setState((s) => ({ ...s, status: "loading", modelId, loadingText: "Initializing...", loadingProgress: 0, error: null }));
    try {
      const { MLCEngine, prebuiltAppConfig } = await import("@mlc-ai/web-llm");

      // Patch ALL model records to resolve context_window_size / sliding_window_size conflict.
      // Some models ship with both values positive which causes a TVM runtime crash.
      // appConfig must be passed at engine construction time — reload() only takes 2 args.
      const appConfig = {
        ...prebuiltAppConfig,
        model_list: prebuiltAppConfig.model_list.map((m) => ({
          ...m,
          overrides: { ...(m.overrides ?? {}), sliding_window_size: -1 },
        })),
      };

      // Recreate engine with the patched config so overrides take effect
      if (engineRef.current) {
        engineRef.current.unload().catch(() => {});
      }
      engineRef.current = new MLCEngine({ appConfig });
      const engine = engineRef.current;

      engine.setInitProgressCallback((report) => {
        const text = report.text ?? "";
        const progress = Math.round((report.progress ?? 0) * 100);
        setState((s) => ({ ...s, loadingText: text, loadingProgress: progress }));
        onProgress?.(text, progress);
      });

      await engine.reload(modelId);

      localStorage.setItem(STORAGE_KEY, modelId);
      setState((s) => ({ ...s, status: "ready", loadingText: "", loadingProgress: 100 }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, status: "error", error: msg }));
      throw err;
    }
  }, []);

  const chat = useCallback(async (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<string> => {
    if (!engineRef.current) throw new Error("LLM engine not loaded");
    let fullContent = "";
    const stream = await engineRef.current.chat.completions.create({
      messages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
    });
    for await (const chunk of stream) {
      if (signal?.aborted) break;
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        fullContent += delta;
        onChunk(delta);
      }
    }
    return fullContent;
  }, []);

  const reset = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.unload().catch(() => {});
      engineRef.current = null;
    }
    localStorage.removeItem(STORAGE_KEY);
    setState({ status: "idle", modelId: null, loadingText: "", loadingProgress: 0, error: null });
  }, []);

  return (
    <LLMContext.Provider value={{ ...state, loadModel, chat, reset }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const ctx = useContext(LLMContext);
  if (!ctx) throw new Error("useLLM must be used within LLMProvider");
  return ctx;
}
