import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useLLM } from "@/contexts/LLMContext";
import { getModelById } from "@/lib/models";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { status: llmStatus, modelId } = useLLM();
  const activeModel = modelId ? getModelById(modelId) : null;

  const [storageEstimate, setStorageEstimate] = useState("...");
  useEffect(() => {
    navigator.storage.estimate().then(({ usage }) => {
      if (usage !== undefined) {
        setStorageEstimate(`${(usage / 1024 / 1024).toFixed(1)} MB`);
      } else {
        setStorageEstimate("unavailable");
      }
    }).catch(() => setStorageEstimate("unavailable"));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Settings</h1>
          <Link href="/app">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">Close</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-mono text-sm text-green-500">Local (device)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Active AI Model</span>
                <span className={`font-mono text-sm ${llmStatus === "ready" ? "text-green-500" : llmStatus === "loading" ? "text-yellow-500" : "text-muted-foreground"}`}>
                  {llmStatus === "ready" && activeModel ? activeModel.name : llmStatus === "loading" ? "Loading..." : "None loaded"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">AI Inference</span>
                <span className="font-mono text-sm text-green-500">On-device (WebAssembly)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Browser Storage Used</span>
                <span className="font-mono text-sm">{storageEstimate}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex gap-2">
                  <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>Light</Button>
                  <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>Dark</Button>
                  <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>System</Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-medium">AI Models</label>
                <p className="text-sm text-muted-foreground mb-2">Switch or load a different AI model.</p>
                <Link href="/models">
                  <Button variant="secondary" className="w-full">Manage Models</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
