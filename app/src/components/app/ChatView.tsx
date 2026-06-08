import { useAppStore } from "@/stores/appStore";
import { getListChatsQueryKey, getListFilesQueryKey } from "@/lib/local-hooks";
import type { LocalChat, LocalMessage } from "@/lib/localstore";
import { createChat, getChat, appendMessage, createFile as createFileLocal } from "@/lib/localstore";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Copy, Check, Globe } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLLM } from "@/contexts/LLMContext";
import type { ChatMessage } from "@/contexts/LLMContext";
import { MODEL_CATALOG } from "@/lib/models";
import {
  buildBuildPrompt,
  extractHtmlFromResponse,
  generateFilename,
  injectFileId,
  extractFileId,
  guessBuildLabel,
  buildWebsiteContentPrompt,
  parseWebsiteFields,
} from "@/lib/website-engine";
import { randomBuildStyle } from "@/lib/build-styles";
import { getTemplateForRequest, fillWebsite } from "@/lib/templates";

// ── Context window guard ───────────────────────────────────────────────────

function trimHistory(messages: ChatMessage[], contextTokens: number): ChatMessage[] {
  const CHARS_PER_TOKEN = 4;
  const FILL_RATIO = 0.72;
  const maxChars = Math.floor(contextTokens * CHARS_PER_TOKEN * FILL_RATIO);
  let budget = maxChars;
  const kept: ChatMessage[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const cost = messages[i].content.length + 30;
    if (budget - cost < 200 && kept.length > 0) break;
    budget -= cost;
    kept.unshift(messages[i]);
  }
  return kept;
}

// ── Code block renderer ────────────────────────────────────────────────────

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <div className="rounded-lg overflow-hidden text-xs my-2" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>{lang || "code"}</span>
        <button onClick={copy} className="flex items-center gap-1 transition-colors" style={{ color: copied ? "#6ee7b7" : "rgba(255,255,255,0.4)" }}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{code}</pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {parts.map((part, i) => {
        const match = part.match(/^```([\w]*)\n([\s\S]*?)```$/);
        if (match) {
          const code = match[2].trimEnd();
          if (!code) return null;
          return <CodeBlock key={i} lang={match[1]} code={code} />;
        }
        return part ? <pre key={i} className="whitespace-pre-wrap font-sans">{part}</pre> : null;
      })}
    </div>
  );
}

// ── Build preview (iframe + code + Open in Editor) ─────────────────────────

function BuildPreview({ content }: { content: string }) {
  const { setRightPanelFileId } = useAppStore();
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileId = extractFileId(content);

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const openInEditor = () => {
    if (fileId !== null) {
      setRightPanelFileId(fileId);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          <Globe className="w-3 h-3" />
          <span>Preview</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCode((s) => !s)}
            className="text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {showCode ? "Hide Code" : "View Code"}
          </button>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: copied ? "#6ee7b7" : "rgba(255,255,255,0.4)" }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy HTML"}
          </button>
          {fileId !== null && (
            <button
              onClick={openInEditor}
              className="text-xs font-medium transition-colors"
              style={{ color: "#0052FF" }}
            >
              Open in Editor
            </button>
          )}
        </div>
      </div>
      <iframe
        srcDoc={content}
        sandbox="allow-scripts"
        className="w-full"
        style={{ height: "480px", border: "none", background: "#fff" }}
        title="Preview"
      />
      {showCode && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.5)", maxHeight: "320px", overflow: "auto" }}>
          <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.75)" }}>{content}</pre>
        </div>
      )}
    </div>
  );
}

function isHtmlDoc(content: string): boolean {
  const t = content.trimStart();
  return t.startsWith("<!DOCTYPE") || t.startsWith("<html");
}

