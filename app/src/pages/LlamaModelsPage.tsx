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

const LLAMA_MODELS = [
  { name: "Llama 3.2 1B", size: "879 MB", ram: "2 GB", speed: 98, quality: 62, context: "8K", use: "Fastest. Works on any device including machines with 4 GB RAM or less." },
  { name: "Llama 3.2 3B", size: "2.2 GB", ram: "4 GB", speed: 88, quality: 78, context: "16K", use: "Best all-round choice. Strong enough for most tasks, fast enough for chat." },
  { name: "Llama 3.1 8B", size: "4.9 GB", ram: "8 GB", speed: 72, quality: 88, context: "128K", use: "Highest quality in the Llama family. Choose this for complex reasoning and long documents." },
];

function ComparisonRadar() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const cx = 150; const cy = 120; const r = 80;
  const axes = [
    { label: "Speed", angle: -90 },
    { label: "Quality", angle: -18 },
    { label: "Context", angle: 54 },
    { label: "Size eff.", angle: 126 },
    { label: "RAM use", angle: 198 },
  ];
  const models = [
    { name: "1B", scores: [0.98, 0.62, 0.06, 0.95, 0.95], color: "rgba(0,150,255,0.7)" },
    { name: "3B", scores: [0.88, 0.78, 0.12, 0.85, 0.8], color: "rgba(0,82,255,0.8)" },
    { name: "8B", scores: [0.72, 0.88, 1.0, 0.70, 0.55], color: "#0052FF" },
  ];
  const toXY = (angle: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos((angle * Math.PI) / 180),
    y: cy + r * ratio * Math.sin((angle * Math.PI) / 180),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg ref={ref} viewBox="0 0 340 250" className="w-full" style={{ maxHeight: 250 }}>
      {gridLevels.map((l) => (
        <polygon key={l} points={axes.map((a) => { const p = toXY(a.angle, l); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {axes.map((a) => { const end = toXY(a.angle, 1); return <line key={a.label} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />; })}
      {models.map((m, mi) => {
        const pts = axes.map((a, i) => toXY(a.angle, m.scores[i]));
        return (
          <motion.polygon key={m.name} points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={m.color + "25"} stroke={m.color} strokeWidth="1.5"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 + mi * 0.15 }} />
        );
      })}
      {axes.map((a) => { const pos = toXY(a.angle, 1.25); return <text key={a.label} x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.5)">{a.label}</text>; })}
      {models.map((m, i) => (
        <g key={m.name}>
          <rect x={200} y={30 + i * 22} width={12} height={12} rx={3} fill={m.color} opacity={0.7} />
          <text x={217} y={41 + i * 22} fontSize="10" fill="rgba(255,255,255,0.6)">{m.name}</text>
        </g>
      ))}
    </svg>
  );
}

export default function LlamaModelsPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Models / Llama Family
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              The <span style={{ color: "#0052FF" }}>Llama</span> family
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Three models, three sweet spots. Llama 3 from Meta is the most popular open model family for local inference.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Capability radar: 1B vs 3B vs 8B</div>
                <ComparisonRadar />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="space-y-4">
                {LLAMA_MODELS.map((m, i) => (
                  <div key={m.name} className="rounded-2xl p-5" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.15)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">{m.name}</span>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,82,255,0.15)", color: "#4d88ff" }}>{m.size}</span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>{m.ram} RAM</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[{ l: "Speed", v: m.speed }, { l: "Quality", v: m.quality }, { l: "Context", v: m.context }].map(({ l, v }) => (
                        <div key={l} className="text-center rounded-lg p-1.5" style={{ background: "rgba(0,0,0,0.2)" }}>
                          <div className="text-xs font-bold" style={{ color: "#0052FF" }}>{v}{typeof v === "number" ? "%" : ""}</div>
                          <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{m.use}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Which one should you start with?</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Low-end hardware (under 8 GB RAM)", rec: "Llama 3.2 1B", why: "Runs in 2 GB RAM. Fast enough for conversational use. Small download." },
              { title: "Most use cases", rec: "Llama 3.2 3B", why: "The best default. Balances quality and speed. 4 GB RAM. 2.2 GB download." },
              { title: "Complex reasoning and long docs", rec: "Llama 3.1 8B", why: "128K context window. Strongest quality. Requires 8 GB RAM." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl p-5 h-full" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{item.title}</div>
                  <div className="text-base font-black mb-2" style={{ color: "#0052FF" }}>{item.rec}</div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.why}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Download a Llama model</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS and go to the Models page to download any Llama variant in one click.
            </p>
            <a href="/models" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              Model Catalog
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
