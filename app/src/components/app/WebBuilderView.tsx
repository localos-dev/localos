import { useState, useRef, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import { useLLM } from "@/contexts/LLMContext";
import type { ChatMessage } from "@/contexts/LLMContext";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 2rem;
      background: #0a0f1c;
      color: #e2e8f0;
    }
    h1 { color: #0052FF; }
  </style>
</head>
<body>
  <h1>Hello from LocalOS</h1>
  <p>Edit this HTML or describe what you want to build in the prompt below.</p>
</body>
</html>`;

function extractHtml(text: string): string | null {
  const fenced = text.match(/```html\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const full = text.match(/```\s*([\s\S]*?)```/);
  if (full) return full[1].trim();
  if (text.includes("<!DOCTYPE") || text.includes("<html")) return text.trim();
  return null;
}

export default function WebBuilderView() {
  const { chat: llmChat, status } = useLLM();
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [streamLog, setStreamLog] = useState("");
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || generating || status !== "ready") return;

    setGenerating(true);
    setStreamLog("");

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an expert web developer. The user describes a web page. " +
          "Respond with ONLY a complete, self-contained HTML document inside a ```html code block. " +
          "Include all CSS in a <style> tag and all JS in a <script> tag. No explanations outside the code block.",
      },
      { role: "user", content: `Build this: ${prompt}` },
    ];

    try {
      let fullContent = "";
      await llmChat(
        messages,
        (chunk) => {
          fullContent += chunk;
          setStreamLog(fullContent);
        },
        ctrl.signal
      );
      const extracted = extractHtml(fullContent);
      if (extracted) {
        setHtml(extracted);
        setActiveView("preview");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setStreamLog(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setGenerating(false);
      setStreamLog("");
    }
  }, [prompt, generating, status, llmChat]);

  return (
    <div className="h-full flex flex-col bg-background" data-testid="web-builder">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <button
          onClick={() => setActiveView("editor")}
          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
            activeView === "editor"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="editor-tab"
        >
          HTML Editor
        </button>
        <button
          onClick={() => setActiveView("preview")}
          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
            activeView === "preview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="preview-tab"
        >
          Preview
        </button>
        <div className="ml-auto text-xs text-muted-foreground">
          Web Builder
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeView === "editor" ? (
          <Editor
            height="100%"
            language="html"
            theme="vs-dark"
            value={html}
            onChange={(v) => setHtml(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: "on",
            }}
          />
        ) : (
          <iframe
            data-testid="preview-iframe"
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Web preview"
          />
        )}
      </div>

      <div className="border-t bg-muted/20 p-3 space-y-2">
        {generating && streamLog && (
          <div className="text-xs text-muted-foreground font-mono bg-muted/40 rounded px-3 py-2 max-h-16 overflow-hidden">
            <span className="text-primary">Generating... </span>
            {streamLog.slice(-120)}
          </div>
        )}
        <div className="flex gap-2">
          <input
            data-testid="web-builder-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Describe the page you want to build..."
            className="flex-1 bg-background border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={generating}
          />
          <button
            data-testid="generate-btn"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || status !== "ready"}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating" : "Generate"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          AI generates the full page. Edit the HTML directly or describe changes in the prompt.
        </p>
      </div>
    </div>
  );
}