const SYSTEM_PROMPT =
  "You are LocalOS AI, a helpful assistant built by the LocalOS team. " +
  "You run entirely on the user's device using WebLLM. No internet is required after the model is downloaded. " +
  "No data ever leaves the device. No telemetry, no cloud calls, no accounts needed. " +

  "If asked who you are: say you are LocalOS AI, built by the LocalOS team. " +
  "If asked who built you: say you were built by the LocalOS team. " +
  "Never use placeholder text or say 'your organization'. " +
  "Do not mention any other AI company, product, or model by name. " +

  "ABOUT LOCALOS: " +
  "LocalOS is a self-hosted local AI operating system that runs entirely in the browser. " +
  "Users open localos.xyz/app, download a model once from the Models page, and from that point the app works fully offline with no internet connection. " +
  "It is air-gap compatible and suitable for private, sensitive, or offline environments. " +
  "LocalOS is free and open source. The source code is at github.com/localos-dev. " +
  "The official website is localos.xyz. The official documentation is at localos.xyz/docs. " +
  "Follow LocalOS on X at x.com/localos_xyz. " +
  "The GitHub organization is github.com/localos-dev and contains four repositories: " +
  "localos (main app source), localos-site (website), localos-docs (documentation), localos-models (model catalog), and localos-contracts (smart contract). " +

  "FEATURES: " +
  "Chat: ask questions, get help with writing, code review, reasoning, and anything else. Runs on the local model. " +
  "Code Editor: write and edit code files directly inside the app with syntax highlighting. " +
  "Web Builder: type a description and the AI generates a full webpage. Preview renders instantly in-app. " +
  "Projects: organize work into projects, each with its own chats, files, and context. " +
  "Knowledge Base: save documents into a project knowledge base so the AI can reference them. " +
  "Models Page: browse, download, and switch between AI models. Models are cached in the browser after download. " +

  "MODELS: " +
  "LocalOS uses WebLLM to run models directly in the browser via WebGPU. " +
  "Models are downloaded once and cached in browser storage. No re-download needed on subsequent visits. " +
  "Free models (under 2 GB VRAM): TinyLlama 1.1B, Llama 3.2 1B, SmolLM2 1.7B, Gemma 2 2B. Good for quick tasks and low-RAM devices. " +
  "Paid models require a one-time USDC payment on Base (Ethereum L2): " +
  "15 USDC for 2 to 3 GB models (Llama 3.2 3B, Qwen 2.5 3B, Phi 3.5 Mini, Phi 4 Mini), " +
  "20 USDC for 3 to 4 GB models (Mistral 7B, Qwen 2.5 7B), " +
  "25 USDC for 4 GB and above (Llama 3.1 8B, Hermes 3 8B, DeepSeek R1 7B, DeepSeek R1 8B). " +
  "Payment is per wallet per model. Once paid, the model is unlocked permanently for that wallet address. No subscription. " +

  "PAYMENT SYSTEM: " +
  "To pay for a model, connect a wallet (MetaMask, Coinbase Wallet, or any browser wallet) on the Models page. " +
  "The app generates a fresh one-time address. Send the required USDC to that address from any wallet or exchange. " +
  "There is no contract interaction and no approval step. It is a plain USDC transfer, like sending to a friend. " +
  "The backend detects the payment on Base within 15 to 30 seconds and grants access automatically. " +
  "USDC is on the Base network (Ethereum L2). USDC contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913. " +
  "The LocalOS treasury contract on Base is at 0x9FFb768F76B657b94c0a4cC42dDAc51BB4cEfD02 (verified MIT license on Basescan). " +

  "TECHNICAL STACK: " +
  "Frontend: React, Vite, Tailwind CSS, Framer Motion, Wouter, WebLLM (WebGPU inference). " +
  "Backend: Express 5, SQLite via better-sqlite3 and Drizzle ORM, Node.js 24. " +
  "No database setup needed. SQLite auto-creates on first boot as a single local file. " +
  "No Postgres, no Redis, no external services required. " +
  "Smart contract: LocalOSTreasury.sol on Base mainnet, Solidity 0.8.22, non-upgradable, MIT license. " +

  "GETTING STARTED: " +
  "Open localos.xyz/app in a browser. No download or install needed. " +
  "Go to the Models page and download a free model. Takes a few minutes on first visit. " +
  "Create a project in the sidebar. Start a chat. " +
  "After the first model download, disconnect from the internet. Everything still works. " +
  "For developers: the full source is at github.com/localos-dev/localos. Requires Node.js 24 and pnpm. " +

  "RESPONSE STYLE: " +
  "For greetings or casual conversation, reply naturally and briefly. " +
  "For questions, answer clearly and concisely in plain text. " +
  "When writing code, always use a fenced code block with the correct language tag. " +
  "Never use emoji, arrows, checkmarks, em dashes, or decorative symbols. Plain English and punctuation only.";

// ── Main component ─────────────────────────────────────────────────────────

