import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLLM } from "@/contexts/LLMContext";
import { MODEL_CATALOG, FAMILIES, formatSize, type ModelInfo } from "@/lib/models";

const TAG_COLORS: Record<string, string> = {
  recommended: "bg-blue-500/20 text-blue-400",
  coding:      "bg-purple-500/20 text-purple-400",
  reasoning:   "bg-amber-500/20 text-amber-400",
  multilingual:"bg-cyan-500/20 text-cyan-400",
};

function ModelRow({ model, active, loading, onLoad }: {
  model: ModelInfo;
  active: boolean;
  loading: boolean;
  onLoad: () => void;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
      active
        ? "border-blue-500/50 bg-blue-500/5"
        : "border-border bg-card hover:bg-accent/40"
    }`}>
      <div className="min-w-0 flex-1 mr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{model.name}</span>
          {active && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Active</span>
          )}
          {model.tags.map((t) => (
            <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[t] ?? "bg-muted text-muted-foreground"}`}>
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{model.description}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-xs text-muted-foreground font-mono hidden sm:block">{formatSize(model.vramMB)}</span>
        <span className="text-xs text-muted-foreground font-mono hidden sm:block">
          {model.contextTokens >= 1000 ? `${Math.round(model.contextTokens / 1024)}K` : model.contextTokens} ctx
        </span>
        {active ? (
          <Badge variant="outline" className="text-blue-400 border-blue-500/50">Loaded</Badge>
        ) : (
          <Button size="sm" variant="outline" onClick={onLoad} disabled={loading}>
            {loading ? "Loading..." : "Load"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ModelsPage() {
  const { status, modelId, loadingProgress, loadingText, loadModel } = useLLM();
  const [activeFamily, setActiveFamily] = useState<string>(FAMILIES[0]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      await loadModel(id);
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = MODEL_CATALOG.filter((m) => m.family === activeFamily);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">AI Models</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Models run entirely in your browser. Downloaded once, then available offline.
            </p>
          </div>
          <Link href="/app">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">Close</Button>
          </Link>
        </div>

        {status === "loading" && loadingId && (
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-mono truncate pr-4">{loadingText}</span>
              <span className="font-mono shrink-0">{loadingProgress}%</span>
            </div>
            <div className="w-full rounded-full h-1.5 bg-muted">
              <div
                className="h-1.5 rounded-full transition-all duration-300 bg-blue-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {FAMILIES.map((family) => (
            <Button
              key={family}
              variant={activeFamily === family ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFamily(family)}
            >
              {family}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((model) => (
            <ModelRow
              key={model.id}
              model={model}
              active={modelId === model.id}
              loading={loadingId === model.id && status === "loading"}
              onLoad={() => handleLoad(model.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
