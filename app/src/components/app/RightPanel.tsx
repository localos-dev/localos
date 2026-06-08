import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import {
  useGetProject, useListFiles, useCreateFile, useCreateKnowledge, useGetChat,
  getGetProjectQueryKey, getListFilesQueryKey, getListKnowledgeQueryKey, getGetChatQueryKey,
} from "@/lib/local-hooks";
import { getFile } from "@/lib/localstore";
import type { LocalFile } from "@/lib/localstore";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLLM } from "@/contexts/LLMContext";
import { getModelById } from "@/lib/models";

function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
    py: "python", css: "css", html: "html", json: "json", md: "markdown",
    sh: "shell", yaml: "yaml", yml: "yaml", txt: "plaintext",
  };
  return map[ext] ?? "plaintext";
}

// ── Inline code viewer shown when "Open in Editor" is clicked in chat ────────

function CodePanel({ fileId, onClose }: { fileId: number; onClose: () => void }) {
  const [file, setFile] = useState<LocalFile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFile(getFile(fileId) ?? null);
  }, [fileId]);

  const copy = () => {
    if (!file) return;
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  if (!file) return null;

  return (
    <div className="flex flex-col" style={{ maxHeight: "62%", borderBottom: "2px solid #0052FF" }}>
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ background: "rgba(0,82,255,0.12)", borderBottom: "1px solid rgba(0,82,255,0.25)" }}
      >
        <div>
          <div className="text-xs font-bold" style={{ color: "#6699ff" }}>Code</div>
          <div className="text-xs truncate max-w-[130px] text-muted-foreground" title={file.name}>{file.name}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={copy}
            className="text-xs font-medium transition-colors"
            style={{ color: copied ? "#6ee7b7" : "rgba(255,255,255,0.5)" }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onClose}
            className="text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Close
          </button>
        </div>
      </div>
      <div className="overflow-auto flex-1" style={{ background: "rgba(0,0,0,0.55)" }}>
        <pre
          className="p-3 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {file.content}
        </pre>
      </div>
    </div>
  );
}

export default function RightPanel() {
  const { currentProjectId, currentChatId, setActiveTab, rightPanelFileId, setRightPanelFileId } = useAppStore();
  const queryClient = useQueryClient();

  const { data: project } = useGetProject(currentProjectId || 0, {
    query: { queryKey: getGetProjectQueryKey(currentProjectId || 0), enabled: !!currentProjectId },
  });
  const { data: files = [] } = useListFiles(currentProjectId || 0, {
    query: { queryKey: getListFilesQueryKey(currentProjectId || 0), enabled: !!currentProjectId },
  });
  const { data: chat } = useGetChat(currentProjectId || 0, currentChatId || 0, {
    query: {
      queryKey: getGetChatQueryKey(currentProjectId || 0, currentChatId || 0),
      enabled: !!currentProjectId && !!currentChatId,
    },
  });

  const { status, modelId } = useLLM();
  const model = modelId ? getModelById(modelId) : null;

  const createFile = useCreateFile();
  const createKnowledge = useCreateKnowledge();

  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [knowledgeName, setKnowledgeName] = useState("");
  const [knowledgeContent, setKnowledgeContent] = useState("");

  const handleNewFile = () => {
    const name = newFileName.trim();
    if (!name || !currentProjectId) return;
    createFile.mutate(
      { projectId: currentProjectId, data: { name, path: `/${name}`, language: detectLanguage(name), content: "" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFilesQueryKey(currentProjectId) });
          setNewFileOpen(false);
          setNewFileName("");
          setActiveTab("editor");
        },
      }
    );
  };

  const handleAddKnowledge = () => {
    const name = knowledgeName.trim();
    const content = knowledgeContent.trim();
    if (!name || !content || !currentProjectId) return;
    createKnowledge.mutate(
      { projectId: currentProjectId, data: { name, content, type: "text" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey(currentProjectId) });
          setKnowledgeOpen(false);
          setKnowledgeName("");
          setKnowledgeContent("");
        },
      }
    );
  };

  const handleExportChat = () => {
    const messages = chat?.messages ?? [];
    if (!messages.length) return;
    const title = chat?.title ?? "Chat export";
    const lines: string[] = [`# ${title}\n`];
    for (const m of messages) {
      const speaker = m.role === "user" ? "You" : "LocalOS AI";
      lines.push(`**${speaker}**\n\n${m.content}`);
    }
    const blob = new Blob([lines.join("\n\n---\n\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentProjectId || !project) {
    return (
      <div className="h-full flex flex-col bg-card border-l overflow-hidden">
        {/* Code panel still works even without a project */}
        {rightPanelFileId !== null && (
          <CodePanel fileId={rightPanelFileId} onClose={() => setRightPanelFileId(null)} />
        )}
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          {rightPanelFileId === null ? "Select a project to view details" : ""}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l overflow-hidden">

      {/* Code panel: shown when "Open in Editor" is clicked from chat */}
      {rightPanelFileId !== null && (
        <CodePanel fileId={rightPanelFileId} onClose={() => setRightPanelFileId(null)} />
      )}

      <div className="p-4 border-b flex-shrink-0">
        <h2 className="font-bold text-lg">{project.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
      </div>

      <div className="p-4 border-b flex-shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Active AI Model</h3>
        {status === "ready" && model ? (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {model.name}
          </div>
        ) : status === "loading" ? (
          <div className="text-sm text-yellow-500">Loading model...</div>
        ) : (
          <div className="text-sm text-muted-foreground">No model loaded</div>
        )}
      </div>

      <div className="p-4 flex-1 overflow-auto border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Project Files</h3>
        <div className="space-y-1">
          {files.map((f) => (
            <div
              key={f.id}
              className="text-sm px-2 py-1 rounded hover:bg-accent cursor-pointer truncate"
              onClick={() => {
                setRightPanelFileId(f.id ?? null);
              }}
            >
              {f.path}
            </div>
          ))}
          {files.length === 0 && <div className="text-sm text-muted-foreground">No files</div>}
        </div>
      </div>

      <div className="p-4 flex-shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setNewFileOpen(true)}
          >
            New File
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setKnowledgeOpen(true)}
          >
            Add Knowledge
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleExportChat}
            disabled={!chat?.messages?.length}
          >
            Export Chat
          </Button>
        </div>
      </div>

      {/* New File dialog */}
      <Dialog open={newFileOpen} onOpenChange={setNewFileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="filename.ts"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewFile()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setNewFileOpen(false)}>Cancel</Button>
              <Button onClick={handleNewFile} disabled={!newFileName.trim() || createFile.isPending}>
                {createFile.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Knowledge dialog */}
      <Dialog open={knowledgeOpen} onOpenChange={setKnowledgeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Knowledge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Document name"
              value={knowledgeName}
              onChange={(e) => setKnowledgeName(e.target.value)}
              autoFocus
            />
            <Textarea
              placeholder="Paste any text, notes, docs, or context you want the AI to know about..."
              value={knowledgeContent}
              onChange={(e) => setKnowledgeContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setKnowledgeOpen(false)}>Cancel</Button>
              <Button
                onClick={handleAddKnowledge}
                disabled={!knowledgeName.trim() || !knowledgeContent.trim() || createKnowledge.isPending}
              >
                {createKnowledge.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
