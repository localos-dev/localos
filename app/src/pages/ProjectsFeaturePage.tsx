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

function ProjectStructureSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const projects = [
    { x: 60, label: "Research", files: 4, chats: 11 },
    { x: 200, label: "Web App", files: 22, chats: 8 },
    { x: 340, label: "Analysis", files: 7, chats: 5 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 420 160" className="w-full" style={{ maxHeight: 160 }}>
      <motion.rect x={140} y={8} width={140} height={34} rx={10} fill="#0052FF"
        initial={{ opacity: 0, y: -8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }} />
      <text x={210} y={22} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">LocalOS Workspace</text>
      <text x={210} y={35} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)">All projects isolated</text>

      {projects.map((p, i) => (
        <g key={p.label}>
          <motion.line x1={210} y1={42} x2={p.x} y2={66}
            stroke="rgba(0,82,255,0.3)" strokeWidth="1" strokeDasharray="3 2"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.1 }} />
          <motion.rect x={p.x - 52} y={66} width={104} height={52} rx={10}
            fill="rgba(0,82,255,0.09)" stroke="rgba(0,82,255,0.35)" strokeWidth="1"
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.12 }} style={{ transformOrigin: `${p.x}px 92px` }} />
          <text x={p.x} y={85} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{p.label}</text>
          <text x={p.x - 10} y={101} textAnchor="middle" fontSize="8" fill="rgba(0,82,255,0.75)">{p.files} files</text>
          <text x={p.x + 22} y={101} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.38)">{p.chats} chats</text>

          {["Chat", "Files", "Context"].map((sub, j) => (
            <g key={sub}>
              <motion.rect x={p.x - 52 + j * 37} y={128} width={33} height={20} rx={6}
                fill="rgba(0,82,255,0.06)" stroke="rgba(0,82,255,0.18)" strokeWidth="1"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.55 + i * 0.1 + j * 0.06 }} />
              <text x={p.x - 36 + j * 37} y={142} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)">{sub}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

const FEATURES = [
  {
    title: "Fully isolated workspaces",
    desc: "Each project has its own chat history, file tree, knowledge base, and context. Nothing bleeds between projects. Switching projects instantly switches the entire OS context.",
  },
  {
    title: "Persistent chat history",
    desc: "Every conversation inside a project is saved locally. Pick up any thread exactly where you left off, days or weeks later, with full context intact.",
  },
  {
    title: "Per-project file tree",
    desc: "Attach files to a project and reference them in any chat. The model sees your files as part of its context without you having to paste content manually.",
  },
  {
    title: "Knowledge base per project",
    desc: "Add documents, notes, or reference material to a project. The local model draws on these when answering questions, giving context-aware responses specific to that project.",
  },
  {
    title: "Instant context switching",
    desc: "Click a project in the sidebar and the entire workspace switches: chat history, file tree, active model, and knowledge base all change together.",
  },
  {
    title: "Offline at all times",
    desc: "Projects, files, chats, and knowledge documents are stored locally. No sync, no cloud. Everything works completely offline.",
  },
];

export default function ProjectsFeaturePage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Workflow
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Projects keep your work <span style={{ color: "#0052FF" }}>separated</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Organize everything into isolated project spaces. Each project has its own chats, files, and knowledge base. Switch instantly, work offline always.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Project structure</div>
              <ProjectStructureSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Features</div>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Everything stays in its place</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="rounded-xl p-5 h-full" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <div className="text-sm font-bold text-white mb-2">{f.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>What a project contains</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Chat threads", detail: "Full multi-turn history, persisted locally per project" },
              { label: "File tree", detail: "Attach and browse files; model uses them as context" },
              { label: "Knowledge docs", detail: "Add reference material for context-aware answers" },
              { label: "Model setting", detail: "Each project can use a different downloaded model" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div className="rounded-xl p-4 h-full" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <div className="text-xs font-bold mb-2" style={{ color: "#4d88ff" }}>{item.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{item.detail}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Start your first project</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS, create a project, and start chatting. Everything is saved locally and works offline.
            </p>
            <a href="https://localos.xyz/app" target="_blank" rel="noreferrer"
              className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
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
