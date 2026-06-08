import { motion } from "framer-motion";
import { useListProjects } from "@/lib/local-hooks";
import { useAppStore } from "@/stores/appStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Folder, MessageSquare, FileCode2 } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects = [] } = useListProjects();
  const { setCurrentProjectId } = useAppStore();
  const [, setLocation] = useLocation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <Card 
              key={p.id} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                setCurrentProjectId(p.id);
                setLocation("/app");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color || '#ccc' }} />
                  {p.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {p.chatCount}</span>
                  <span className="flex items-center gap-1"><FileCode2 className="w-4 h-4" /> {p.fileCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center p-12 text-muted-foreground border rounded-lg border-dashed">
              No projects found. Create one from the App sidebar.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
