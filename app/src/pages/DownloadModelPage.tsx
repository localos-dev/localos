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

const MODELS = [
  { name: "Llama 3.2 1B", size: 879, quality: 62, speed: 98, use: "Fastest. Best for quick tasks and low-end hardware." },
  { name: "Llama 3.2 3B", size: 2200, quality: 78, speed: 88, use: "Best balance of quality and speed for most use cases." },
  { name: "Llama 3.1 8B", size: 4900, quality: 88, speed: 72, use: "High quality general-purpose model. Requires 8GB RAM." },
  { name: "Qwen 2.5 1.5B", size: 1100, quality: 68, speed: 95, use: "Strong instruction following in a compact size." },
  { name: "Gemma 3 2B", size: 1800, quality: 74, speed: 91, use: "Google open model. Efficient with high quality per param." },
  { name: "Phi 3.5 Mini", size: 2200, quality: 76, speed: 87, use: "Microsoft. Small footprint, strong reasoning." },
];

function ModelCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="space-y-3">
      {MODELS.map((m, i) => (
        <div key={m.name} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-white">{m.name}</span>
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{m.size >= 1000 ? `${(m.size / 1000).toFixed(1)} GB` : `${m.size} MB`}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: "Quality", val: m.quality }, { label: "Speed", val: m.speed }].map(({ label, val }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: "#0052FF" }}>{val}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #0052FF, #3377FF)" }}
                    initial={{ width: 0 }} animate={inView ? { width: `${val}%` } : { width: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: "easeOut" }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>{m.use}</p>
        </div>
      ))}
    </div>
  );
}

function StorageFlowSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const stages = [
    { x: 60, label: "Browse catalog", sub: "in the app" },
    { x: 180, label: "Select model", sub: "one click" },
    { x: 300, label: "Download", sub: "browser cache" },
    { x: 420, label: "Load", sub: "WebAssembly" },
  ];
  return (
    <svg ref={ref} viewBox="0 0 480 80" className="w-full" style={{ maxHeight: 80 }}>
      {stages.slice(0, -1).map((s, i) => (
        <motion.line key={i} x1={s.x + 44} y1={32} x2={stages[i + 1].x - 44} y2={32}
          stroke="rgba(0,82,255,0.5)" strokeWidth="1.5" strokeDasharray="4 3"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.3 + i * 0.2 }} />
      ))}
      {stages.map((s, i) => (
        <g key={s.label}>
          <motion.rect x={s.x - 44} y={14} width={88} height={36} rx={10}
            fill={i === 3 ? "#0052FF" : "rgba(0,82,255,0.1)"} stroke="rgba(0,82,255,0.4)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 + i * 0.15 }} />
          <text x={s.x} y={29} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">{s.label}</text>
          <text x={s.x} y={43} textAnchor="middle" fontSize="8" fill={i === 3 ? "rgba(255,255,255,0.8)" : "rgba(0,82,255,0.7)"}>{s.sub}</text>
          <text x={s.x} y={70} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

export default function DownloadModelPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Setup / Download a Model
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Pick a model. <span style={{ color: "#0052FF" }}>Own it forever.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Download once. Stored on your device. Never downloaded again. No API key, no subscription, no usage limit.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>How model downloading works</div>
              <StorageFlowSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Catalog</div>
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Compare available models</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ModelCompareChart />
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>How to choose</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Start with 1B or 3B", desc: "If you are new to local AI, start with the smallest model that fits your hardware. You can always download a larger model later." },
              { title: "Check your RAM", desc: "Rule of thumb: model size in GB plus 2 GB overhead. A 3B model needs about 4 GB of available RAM. An 8B model needs about 7 GB." },
              { title: "Switch anytime", desc: "Models switch without restarting LocalOS. Download multiple models and pick between them from the model selector in the app." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl p-5" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Next: the boot sequence</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              After your model downloads, LocalOS runs a boot sequence to verify everything is ready.
            </p>
            <a href="/boot-sequence" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              See the boot sequence
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
