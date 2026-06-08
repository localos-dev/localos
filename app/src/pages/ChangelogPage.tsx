import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function VelocityChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const commits = [4, 11, 18, 27, 35, 42];
  const max = 45;
  const W = 340; const H = 110;
  const padX = 24; const padY = 10;
  const iW = W - padX * 2; const iH = H - padY * 2 - 20;

  const pts = commits.map((v, i) => ({
    x: padX + (i / (commits.length - 1)) * iW,
    y: padY + iH - (v / max) * iH,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = line + ` L ${pts[pts.length - 1].x} ${padY + iH} L ${pts[0].x} ${padY + iH} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="velClip">
          <motion.rect x="0" y="0" height={H}
            initial={{ width: 0 }}
            animate={inView ? { width: W } : { width: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }} />
        </clipPath>
      </defs>
      <path d={area} fill="url(#velGrad)" clipPath="url(#velClip)" />
      <path d={line} fill="none" stroke="#0052FF" strokeWidth="2" clipPath="url(#velClip)" />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={4} fill="#0052FF"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 + i * 0.1 }} />
      ))}
      {months.map((m, i) => (
        <text key={m} x={padX + (i / (commits.length - 1)) * iW} y={H - 4}
          textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{m}</text>
      ))}
      <text x={W} y={12} textAnchor="end" fontSize="9" fill="rgba(0,82,255,0.7)">cumulative releases</text>
    </svg>
  );
}

const CHANGELOG = [
  {
    version: "0.5.0",
    date: "June 2026",
    tag: "Latest",
    tagColor: "#0052FF",
    items: [
      { type: "New", text: "Megamenu navigation on landing page with submenu content per section" },
      { type: "New", text: "Footer links now navigate to full standalone detail pages" },
      { type: "Improved", text: "Monaco editor workers bundled via Vite for reliable offline loading" },
      { type: "Improved", text: "Sidebar auto-restores last active project and chat on mount" },
      { type: "Fixed", text: "Open in Editor now correctly sets the right panel file ID" },
    ],
  },
  {
    version: "0.4.0",
    date: "May 2026",
    tag: "Stable",
    tagColor: "rgba(0,200,100,0.8)",
    items: [
      { type: "New", text: "Build button sends prompts through the web builder pipeline" },
      { type: "New", text: "CodeEditorView with Monaco editor and all five worker types" },
      { type: "New", text: "RightPanel shows file tree and code panel without requiring a project" },
      { type: "Improved", text: "Chat streaming uses raw fetch with ReadableStream for SSE compatibility" },
      { type: "Fixed", text: "Logo links to home from both the app navbar and the sidebar" },
    ],
  },
  {
    version: "0.3.0",
    date: "April 2026",
    tag: "",
    tagColor: "",
    items: [
      { type: "New", text: "Knowledge base with local document indexing and in-conversation context injection" },
      { type: "New", text: "Settings page with system status, Ollama health check, and theme toggle" },
      { type: "New", text: "Projects page with grid layout showing chat and file counts" },
      { type: "Improved", text: "Boot sequence checks backend, database, LLM runtime, and storage in sequence" },
    ],
  },
  {
    version: "0.2.0",
    date: "March 2026",
    tag: "",
    tagColor: "",
    items: [
      { type: "New", text: "Three-panel workspace layout: Sidebar, Chat or Editor, Right panel" },
      { type: "New", text: "Models page with full Ollama-compatible model catalog and download controls" },
      { type: "New", text: "SQLite database via better-sqlite3 and Drizzle ORM, no DATABASE_URL needed" },
      { type: "Improved", text: "Landing page with 15 sections and Framer Motion scroll animations" },
    ],
  },
  {
    version: "0.1.0",
    date: "January 2026",
    tag: "Initial",
    tagColor: "rgba(255,255,255,0.3)",
    items: [
      { type: "New", text: "Initial release of LocalOS" },
      { type: "New", text: "Ollama integration for local LLM chat with SSE streaming" },
      { type: "New", text: "Basic chat interface with project and file management" },
      { type: "New", text: "LocalStorage-based storage layer with no IndexedDB dependency" },
    ],
  },
];

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  New: { bg: "rgba(0,82,255,0.15)", color: "#4d88ff" },
  Improved: { bg: "rgba(0,160,90,0.12)", color: "rgba(0,210,120,0.9)" },
  Fixed: { bg: "rgba(255,160,0,0.1)", color: "rgba(255,180,50,0.9)" },
};

export default function ChangelogPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Changelog
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              What is new in <span style={{ color: "#0052FF" }}>LocalOS</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              A running record of every release, improvement, and fix since the first commit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Velocity chart */}
      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Release velocity</div>
              <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Cumulative features and releases shipped since January 2026</div>
              <VelocityChart />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "rgba(0,82,255,0.2)" }} />

            <div className="space-y-10">
              {CHANGELOG.map((entry, ei) => (
                <Reveal key={entry.version} delay={ei * 0.08}>
                  <div className="flex gap-6">
                    {/* Dot */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 relative"
                        style={{ background: ei === 0 ? "#0052FF" : "rgba(0,82,255,0.15)", border: `2px solid ${ei === 0 ? "#0052FF" : "rgba(0,82,255,0.3)"}` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: ei === 0 ? "white" : "#0052FF" }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-black text-white">v{entry.version}</span>
                        {entry.tag && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: entry.tagColor + "20", color: entry.tagColor, border: `1px solid ${entry.tagColor}40` }}>
                            {entry.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>{entry.date}</div>
                      <div className="rounded-2xl p-5 space-y-3"
                        style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.1)" }}>
                        {entry.items.map((item, ii) => (
                          <div key={ii} className="flex items-start gap-3">
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                              style={{ background: TYPE_STYLES[item.type]?.bg, color: TYPE_STYLES[item.type]?.color }}>
                              {item.type}
                            </span>
                            <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
