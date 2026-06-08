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

function IndexFlowSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const nodes = [
    { x: 60, y: 60, label: "Your Files", sub: ".md .txt .pdf", color: "rgba(0,82,255,0.15)" },
    { x: 200, y: 60, label: "Local Index", sub: "chunked + stored", color: "rgba(0,82,255,0.2)" },
    { x: 340, y: 60, label: "Chat Context", sub: "injected per turn", color: "#0052FF" },
  ];

  return (
    <svg ref={ref} viewBox="0 0 420 130" className="w-full" style={{ maxHeight: 130 }}>
      {nodes.slice(0, -1).map((n, i) => (
        <motion.line key={i} x1={n.x + 52} y1={n.y} x2={nodes[i + 1].x - 52} y2={n.y}
          stroke="rgba(0,82,255,0.5)" strokeWidth="1.5" strokeDasharray="5 3"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.25 }} />
      ))}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <motion.rect x={n.x - 52} y={n.y - 26} width={104} height={52} rx={12}
            fill={n.color} stroke="rgba(0,82,255,0.4)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 + i * 0.18 }} />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{n.label}</text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.55)">{n.sub}</text>
        </g>
      ))}
      {/* Arrow heads */}
      {[{ x: 148, y: 60 }, { x: 288, y: 60 }].map((a, i) => (
        <motion.polygon key={i} points={`${a.x},${a.y - 5} ${a.x + 8},${a.y} ${a.x},${a.y + 5}`}
          fill="#0052FF" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 + i * 0.25 }} />
      ))}
      {/* Privacy note */}
      <rect x="80" y="100" width="260" height="22" rx="8" fill="rgba(0,82,255,0.08)" stroke="rgba(0,82,255,0.2)" strokeWidth="1" />
      <text x="210" y="115" textAnchor="middle" fontSize="9" fill="rgba(0,82,255,0.8)">All processing stays on your device. No document leaves your machine.</text>
    </svg>
  );
}

function StorageBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const items = [
    { label: "Documents indexed", value: 100, unit: "% local" },
    { label: "Search queries", value: 100, unit: "% local" },
    { label: "Context injection", value: 100, unit: "% local" },
    { label: "External API calls", value: 0, unit: "% — none" },
  ];

  return (
    <div ref={ref} className="space-y-4">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item.label}</span>
            <span className="text-sm font-bold" style={{ color: i === 3 ? "rgba(255,80,80,0.8)" : "#0052FF" }}>{item.unit}</span>
          </div>
          <div className="h-6 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-lg"
              style={{ background: i === 3 ? "rgba(255,60,60,0.2)" : "linear-gradient(90deg, #0052FF, #0066FF)" }}
              initial={{ width: 0 }}
              animate={inView ? { width: i === 3 ? "2%" : "100%" } : { width: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: "easeOut" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KnowledgeBasePage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Knowledge Base
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Your private <span style={{ color: "#0052FF" }}>knowledge layer</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Index your own documents locally. The AI reads from them in every conversation, without any file ever leaving your device.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-7" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>How documents flow into conversation</div>
              <IndexFlowSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Privacy</div>
                <h2 className="text-3xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Everything stays local</h2>
                <p className="leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Documents are chunked, embedded, and stored in your local SQLite database. Search and retrieval happen on your device. Nothing is transmitted to an external service at any step.
                </p>
                <StorageBarChart />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="space-y-4">
                {[
                  { title: "Supported file types", desc: "Plain text, Markdown, and PDF documents. More formats planned." },
                  { title: "Per-project indexing", desc: "Each project maintains its own isolated knowledge base. Documents from one project do not bleed into another." },
                  { title: "Context injection", desc: "Relevant document chunks are automatically retrieved and injected into the conversation context before each model call." },
                  { title: "Incremental updates", desc: "Add or remove documents at any time. The index updates without requiring a full rebuild." },
                  { title: "No size limits", desc: "The index is bounded only by your local disk space, not by any API tier or subscription." },
                ].map((item, i) => (
                  <div key={item.title} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0052FF" }} />
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "80px 0" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Start building your knowledge base</h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS, navigate to a project, and upload your first document. Indexing completes in seconds.
            </p>
            <a href="/app" className="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm"
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
