import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLLM } from "@/contexts/LLMContext";
import { MODEL_CATALOG, FAMILIES, formatSize, getModelPrice, type ModelInfo } from "@/lib/models";
import WalletButton from "@/components/WalletButton";
import PaymentModal from "@/components/PaymentModal";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

const TAG_COLORS: Record<string, string> = {
  recommended: "bg-blue-500/20 text-blue-400",
  coding:      "bg-purple-500/20 text-purple-400",
  reasoning:   "bg-amber-500/20 text-amber-400",
  multilingual:"bg-cyan-500/20 text-cyan-400",
};

function PriceBadge({ price }: { price: number | "free" }) {
  if (price === "free") {
    return (
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xs font-bold shrink-0"
        style={{
          background: "rgba(0,200,100,0.12)",
          border: "1.5px solid rgba(0,200,100,0.35)",
          color: "#4cff9f",
        }}
      >
        Free
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold shrink-0"
      style={{
        background: "rgba(0,82,255,0.12)",
        border: "1px solid rgba(0,82,255,0.3)",
        color: "#6699ff",
      }}
    >
      {price} USDC
    </span>
  );
}

function ModelRow({
  model,
  active,
  loading,
  price,
  paid,
  onLoad,
  onUnlock,
}: {
  model: ModelInfo;
  active: boolean;
  loading: boolean;
  price: number | "free";
  paid: boolean;
  onLoad: () => void;
  onUnlock: () => void;
}) {
  const canDownload = price === "free" || paid;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
        active
          ? "border-blue-500/50 bg-blue-500/5"
          : "border-border bg-card hover:bg-accent/40"
      }`}
    >
      <div className="min-w-0 flex-1 mr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{model.name}</span>
          {active && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Active</span>
          )}
          {paid && price !== "free" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Unlocked</span>
          )}
          {model.tags.map((t) => (
            <span
              key={t}
              className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[t] ?? "bg-muted text-muted-foreground"}`}
            >
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

        <PriceBadge price={price} />

        {active ? (
          <Badge variant="outline" className="text-blue-400 border-blue-500/50">Loaded</Badge>
        ) : canDownload ? (
          <Button size="sm" variant="outline" onClick={onLoad} disabled={loading}>
            {loading ? "Loading..." : "Load"}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onUnlock}
            className="font-semibold"
            style={{ background: "#0052FF", color: "#fff", border: "none" }}
          >
            Unlock
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
  const [payingModel, setPayingModel] = useState<ModelInfo | null>(null);
  const [paidSet, setPaidSet] = useState<Set<string>>(new Set());

  const { address, isConnected } = useAccount();

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      await loadModel(id);
    } finally {
      setLoadingId(null);
    }
  };

  const markPaid = useCallback((modelId: string) => {
    setPaidSet((prev) => new Set([...prev, modelId]));
  }, []);

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
          <div className="flex items-center gap-3">
            <WalletButton />
            <Link href="/app">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">Close</Button>
            </Link>
          </div>
        </div>

        {!isConnected && (
          <div
            className="p-4 rounded-xl text-sm"
            style={{
              background: "rgba(0,82,255,0.06)",
              border: "1px solid rgba(0,82,255,0.15)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Connect your wallet to unlock paid models. Free models (under 2 GB) load without a wallet.
          </div>
        )}

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
          {filtered.map((model) => {
            const price = getModelPrice(model.vramMB);
            const paid = price === "free" || paidSet.has(model.id);
            return (
              <AccessCheckedRow
                key={model.id}
                model={model}
                price={price}
                paid={paid}
                paidSet={paidSet}
                active={modelId === model.id}
                loading={loadingId === model.id && status === "loading"}
                address={address}
                onLoad={() => handleLoad(model.id)}
                onUnlock={() => setPayingModel(model)}
                onAccessConfirmed={markPaid}
              />
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
          <p>Free: under 2 GB. Paid: 2 to 3 GB = 15 USDC, 3 to 4 GB = 20 USDC, 4 GB and above = 25 USDC.</p>
          <p>Payments processed on Base. One-time per wallet per model. Access is permanent.</p>
        </div>
      </div>

      {payingModel && (
        <PaymentModal
          model={payingModel}
          price={getModelPrice(payingModel.vramMB) as number}
          onClose={() => setPayingModel(null)}
          onPaid={() => {
            markPaid(payingModel.id);
            setPayingModel(null);
          }}
        />
      )}
    </motion.div>
  );
}

function AccessCheckedRow({
  model,
  price,
  paid,
  paidSet,
  active,
  loading,
  address,
  onLoad,
  onUnlock,
  onAccessConfirmed,
}: {
  model: ModelInfo;
  price: number | "free";
  paid: boolean;
  paidSet: Set<string>;
  active: boolean;
  loading: boolean;
  address: `0x${string}` | undefined;
  onLoad: () => void;
  onUnlock: () => void;
  onAccessConfirmed: (id: string) => void;
}) {
  const shouldCheck = price !== "free" && !!address && !paidSet.has(model.id);

  useEffect(() => {
    if (!shouldCheck) return;
    let cancelled = false;
    fetch(`${BASE_URL}/api/payment/access?userWallet=${address}&modelId=${encodeURIComponent(model.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.hasAccess === true) onAccessConfirmed(model.id);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [shouldCheck, address, model.id, onAccessConfirmed]);

  return (
    <ModelRow
      model={model}
      active={active}
      loading={loading}
      price={price}
      paid={paid}
      onLoad={onLoad}
      onUnlock={onUnlock}
    />
  );
}