export default function ChatView() {
  const { currentProjectId, currentChatId, setCurrentChatId, setActiveTab } = useAppStore();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<LocalMessage[]>([]);

  useEffect(() => {
    if (!currentChatId) { setMessages([]); return; }
    setMessages(getChat(currentChatId)?.messages ?? []);
  }, [currentChatId]);

  const handleNewChat = () => {
    if (!currentProjectId) return;
    const chat = createChat(currentProjectId, { title: "New Chat" });
    queryClient.setQueryData(getListChatsQueryKey(currentProjectId), (old: LocalChat[] = []) => [
      ...old,
      chat,
    ]);
    setMessages([]);
    setCurrentChatId(chat.id);
    setActiveTab("chat");
  };

  const { chat: llmChat, status, modelId } = useLLM();

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [streamLabel, setStreamLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const summariesRef = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamContent]);

  // ── Send handler ───────────────────────────────────────────────────────

  const handleSend = async (mode: "chat" | "build" = "chat") => {
    if (!input.trim() || !currentChatId || !currentProjectId) return;
    if (status !== "ready") return;
    const content = input.trim();

    const projectId = currentProjectId;
    const chatId = currentChatId;

    setInput("");
    setStreaming(true);
    setStreamContent("");
    setStreamLabel("");
    setError(null);
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const addMsg = (role: "user" | "assistant", text: string) => {
      appendMessage(chatId, role, text);
      const msg: LocalMessage = { id: Date.now(), role, content: text, createdAt: Date.now() };
      setMessages((prev) => [...prev, msg]);
    };

    const done = (errMsg?: string) => {
      setStreaming(false);
      setStreamContent("");
      setStreamLabel("");
      if (errMsg) setError(errMsg);
    };

    addMsg("user", content);

    let lastFullResponse = "";

    try {
      // ── Build request ─────────────────────────────────────────────────
      if (mode === "build") {
        let html = "";

        // Try pre-built template first: no LLM needed for most types
        const template = getTemplateForRequest(content);
        if (template) {
          if (template.type === "website") {
            // Hybrid: hardcoded structure + LLM-generated content specific to the request
            setStreamLabel("Generating website content...");
            const contentPrompt = buildWebsiteContentPrompt(content);
            const rawFields = await llmChat(
              [{ role: "user", content: contentPrompt }],
              () => {},
              signal
            );
            const fields = parseWebsiteFields(rawFields || "");
            html = fillWebsite(template.html, fields, content);
          } else {
            setStreamLabel(`Building ${template.type}...`);
            await new Promise<void>((r) => setTimeout(r, 400));
            html = template.html;
          }
        } else {
          // Fallback to LLM for unknown types
          const style = randomBuildStyle();
          setStreamLabel(guessBuildLabel(content));
          const prompt = buildBuildPrompt(content, style);
          const rawResponse = await llmChat(
            [{ role: "user", content: prompt }],
            (chunk) => { lastFullResponse += chunk; },
            signal
          );
          lastFullResponse = rawResponse;
          if (rawResponse) html = extractHtmlFromResponse(rawResponse);
        }

        if (html) {
          const filename = generateFilename(content);
          const file = createFileLocal(projectId, {
            name: filename,
            path: `/${filename}`,
            language: "html",
            content: html,
          });
          queryClient.invalidateQueries({ queryKey: getListFilesQueryKey(projectId) });
          addMsg("assistant", injectFileId(html, file.id));
        }
        done();
        return;
      }

      // ── Regular chat ────────────────────────────────────────────────────
      const rawHistory: ChatMessage[] = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: isHtmlDoc(m.content)
          ? "[app/website generated, HTML omitted from context]"
          : m.content,
      }));
      rawHistory.push({ role: "user", content });

      const modelInfo = MODEL_CATALOG.find((m) => m.id === modelId);
      const contextTokens = modelInfo?.contextTokens ?? 2048;
      const CHARS_PER_TOKEN = 4;
      const historyBudget = Math.floor(contextTokens * CHARS_PER_TOKEN * 0.60);
      const totalHistoryChars = rawHistory.reduce((s, m) => s + m.content.length + 30, 0);

      let contextMessages: ChatMessage[];

      if (totalHistoryChars <= historyBudget) {
        contextMessages = rawHistory;
      } else {
        const trimmed = trimHistory(rawHistory, contextTokens);
        const splitIdx = rawHistory.length - trimmed.length;
        const toSummarize = rawHistory.slice(0, splitIdx);
        const recentHistory = trimmed;

        if (toSummarize.length > 0) {
          setStreamLabel("Summarizing earlier conversation...");

          const existingSummary = summariesRef.current.get(chatId);
          const msgLines = toSummarize
            .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content.slice(0, 400)}`)
            .join("\n\n");
          const summaryInput = existingSummary
            ? `Previous summary: ${existingSummary}\n\nAdditional exchanges:\n${msgLines}`
            : msgLines;

          const summaryPrompt: ChatMessage[] = [{
            role: "user",
            content: `Summarize this conversation in 3 sentences. Keep key facts, decisions, and any code discussed:\n\n${summaryInput.slice(0, contextTokens * 2)}\n\nSummary:`,
          }];

          const newSummary = await llmChat(summaryPrompt, () => {}, signal);
          summariesRef.current.set(chatId, newSummary.trim());
          setStreamLabel("");

          const systemWithMemory = `${SYSTEM_PROMPT}\n\nConversation memory: ${newSummary.trim()}`;
          const withSystem: ChatMessage[] = [
            { role: "system", content: systemWithMemory },
            ...recentHistory,
          ];

          let fullResponse = "";
          fullResponse = await llmChat(withSystem, (chunk) => {
            lastFullResponse += chunk;
            setStreamContent((prev) => prev + chunk);
          }, signal);
          lastFullResponse = fullResponse;

          if (fullResponse) addMsg("assistant", fullResponse);
          done();
          return;
        }

        contextMessages = recentHistory;
      }

      const withSystem: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...contextMessages];

      let fullResponse = "";
      fullResponse = await llmChat(withSystem, (chunk) => {
        lastFullResponse += chunk;
        setStreamContent((prev) => prev + chunk);
      }, signal);
      lastFullResponse = fullResponse;

      if (fullResponse) addMsg("assistant", fullResponse);
      done();
    } catch (e) {
      if (lastFullResponse) addMsg("assistant", lastFullResponse);
      const isAbort = (e as Error)?.name === "AbortError";
      done(isAbort ? undefined : (e instanceof Error ? e.message : "Something went wrong."));
    }
  };

  // ── Early returns ──────────────────────────────────────────────────────

  if (!currentProjectId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a project to start chatting
      </div>
    );
  }

  if (!currentChatId) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">No chats yet</p>
        <Button
          size="sm"
          onClick={handleNewChat}
          style={{ background: "#0052FF" }}
          className="text-white flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Loading AI model...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-full flex items-center justify-center text-red-400 text-sm">
        Failed to load AI model. Please reload the page.
      </div>
    );
  }

  const modelInfo = MODEL_CATALOG.find((m) => m.id === modelId);
  const isNano = modelInfo?.category === "nano";

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col">
      {modelId && (
        <div className="px-4 py-1.5 border-b bg-background/80 text-xs text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          {modelId.split("-q4")[0].replace(/-MLC$/, "")}
        </div>
      )}

      {isNano && (
        <div className="px-4 py-2 text-xs" style={{ background: "rgba(245,158,11,0.08)", borderBottom: "1px solid rgba(245,158,11,0.2)", color: "rgba(251,191,36,0.85)" }}>
          Nano model. Fast but limited reasoning. Use Small or Medium for complex tasks.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground text-sm">
            <p>Start a conversation</p>
            <p className="text-xs opacity-60">Try: "Build me a calculator" or ask anything</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "user" ? (
              <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{m.content}</pre>
              </div>
            ) : isHtmlDoc(m.content) ? (
              <div className="w-full max-w-[92%]">
                <BuildPreview content={m.content} />
              </div>
            ) : (
              <div className="max-w-[80%] rounded-lg p-3 bg-card border">
                <MessageContent content={m.content} />
              </div>
            )}
          </div>
        ))}

        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-card border">
              {streamLabel && (
                <p className="text-xs mb-2" style={{ color: "#0052FF" }}>{streamLabel}</p>
              )}
              {streamContent ? (
                <MessageContent content={streamContent} />
              ) : (
                <span className="inline-flex gap-1 items-center text-muted-foreground">
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded">{error}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend("chat");
              }
            }}
            placeholder="Ask anything"
            className="min-h-[72px] resize-none"
            disabled={streaming}
          />
          <div className="flex items-center justify-end gap-2">
            {streaming && (
              <button
                onClick={() => abortRef.current?.abort()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mr-auto"
              >
                Stop generating
              </button>
            )}
            <button
              onClick={() => void handleSend("build")}
              disabled={streaming || !input.trim() || status !== "ready"}
              className="px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ background: "#1a3a7a", color: "#ffffff", border: "2px solid #0052FF" }}
            >
              Build
            </button>
            <Button
              onClick={() => void handleSend("chat")}
              disabled={streaming || !input.trim() || status !== "ready"}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
