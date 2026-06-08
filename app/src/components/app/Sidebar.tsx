import { listProjects, createProject, listChats, createChat, countChats, countFiles, type LocalProject, type LocalChat } from "@/lib/localstore";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Settings, Box, MessageSquare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

const PROJECT_COLORS = ["#0052FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

type ProjectRow = LocalProject & { chatCount: number; fileCount: number };

function loadProjects(): ProjectRow[] {
  return listProjects().map((p) => ({
    ...p,
    chatCount: countChats(p.id),
    fileCount: countFiles(p.id),
  }));
}

export default function Sidebar() {
  const { currentProjectId, setCurrentProjectId, currentChatId, setCurrentChatId, setActiveTab } = useAppStore();
  const [, setLocation] = useLocation();

  const [projects, setProjects] = useState<ProjectRow[]>(loadProjects);
  const [chats, setChats] = useState<LocalChat[]>(() =>
    currentProjectId ? listChats(currentProjectId) : []
  );

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [createError, setCreateError] = useState<string | null>(null);

  // Auto-restore last project + chat on page load (store resets on refresh)
  useEffect(() => {
    if (!currentProjectId) {
      const all = listProjects();
      if (all.length > 0) {
        const last = all[all.length - 1];
        setCurrentProjectId(last.id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      setChats(listChats(currentProjectId));
    } else {
      setChats([]);
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (!currentChatId && chats.length > 0) {
      // Restore the most recent chat
      const last = chats[chats.length - 1];
      setCurrentChatId(last.id ?? null);
      setActiveTab("chat");
    }
  }, [chats]);

  const handleCreateProject = () => {
    if (!name.trim()) return;
    setCreateError(null);
    try {
      const project = createProject({ name: name.trim(), description: description.trim(), color });
      const chat = createChat(project.id, { title: "New Chat" });

      setProjects((prev) => [...prev, { ...project, chatCount: 1, fileCount: 0 }]);
      setChats([chat]);
      setCurrentProjectId(project.id);
      setCurrentChatId(chat.id);
      setActiveTab("chat");
      setOpen(false);
      setName("");
      setDescription("");
      setColor(PROJECT_COLORS[0]);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create project.");
    }
  };

  const handleSelectProject = (id: number) => {
    if (id === currentProjectId) return;
    setCurrentChatId(null);
    setCurrentProjectId(id);
    setLocation("/app");
  };

  const handleNewChat = () => {
    if (!currentProjectId) return;
    try {
      const chat = createChat(currentProjectId, { title: "New Chat" });
      setChats((prev) => [...prev, chat]);
      setCurrentChatId(chat.id);
      setActiveTab("chat");
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="p-4 flex items-center justify-between border-b">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="LocalOS" className="w-7 h-7 object-contain flex-shrink-0" />
          <span className="font-bold text-lg">LocalOS</span>
        </a>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost"><Plus className="w-4 h-4" /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Project Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateProject()}
              />
              <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <div className="flex gap-2">
                {PROJECT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-primary" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {createError && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/40 rounded px-3 py-2">{createError}</p>
              )}
              <Button onClick={handleCreateProject} disabled={!name.trim()}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase">Projects</h3>
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${currentProjectId === p.id ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-accent"}`}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || "#ccc" }} />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>

          {currentProjectId && (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">Recent Chats</h3>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={handleNewChat}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              {chats.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentChatId(c.id ?? null);
                    setActiveTab("chat");
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm truncate ${currentChatId === c.id ? "bg-accent font-medium" : "hover:bg-accent/50"}`}
                >
                  <MessageSquare className="w-3 h-3 inline mr-2" />
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t space-y-1">
        <Link href="/models" className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent w-full text-left">
          <Box className="w-4 h-4" /> Models
        </Link>
        <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent w-full text-left">
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </div>
  );
}
