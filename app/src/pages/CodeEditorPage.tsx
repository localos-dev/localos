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

function EditorMockSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const lines = [
    { text: "<!DOCTYPE html>", color: "rgba(255,255,255,0.5)", indent: 0 },
    { text: "<html lang=\"en\">", color: "rgba(0,150,255,0.9)", indent: 0 },
    { text: "<head>", color: "rgba(0,150,255,0.9)", indent: 12 },
    { text: "<title>My App</title>", color: "rgba(255,255,255,0.6)", indent: 24 },
    { text: "</head>", color: "rgba(0,150,255,0.9)", indent: 12 },
    { text: "<body>", color: "rgba(0,150,255,0.9)", indent: 12 },
    { text: "<h1>Hello, LocalOS</h1>", color: "rgba(255,255,255,0.7)", indent: 24 },
    { text: "</body>", color: "rgba(0,150,255,0.9)", indent: 12 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 420 200" className="w-full" style={{ maxHeight: 200 }}>
      <motion.rect x="10" y="10" width="400" height="180" rx="10" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} />
      {/* Tab bar */}
      <rect x="10" y="10" width="400" height="28" rx="10" fill="rgba(255,255,255,0.04)" />
      <rect x="10" y="24" width="400" height="14" fill="rgba(255,255,255,0.04)" />
      <rect x="18" y="14" width="80" height="22" rx="4" fill="rgba(0,82,255,0.2)" stroke="rgba(0,82,255,0.4)" strokeWidth="1" />
      <text x="58" y="29" textAnchor="middle" fontSize="8" fontWeight="600" fill="white">index.html</text>
      <text x="120" y="29" fontSize="8" fill="rgba(255,255,255,0.3)">style.css</text>
      <text x="172" y="29" fontSize="8" fill="rgba(255,255,255,0.3)">app.js</text>
      {/* Line numbers + code */}
      {lines.map((line, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.35 + i * 0.07 }}>
          <text x="28" y={56 + i * 16} fontSize="8" fill="rgba(255,255,255,0.2)" textAnchor="end">{i + 1}</text>
          <text x={34 + line.indent} y={56 + i * 16} fontSize="9" fill={line.color} fontFamily="monospace">{line.text}</text>
        </motion.g>
      ))}
      {/* Cursor blink */}
      <motion.rect x="34" y={56 + lines.length * 16 - 12} width={1.5} height={12} fill="#0052FF"
        animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
    </svg>
  );
}

function LanguageSupport() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const langs = [
    { name: "HTML", support: 100 },
    { name: "CSS", support: 100 },
    { name: "JavaScript", support: 100 },
    { name: "TypeScript", support: 100 },
    { name: "JSON", support: 100 },
    { name: "Markdown", support: 100 },
    { name: "Python", support: 95 },
    { name: "YAML", support: 95 },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 gap-2">
      {langs.map((l, i) => (
        <motion.div key={l.name} className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "rgba(0,82,255,0.07)", border: "1px solid rgba(0,82,255,0.12)" }}
          initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.1 + i * 0.06 }}>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0052FF" }} />
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{l.name}</span>
          <span className="text-xs ml-auto" style={{ color: "rgba(0,82,255,0.8)" }}>{l.support}%</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function CodeEditorPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Build / Code Editor
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Edit every file <span style={{ color: "#0052FF" }}>in context</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Every file generated in a LocalOS project opens in a full Monaco editor with syntax highlighting, IntelliSense, and tab management.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Monaco editor (same engine as VS Code)</div>
              <EditorMockSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Language support</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Syntax highlighting coverage</h2>
                <LanguageSupport />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Editor features</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>What you get</h2>
                <div className="space-y-3">
                  {[
                    { t: "Monaco engine", d: "The same editor that powers VS Code. Full feature parity including multi-cursor, find and replace, bracket matching, and code folding." },
                    { t: "Tab management", d: "Each file in a project gets its own tab. Switch between files without losing your scroll position or unsaved edits." },
                    { t: "Syntax highlighting", d: "8 languages with full token coloring: HTML, CSS, JS, TS, JSON, Markdown, Python, and YAML." },
                    { t: "Auto-save", d: "File contents are persisted to localStorage automatically. Changes survive page refresh." },
                    { t: "File tree", d: "The right panel shows every file in the project. Click any file to open it in the editor." },
                    { t: "Offline", d: "All 5 Monaco worker types are bundled. The editor works with no network connection after initial load." },
                  ].map(({ t, d }) => (
                    <div key={t} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0052FF" }} />
                      <div>
                        <span className="text-sm font-semibold text-white">{t}: </span>
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Start editing</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Build something in LocalOS and the code editor opens automatically with every generated file ready to inspect and modify.
            </p>
            <a href="/app" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              Open LocalOS
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
