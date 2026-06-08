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

function BuildPipelineSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const stages = [
    { x: 60, label: "Prompt", sub: "plain English" },
    { x: 175, label: "LLM", sub: "generates code" },
    { x: 290, label: "Parser", sub: "extracts files" },
    { x: 405, label: "Preview", sub: "live render" },
  ];
  return (
    <svg ref={ref} viewBox="0 0 480 90" className="w-full" style={{ maxHeight: 90 }}>
      {stages.slice(0, -1).map((s, i) => (
        <motion.line key={i} x1={s.x + 50} y1={38} x2={stages[i + 1].x - 50} y2={38}
          stroke="rgba(0,82,255,0.6)" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.3 + i * 0.2 }} />
      ))}
      {stages.map((s, i) => (
        <g key={s.label}>
          <motion.rect x={s.x - 50} y={18} width={100} height={40} rx={12}
            fill={i === 1 ? "#0052FF" : "rgba(0,82,255,0.1)"} stroke="rgba(0,82,255,0.4)" strokeWidth="1"
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.15 }} />
          <text x={s.x} y={35} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{s.label}</text>
          <text x={s.x} y={50} textAnchor="middle" fontSize="8" fill={i === 1 ? "rgba(255,255,255,0.7)" : "rgba(0,82,255,0.7)"}>{s.sub}</text>
          <text x={s.x} y={76} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">Step {i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function OutputTypeBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const types = [
    { label: "Single HTML page", pct: 100, example: "Landing page, portfolio, form" },
    { label: "Interactive tool", pct: 95, example: "Calculator, converter, timer" },
    { label: "Data dashboard", pct: 85, example: "Charts, tables, filterable lists" },
    { label: "Mini app with state", pct: 80, example: "To-do list, kanban, note app" },
    { label: "Game or animation", pct: 72, example: "Simple puzzle, canvas animation" },
  ];
  return (
    <div ref={ref} className="space-y-4">
      {types.map((t, i) => (
        <div key={t.label}>
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{t.label}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{t.example}</div>
            </div>
            <span className="text-xs font-bold" style={{ color: "#0052FF" }}>{t.pct}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #0052FF, #4488FF)" }}
              initial={{ width: 0 }} animate={inView ? { width: `${t.pct}%` } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: "easeOut" }} />
          </div>
        </div>
      ))}
      <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
        Percentages indicate typical prompt success rate for each output type.
      </p>
    </div>
  );
}

export default function BuildFeaturePage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Workflow / Build
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Describe it. <span style={{ color: "#0052FF" }}>Build it.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              The Build button routes your prompt through a specialized code generation pipeline that produces complete, working web pages and apps.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Build pipeline</div>
              <BuildPipelineSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>What you can build</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Output type success rates</h2>
                <OutputTypeBars />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>How it works</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>From prompt to preview</h2>
                <div className="space-y-4">
                  {[
                    { n: "1", t: "Write a Build prompt", d: "Use the Build button instead of Send. Describe what you want in plain language: the type, purpose, and any specific requirements." },
                    { n: "2", t: "Model generates code", d: "The LLM produces complete HTML, CSS, and JavaScript in a structured format that the parser can extract reliably." },
                    { n: "3", t: "Files are saved", d: "Each file is parsed from the model output, saved to your project, and listed in the file tree." },
                    { n: "4", t: "Preview opens", d: "The built output renders in the preview panel immediately. Open it in the Monaco editor to inspect or modify the code." },
                  ].map(({ n, t, d }) => (
                    <div key={t} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                        style={{ background: "#0052FF" }}>{n}</div>
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{t}</div>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Build prompt tips</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Be specific about type", desc: "Say 'a calculator that converts celsius to fahrenheit' not 'a temperature app'. Specificity produces better structure." },
              { title: "Mention the data", desc: "If your tool needs input fields or a data table, describe what the data looks like. The model will generate matching form elements." },
              { title: "Request a single file", desc: "For best results, ask for everything in one HTML file. Multi-file apps can be requested but require more precise prompts." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-xl p-5" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
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
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Start building</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS, start a project, and hit the Build button in the chat panel.
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
