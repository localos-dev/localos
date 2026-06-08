import { useAppStore } from "@/stores/appStore";
import {
  useListFiles, useGetFile, useUpdateFile, useCreateFile,
  getListFilesQueryKey, getGetFileQueryKey,
} from "@/lib/local-hooks";
import { useState, useEffect, useRef } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import type { editor as MonacoEditor } from "monaco-editor";

// Wire Monaco workers from the bundled files, works fully offline
self.MonacoEnvironment = {
  getWorker(_: string, label: string): Worker {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less") return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor") return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};
loader.config({ monaco });

export default function CodeEditorView() {
  const { currentProjectId, currentFileId, setCurrentFileId } = useAppStore();
  const queryClient = useQueryClient();

  const { data: files = [] } = useListFiles(currentProjectId || 0, {
    query: {
      queryKey: getListFilesQueryKey(currentProjectId || 0),
      enabled: !!currentProjectId,
    },
  });

  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const { data: activeFile } = useGetFile(
    currentProjectId || 0,
    activeFileId || 0,
    {
      query: {
        queryKey: getGetFileQueryKey(currentProjectId || 0, activeFileId || 0),
        enabled: !!activeFileId,
      },
    }
  );

  // Invalidate on mount so the file list is always fresh when switching to the editor tab
  useEffect(() => {
    if (currentProjectId) {
      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey(currentProjectId) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  const updateFile = useUpdateFile();
  const createFile = useCreateFile();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);

  // Auto-select first file when list loads
  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id ?? null);
    }
  }, [files, activeFileId]);

  // When chat opens a file via store signal, jump to it
  useEffect(() => {
    if (currentFileId !== null) {
      setActiveFileId(currentFileId);
      setCurrentFileId(null);
    }
  }, [currentFileId, setCurrentFileId]);

  const handleCreate = () => {
    if (!filename || !currentProjectId) return;
    createFile.mutate(
      { projectId: currentProjectId, data: { name: filename, path: `/${filename}`, language: "typescript", content: "" } },
      {
        onSuccess: (file) => {
          queryClient.invalidateQueries({ queryKey: getListFilesQueryKey(currentProjectId) });
          setActiveFileId(file.id);
          setOpen(false);
          setFilename("");
        },
      }
    );
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || !activeFileId || !currentProjectId) return;
    updateFile.mutate({ projectId: currentProjectId, fileId: activeFileId, data: { content: value } });
  };

  // Force Monaco to recalculate layout after mount (fixes blank in flex containers)
  const handleEditorMount = (editor: MonacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    requestAnimationFrame(() => editor.layout());
  };

  if (!currentProjectId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a project to open the editor
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50 overflow-x-auto flex-shrink-0">
        {files.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFileId(f.id ?? null)}
            className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
              activeFileId === f.id ? "bg-background shadow-sm font-medium" : "hover:bg-background/50"
            }`}
          >
            {f.name}
          </button>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0">
              +
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="filename.ts"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
              <Button onClick={handleCreate} disabled={!filename.trim()}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language ?? "plaintext"}
            theme="vs-dark"
            value={activeFile.content ?? ""}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            loading={
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Loading editor...
              </div>
            }
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            {files.length === 0 ? "No files yet. Build something or create a file." : "Select a file above"}
          </div>
        )}
      </div>
    </div>
  );
}
