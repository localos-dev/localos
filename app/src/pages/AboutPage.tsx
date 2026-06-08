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

function TechStackBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stack = [
    { name: "React + Vite", role: "Frontend framework", pct: 100 },
    { name: "WebLLM", role: "In-browser inference engine", pct: 90 },
    { name: "SQLite via better-sqlite3", role: "Local database", pct: 100 },
    { name: "Drizzle ORM", role: "Schema and queries", pct: 95 },
    { name: "Express 5", role: "API server", pct: 100 },
    { name: "Framer Motion", role: "Animations", pct: 85 },
    { name: "Tailwind CSS", role: "Styling", pct: 100 },
    { name: "TypeScript", role: "End to end types", pct: 100 },
  ];

  return (
    <div ref={ref} className="space-y-3">
      {stack.map((item, i) => (
        <div key={item.name}>
          <div className="flex justify-between items-center mb-1">
            <div>
              <span className="text-sm font-semibold text-white">{item.name}</span>
              <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.35)" }}>{item.role}</span>
            </div>
            <span className="text-xs font-bold tabular-nums" style={{ color: "#0052FF" }}>{item.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #0052FF, #3377FF)" }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${item.pct}%` } : { width: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsPulse() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const points = [0, 8, 4, 16, 10, 22, 14, 30, 20, 36, 28, 42, 35, 50, 44, 56, 52, 60, 58, 64, 64, 68];
  const path = points.reduce((acc, val, i) => {
    const x = (i / (points.length - 1)) * 340;
    const y = 80 - val;
    return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }, "");

  return (
    <svg ref={ref} viewBox="0 0 340 90" className="w-full" style={{ maxHeight: 90 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="chartClip">
          <motion.rect x="0" y="0" height="90"
            initial={{ width: 0 }}
            animate={inView ? { width: 340 } : { width: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }} />
        </clipPath>
      </defs>
      <path d={path + " L 340 90 L 0 90 Z"} fill="url(#areaGrad)" clipPath="url(#chartClip)" />
      <motion.path d={path} fill="none" stroke="#0052FF" strokeWidth="2"
        clipPath="url(#chartClip)" />
      <text x="0" y="88" fontSize="9" fill="rgba(255,255,255,0.25)">v0.1</text>
      <text x="320" y="88" fontSize="9" fill="rgba(255,255,255,0.25)">now</text>
      <text x="170" y="12" textAnchor="middle" fontSize="9" fill="rgba(0,82,255,0.7)">model catalog growth</text>
    </svg>
  );
}

const PRINCIPLES = [
  { title: "Local first", desc: "Every capability works without a network connection. Offline is not a fallback. It is the primary design target." },
  { title: "Zero trust by default", desc: "No telemetry, no analytics, no crash reporting. The system does not phone home because it has no home to phone." },
  { title: "Open by design", desc: "No proprietary model format, no locked runtime, no vendor dependency. The full stack is inspectable and replaceable." },
  { title: "Minimal footprint", desc: "One SQLite file for all data. Model weights stay in your browser cache. Nothing written outside your chosen directories." },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              About
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              Built for a world where
              <br />
              <span style={{ color: "#0052FF" }}>privacy matters.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS is an open AI operating system that gives individuals and teams the full power of modern language models without surrendering their data to any provider.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "10+", label: "open models supported" },
              { value: "0", label: "bytes sent to any server" },
              { value: "100%", label: "offline capable" },
              { value: "1", label: "local SQLite file" },
            ].map(({ value, label }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="rounded-2xl p-5 text-center"
                  style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.14)" }}>
                  <div className="text-4xl font-black mb-1" style={{ color: "#0052FF" }}>{value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Mission</div>
                <h2 className="text-3xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>AI without the tradeoffs</h2>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Every major AI product today requires you to send your data to someone else's server, accept their terms, trust their privacy policy, and pay for access every month.
                </p>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  LocalOS is the alternative. A complete AI system that lives on your hardware, costs nothing to run, and operates at full capacity the moment you disconnect from the internet.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  It is built on open models, open tools, and open standards. Nothing in the stack requires permission to inspect, modify, or replace.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Model catalog growth over time</div>
                <StatsPulse />
                <div className="mt-5 space-y-3">
                  {[
                    { label: "Initial release", note: "Llama and Qwen families" },
                    { label: "v0.3", note: "Gemma and Phi added" },
                    { label: "Current", note: "10 plus models across 5 families" },
                  ].map(({ label, note }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0052FF" }} />
                      <span className="text-sm font-semibold text-white">{label}:</span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ background: "#070D1F", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-7" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>Technology stack coverage</div>
                <TechStackBars />
              </div>
            </Reveal>
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Technology</div>
                <h2 className="text-3xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Built on proven open source</h2>
                <p className="leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  LocalOS assembles best-in-class open source tools into a single cohesive system. No proprietary runtime, no black-box components, no commercial SDK.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  TypeScript end to end. React frontend. Express backend. SQLite data layer. WebLLM for in-browser model inference with WebAssembly. Every dependency is auditable.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Principles</div>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>What we stand for</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="rounded-2xl p-7"
                  style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
