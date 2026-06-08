import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import { AnimatePresence } from "framer-motion";
import { wagmiConfig } from "@/lib/contract";

import LandingPage from "@/pages/LandingPage";
import AppPage from "@/pages/AppPage";
import ModelsPage from "@/pages/ModelsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import SettingsPage from "@/pages/SettingsPage";
import FeaturesPage from "@/pages/FeaturesPage";
import AboutPage from "@/pages/AboutPage";
import ChangelogPage from "@/pages/ChangelogPage";
import DocsPage from "@/pages/DocsPage";
import KnowledgeBasePage from "@/pages/KnowledgeBasePage";
import CommunityPage from "@/pages/CommunityPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import ContactPage from "@/pages/ContactPage";
import InstallPage from "@/pages/InstallPage";
import DownloadModelPage from "@/pages/DownloadModelPage";
import BootSequencePage from "@/pages/BootSequencePage";
import ChatFeaturePage from "@/pages/ChatFeaturePage";
import BuildFeaturePage from "@/pages/BuildFeaturePage";
import ContextMemoryPage from "@/pages/ContextMemoryPage";
import WebBuilderPage from "@/pages/WebBuilderPage";
import AppBuilderPage from "@/pages/AppBuilderPage";
import CodeEditorPage from "@/pages/CodeEditorPage";
import LlamaModelsPage from "@/pages/LlamaModelsPage";
import OtherModelsPage from "@/pages/OtherModelsPage";
import ProjectsFeaturePage from "@/pages/ProjectsFeaturePage";
import { LLMProvider } from "@/contexts/LLMContext";
import MobileGate from "@/components/MobileGate";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/app" component={() => <MobileGate><AppPage /></MobileGate>} />
        <Route path="/models" component={ModelsPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/features" component={FeaturesPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/changelog" component={ChangelogPage} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/knowledge-base" component={KnowledgeBasePage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/install" component={InstallPage} />
        <Route path="/download-model" component={DownloadModelPage} />
        <Route path="/boot-sequence" component={BootSequencePage} />
        <Route path="/chat-feature" component={ChatFeaturePage} />
        <Route path="/build-feature" component={BuildFeaturePage} />
        <Route path="/context-memory" component={ContextMemoryPage} />
        <Route path="/web-builder" component={WebBuilderPage} />
        <Route path="/app-builder" component={AppBuilderPage} />
        <Route path="/code-editor" component={CodeEditorPage} />
        <Route path="/models/llama" component={LlamaModelsPage} />
        <Route path="/models/other" component={OtherModelsPage} />
        <Route path="/projects-feature" component={ProjectsFeaturePage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <LLMProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </LLMProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </WagmiProvider>
  );
}

export default App;
