import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

type MegaItem = { title: string; desc: string; href: string };
type MegaCategory = { label: string; items: MegaItem[] };
type MegaData = {
  categories: MegaCategory[];
  featured: { title: string; desc: string; cta: string; href: string };
};

const MEGA: Record<string, MegaData> = {
  "How It Works": {
    categories: [
      {
        label: "Setup",
        items: [
          { title: "Install", desc: "Auto-configures the AI runtime with no terminal commands or config files.", href: "/install" },
          { title: "Download a Model", desc: "Pick from a curated catalog. Model files are stored entirely on your machine.", href: "/download-model" },
          { title: "Boot Sequence", desc: "Database, filesystem, and AI runtime are verified and ready on every startup.", href: "/boot-sequence" },
        ],
      },
      {
        label: "Workflow",
        items: [
          { title: "Projects", desc: "Organize all your work into isolated project spaces with their own chats and files.", href: "/projects-feature" },
          { title: "Chat", desc: "Multi-turn conversations with full context memory, all running locally.", href: "/chat-feature" },
          { title: "Build", desc: "Generate complete web apps, tools, and calculators from a single prompt.", href: "/build-feature" },
        ],
      },
    ],
    featured: {
      title: "From install to offline in minutes",
      desc: "LocalOS handles installation, model loading, and runtime setup automatically. Once complete, disconnect your network and everything continues without interruption.",
      cta: "See the full setup",
      href: "/install",
    },
  },
  "Capabilities": {
    categories: [
      {
        label: "AI",
        items: [
          { title: "Conversational Chat", desc: "Multi-turn dialogue with any downloaded model, streamed token by token.", href: "/chat-feature" },
          { title: "Knowledge Base", desc: "Index your documents locally. The AI reads from them in every conversation.", href: "/knowledge-base" },
          { title: "Context Memory", desc: "Full chat history stays in your session. Nothing sent to a server.", href: "/context-memory" },
        ],
      },
      {
        label: "Build",
        items: [
          { title: "Web Builder", desc: "Generate complete websites with layout, copy, and styling from a description.", href: "/web-builder" },
          { title: "App Builder", desc: "Produce interactive tools, calculators, and dashboards ready to preview instantly.", href: "/app-builder" },
          { title: "Code Editor", desc: "Monaco editor with syntax highlighting for every file generated in a project.", href: "/code-editor" },
        ],
      },
    ],
    featured: {
      title: "Full-stack AI, no cloud required",
      desc: "From conversation to complete app generation, LocalOS covers every AI-assisted workflow without sending a single token to an external server.",
      cta: "Explore all capabilities",
      href: "/features",
    },
  },
  "Models": {
    categories: [
      {
        label: "Llama",
        items: [
          { title: "Llama 3.2 1B", desc: "879 MB. Fastest inference. Runs on any device including low-end hardware.", href: "/models/llama" },
          { title: "Llama 3.2 3B", desc: "2.2 GB. Best balance of speed and output quality.", href: "/models/llama" },
          { title: "Llama 3.1 8B", desc: "4.9 GB. Industry standard for general-purpose tasks.", href: "/models/llama" },
        ],
      },
      {
        label: "Other Families",
        items: [
          { title: "Qwen 2.5", desc: "6 variants from 1.5B to 7B. Strong reasoning and instruction following.", href: "/models/other" },
          { title: "Gemma 3", desc: "Google open model. Compact with high capability per parameter.", href: "/models/other" },
          { title: "Phi and Mistral", desc: "Microsoft and Mistral AI. Efficient models with small memory footprint.", href: "/models/other" },
        ],
      },
    ],
    featured: {
      title: "Run any open model",
      desc: "LocalOS supports the full catalog of open models. Switch between them without restarting. All stored and executed on your own hardware.",
      cta: "Browse the model catalog",
      href: "/models",
    },
  },
};

function MegaDropdown({ label, onClose }: { label: string; onClose: () => void }) {
  const menu = MEGA[label];
  if (!menu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "700px",
        background: "rgba(4, 9, 24, 0.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(0,82,255,0.15)",
        borderRadius: "16px",
        boxShadow: "0 24px 60px rgba(0,0,255,0.12), 0 2px 0 rgba(0,82,255,0.2) inset",
        overflow: "hidden",
      }}
    >
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #0052FF, transparent)" }} />

      <div className="flex gap-0">
        <div className="flex-1 p-6 flex gap-6">
          {menu.categories.map((cat) => (
            <div key={cat.label} className="flex-1">
              <div className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.12em" }}>
                {cat.label}
              </div>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <a key={item.title} href={item.href} onClick={onClose}
                    className="group block rounded-xl px-3 py-2.5 transition-all"
                    style={{ textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <div className="text-sm font-semibold mb-0.5 transition-colors"
                      style={{ color: "rgba(255,255,255,0.85)" }}>
                      {item.title}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {item.desc}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 flex flex-col justify-between p-6"
          style={{ width: "220px", borderLeft: "1px solid rgba(0,82,255,0.1)", background: "rgba(0,82,255,0.04)" }}>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(0,82,255,0.6)", letterSpacing: "0.12em" }}>
              Featured
            </div>
            <div className="text-sm font-bold text-white leading-snug mb-3">{menu.featured.title}</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{menu.featured.desc}</div>
          </div>
          <a href={menu.featured.href} onClick={onClose}
            className="mt-5 block text-center text-xs font-semibold py-2 px-3 rounded-lg transition-all"
            style={{ background: "rgba(0,82,255,0.15)", color: "#6699ff", border: "1px solid rgba(0,82,255,0.25)", textDecoration: "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.25)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.15)"; }}>
            {menu.featured.cta}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function SiteNavbar({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openWith = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const NAV_ITEMS = ["How It Works", "Capabilities", "Models"] as const;

  const solidBg = !transparent || scrolled || openMenu;

  return (
    <div ref={navRef} className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="flex items-center justify-between px-5 md:px-10 py-4 transition-all duration-300"
        style={{
          background: solidBg ? "rgba(4, 9, 24, 0.96)" : "transparent",
          backdropFilter: solidBg ? "blur(18px)" : "none",
          borderBottom: solidBg ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="LocalOS" className="w-8 h-8 object-contain flex-shrink-0" />
          <span className="font-semibold text-white tracking-tight text-sm">LocalOS</span>
        </a>

        <div className="hidden md:flex items-center gap-1 relative">
          {NAV_ITEMS.map((label) => (
            <button key={label}
              onMouseEnter={() => openWith(label)}
              onMouseLeave={scheduleClose}
              onClick={() => setOpenMenu(openMenu === label ? null : label)}
              className="relative px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                color: openMenu === label ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                background: openMenu === label ? "rgba(0,82,255,0.1)" : "transparent",
              }}>
              {label}
              <span className="block absolute bottom-1 left-1/2 h-px transition-all duration-200"
                style={{ width: openMenu === label ? "60%" : "0%", transform: "translateX(-50%)", background: "#0052FF" }} />
            </button>
          ))}

          <AnimatePresence>
            {openMenu && (
              <div className="absolute top-full left-1/2 mt-2"
                style={{ transform: "translateX(-50%)" }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}>
                <MegaDropdown label={openMenu} onClose={() => setOpenMenu(null)} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setLocation("/app")}
          data-testid="nav-enter-btn"
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all"
          style={{ background: "#0052FF" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
          Open App
        </button>
      </nav>
    </div>
  );
}
