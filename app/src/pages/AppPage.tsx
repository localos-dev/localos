import { useEffect, useState, useRef, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/app/Sidebar";
import ChatView from "@/components/app/ChatView";
import CodeEditorView from "@/components/app/CodeEditorView";
import WebBuilderView from "@/components/app/WebBuilderView";
import RightPanel from "@/components/app/RightPanel";
import { useAppStore } from "@/stores/appStore";
import { useLLM } from "@/contexts/LLMContext";
import {
  MODEL_CATALOG,
  FAMILIES,
  STORAGE_KEY,
  formatSize,
  type ModelInfo,
} from "@/lib/models";

// ── Online status hook ─────────────────────────────────────────────────────

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return isOnline;
}

// ── Shared nav for setup screens ───────────────────────────────────────────

function SetupNav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center px-5 md:px-10 py-4">
      <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="LocalOS" className="w-8 h-8 object-contain" />
        <span className="font-semibold text-white tracking-tight text-sm">LocalOS</span>
      </a>
    </nav>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        <span className="truncate pr-4 font-mono">{label}</span>
        <span className="font-mono shrink-0">{value}%</span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: "#0052FF" }}
        />
      </div>
    </div>
  );
}

// ── Log terminal ───────────────────────────────────────────────────────────

function LogTerminal({ lines }: { lines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);
  return (
    <div
      className="rounded-xl font-mono text-xs h-28 overflow-y-auto p-4 space-y-0.5"
      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {lines.length === 0 && <p style={{ color: "rgba(255,255,255,0.2)" }}>Waiting...</p>}
      {lines.map((line, i) => (
        <p
          key={i}
          style={{ color: i === lines.length - 1 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}
        >
          {line}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ── Tag badge ──────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  recommended: { bg: "rgba(0,82,255,0.2)",   color: "#6699FF" },
  coding:      { bg: "rgba(139,92,246,0.2)", color: "#a78bfa" },
  reasoning:   { bg: "rgba(245,158,11,0.2)", color: "#fbbf24" },
  multilingual:{ bg: "rgba(6,182,212,0.2)",  color: "#67e8f9" },
  fast:        { bg: "rgba(16,185,129,0.2)", color: "#6ee7b7" },
};

function TagBadge({ label }: { label: string }) {
  const style = TAG_STYLES[label] ?? { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" };
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ background: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
}

// ── Model card ─────────────────────────────────────────────────────────────

function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: ModelInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 rounded-xl transition-all duration-200"
      style={{
        background: selected ? "rgba(0,82,255,0.18)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${selected ? "#0052FF" : "rgba(255,255,255,0.09)"}`,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.09)";
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white leading-snug truncate">{model.name}</p>
          <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            {model.description}
          </p>
        </div>
        <div className="shrink-0 text-right flex flex-col items-end gap-1.5 pt-0.5">
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
            {formatSize(model.vramMB)}
          </span>
          <div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
            style={{
              borderColor: selected ? "#0052FF" : "rgba(255,255,255,0.25)",
              background: selected ? "#0052FF" : "transparent",
            }}
          >
            {selected && (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
        </div>
      </div>
      {model.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {model.tags.map((t) => <TagBadge key={t} label={t} />)}
        </div>
      )}
    </button>
  );
}

// ── Family group ───────────────────────────────────────────────────────────

// ── Setup wizard ───────────────────────────────────────────────────────────

type SetupPhase = "pick" | "downloading" | "offline_wait";

function SetupWizard({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<SetupPhase>("pick");
  const [search, setSearch] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>(FAMILIES[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { loadModel } = useLLM();
  const isOnline = useOnlineStatus();

  const isSearching = search.trim().length > 0;

  const searchResults = isSearching
    ? MODEL_CATALOG.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.family.toLowerCase().includes(search.toLowerCase()) ||
          m.tags.some((t) => t.includes(search.toLowerCase()))
      )
    : MODEL_CATALOG.filter((m) => m.family === activeFamily);

  const selectedModel = MODEL_CATALOG.find((m) => m.id === selectedId);

  const handleDownload = useCallback(async () => {
    if (!selectedId) return;
    setPhase("downloading");
    setLogs(["Starting download..."]);
    setProgress(0);
    setDownloadError(null);

    // Request persistent storage so the browser grants maximum quota
    // and does not evict model files under storage pressure.
    if (navigator.storage?.persist) {
      await navigator.storage.persist().catch(() => {});
    }

    // Warn if available quota looks too small for the selected model.
    if (navigator.storage?.estimate) {
      const { quota = 0, usage = 0 } = await navigator.storage.estimate().catch(() => ({ quota: 0, usage: 0 }));
      const model = MODEL_CATALOG.find((m) => m.id === selectedId);
      const modelBytes = (model?.vramMB ?? 0) * 1024 * 1024;
      const available = quota - usage;
      if (modelBytes > 0 && available > 0 && available < modelBytes) {
        const availableMb = Math.round(available / 1024 / 1024);
        const needMb = model?.vramMB ?? 0;
        setDownloadError(
          `Not enough browser storage space. You have about ${availableMb} MB available but this model needs ${needMb} MB. Free up disk space on your device or clear browser storage, then try again.`
        );
        setPhase("downloading");
        return;
      }
    }

    try {
      await loadModel(selectedId, (text, pct) => {
        setLogs((prev) => {
          if (prev[prev.length - 1] === text) return prev;
          return [...prev, text];
        });
        setProgress(pct);
      });
      setPhase("offline_wait");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isQuota =
        msg.toLowerCase().includes("quota") ||
        msg.toLowerCase().includes("storage") ||
        (err instanceof DOMException && err.name === "QuotaExceededError");
      if (isQuota) {
        setDownloadError(
          "Storage quota exceeded. Your browser ran out of space while caching the model. Free up disk space on your device, clear browser cache (Settings, Clear browsing data, Cached images and files), then try again."
        );
      } else {
        setDownloadError(msg);
      }
    }
  }, [selectedId, loadModel]);

  const canEnter = !isOnline || import.meta.env.DEV;

  // ── Pick phase ──────────────────────────────────────────────────────────

  if (phase === "pick") {
    return (
      <div
        className="min-h-screen text-white flex flex-col"
        style={{ background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)" }}
      >
        <SetupNav />

        <div className="flex-1 flex flex-col pt-20 pb-28">
          <div className="max-w-7xl mx-auto w-full px-5 md:px-10 flex flex-col gap-6 flex-1">

            {/* Header */}
            <div className="pt-4">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
                style={{ letterSpacing: "-0.03em" }}
              >
                Choose your AI model
              </h1>
              <p className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
                Your model downloads once and runs entirely on your device.
              </p>
            </div>

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, family, or capability..."
              className="w-full rounded-xl px-5 py-3 text-sm text-white outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(0,82,255,0.8)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)")}
            />

            {/* Family tabs — hidden while searching */}
            {!isSearching && (
              <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-2 min-w-max">
                  {FAMILIES.map((family) => {
                    const count = MODEL_CATALOG.filter((m) => m.family === family).length;
                    const isActive = activeFamily === family;
                    return (
                      <button
                        key={family}
                        onClick={() => setActiveFamily(family)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                        style={{
                          background: isActive ? "#0052FF" : "rgba(255,255,255,0.06)",
                          color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                          border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                          }
                        }}
                      >
                        <span>{family}</span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                          style={{
                            background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                            color: isActive ? "#ffffff" : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Model grid */}
            <div className="flex-1 overflow-y-auto pb-4">
              {isSearching && (
                <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{search}"
                </p>
              )}
              {searchResults.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p style={{ color: "rgba(255,255,255,0.3)" }} className="text-sm">No models found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {searchResults.map((m) => (
                    <ModelCard
                      key={m.id}
                      model={m}
                      selected={selectedId === m.id}
                      onSelect={() => setSelectedId(m.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky action bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-20"
          style={{
            background: "rgba(0,5,30,0.92)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between gap-6">
            {selectedModel ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedModel.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {formatSize(selectedModel.vramMB)} download
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all shrink-0"
                  style={{ background: "#0052FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}
                >
                  Download and Install
                </button>
              </>
            ) : (
              <p className="text-sm w-full text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                Select a model above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Downloading phase ───────────────────────────────────────────────────

  if (phase === "downloading") {
    return (
      <div
        className="min-h-screen text-white flex flex-col items-center justify-center px-5 md:px-10"
        style={{ background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)" }}
      >
        <SetupNav />
        <div className="w-full max-w-xl space-y-8">
          <div>
            <h1
              className="text-4xl font-bold tracking-tight text-white mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Downloading model
            </h1>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              {selectedModel?.name} is being downloaded and cached in your browser.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <LogTerminal lines={logs} />
            <ProgressBar value={progress} label={logs[logs.length - 1] ?? "Initializing..."} />
          </div>

          {downloadError && (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <p className="text-sm text-red-400">{downloadError}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setPhase("pick"); setDownloadError(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                >
                  Back to model list
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ background: "#0052FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
            Keep this tab open until the download completes.
          </p>
        </div>
      </div>
    );
  }

  // ── Offline wait phase ──────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-5 md:px-10"
      style={{ background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)" }}
    >
      <SetupNav />
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1
            className="text-4xl font-bold tracking-tight text-white mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            Model ready
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            {selectedModel?.name} is downloaded and cached.
          </p>
        </div>

        <div
          className="rounded-2xl p-8 space-y-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="space-y-4">
            <div
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.9)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Turn off your internet</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              LocalOS is designed to run completely offline. Disconnect your Wi-Fi or network, then click Enter.
              All AI inference happens on your device with zero data sent anywhere.
            </p>
          </div>

          <div className="space-y-2.5">
            <p
              className="text-xs font-semibold"
              style={{ color: isOnline ? "rgba(251,191,36,0.9)" : "rgba(52,211,153,0.9)" }}
            >
              {isOnline ? "Internet: Connected. Please disconnect." : "Internet: Offline. Ready to enter."}
            </p>
            <div className="w-full rounded-full h-1" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: isOnline ? "0%" : "100%",
                  background: isOnline ? "rgba(251,191,36,0.7)" : "rgba(52,211,153,0.7)",
                }}
              />
            </div>
          </div>

          <button
            onClick={onDone}
            disabled={isOnline && !import.meta.env.DEV}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "#0052FF" }}
            onMouseEnter={(e) => { if (!isOnline || import.meta.env.DEV) e.currentTarget.style.background = "#0040CC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0052FF"; }}
          >
            {isOnline && !import.meta.env.DEV ? "Disconnect to continue" : "Enter LocalOS"}
          </button>

          {import.meta.env.DEV && isOnline && (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Dev mode: offline check bypassed
            </p>
          )}
        </div>

        <button
          onClick={() => setPhase("pick")}
          className="text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          Change model
        </button>
      </div>
    </div>
  );
}

// ── Offline blocker (returning visitor) ────────────────────────────────────

function OfflineBlocker({ modelId, onEnter }: { modelId: string; onEnter: () => void }) {
  const isOnline = useOnlineStatus();
  const canEnter = !isOnline || import.meta.env.DEV;
  const model = MODEL_CATALOG.find((m) => m.id === modelId);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-5 md:px-10"
      style={{ background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)" }}
    >
      <SetupNav />
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1
            className="text-4xl font-bold tracking-tight text-white mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            LocalOS
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            Model: {model?.name ?? modelId}
          </p>
        </div>

        <div
          className="rounded-2xl p-8 space-y-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="space-y-4">
            <div
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.9)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Turn off your internet to continue</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Your model is ready. LocalOS requires you to go offline before chatting.
              This guarantees zero data leaves your device.
            </p>
          </div>

          <div className="space-y-2.5">
            <p
              className="text-xs font-semibold"
              style={{ color: isOnline ? "rgba(251,191,36,0.9)" : "rgba(52,211,153,0.9)" }}
            >
              {isOnline ? "Internet: Connected. Please disconnect." : "Internet: Offline. Ready to enter."}
            </p>
            <div className="w-full rounded-full h-1" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: isOnline ? "0%" : "100%",
                  background: isOnline ? "rgba(251,191,36,0.7)" : "rgba(52,211,153,0.7)",
                }}
              />
            </div>
          </div>

          <button
            onClick={onEnter}
            disabled={!canEnter}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "#0052FF" }}
            onMouseEnter={(e) => { if (canEnter) e.currentTarget.style.background = "#0040CC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0052FF"; }}
          >
            {canEnter ? "Enter LocalOS" : "Disconnect to continue"}
          </button>

          {import.meta.env.DEV && isOnline && (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Dev mode: offline check bypassed
            </p>
          )}
        </div>

        <button
          onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}
          className="text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          Change model
        </button>
      </div>
    </div>
  );
}

// ── OS Workspace ───────────────────────────────────────────────────────────

function OSWorkspace() {
  const { activeTab } = useAppStore();
  const { status, loadModel, modelId, loadingText, loadingProgress } = useLLM();
  const savedModelId = localStorage.getItem(STORAGE_KEY);

  useEffect(() => {
    if (status === "idle" && savedModelId && !modelId) {
      loadModel(savedModelId).catch(() => {});
    }
  }, [status, savedModelId, modelId, loadModel]);

  if (status === "loading") {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)" }}
      >
        <img src="/logo.png" alt="LocalOS" className="w-12 h-12 object-contain" />
        <div className="w-72 space-y-3 text-center">
          <p className="text-sm font-medium text-white">Loading AI model...</p>
          <div className="w-full rounded-full h-1" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%`, background: "#0052FF" }}
            />
          </div>
          <p className="text-xs font-mono truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <div className="h-px w-full" style={{ background: "rgba(0,82,255,0.3)" }} />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={20} minSize={14} maxSize={30}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />
        <Panel defaultSize={58}>
          <div className="h-full flex flex-col">
            {activeTab === "chat" && <ChatView />}
            {activeTab === "editor" && <CodeEditorView />}
            {activeTab === "preview" && <WebBuilderView />}
          </div>
        </Panel>
        <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />
        <Panel defaultSize={22} minSize={14} maxSize={32}>
          <RightPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

// ── Main AppPage ───────────────────────────────────────────────────────────

export default function AppPage() {
  const savedModelId = localStorage.getItem(STORAGE_KEY);
  const isOnline = useOnlineStatus();
  const [entered, setEntered] = useState(false);

  if (!savedModelId && !entered) {
    return <SetupWizard onDone={() => setEntered(true)} />;
  }

  if (savedModelId && isOnline && !entered && !import.meta.env.DEV) {
    return <OfflineBlocker modelId={savedModelId} onEnter={() => setEntered(true)} />;
  }

  return <OSWorkspace />;
}
