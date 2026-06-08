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

const CHECKS = [
  { n: "01", label: "Backend", desc: "Verifies the API server is reachable at /api/healthz. If not running, all subsequent checks are skipped.", time: "12ms", status: "pass" },
  { n: "02", label: "Database", desc: "Confirms SQLite is initialized and all required tables exist. Creates missing tables automatically.", time: "18ms", status: "pass" },
  { n: "03", label: "LLM Runtime", desc: "Checks if the inference engine is reachable. If not available, Demo Mode is activated with simulated responses.", time: "45ms", status: "warn" },
  { n: "04", label: "Storage", desc: "Verifies localStorage is writable and readable. Checks that stored data survives a round-trip.", time: "8ms", status: "pass" },
];

function BootTimelineSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const W = 420; const segW = W / CHECKS.length;
  const colors = ["#0052FF", "#0052FF", "#f59e0b", "#0052FF"];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} 70`} className="w-full" style={{ maxHeight: 70 }}>
      <text x={W / 2} y={12} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">Boot sequence timeline (0 to 83ms total)</text>
      {CHECKS.map((c, i) => {
        const x = i * segW;
        const w = segW - 4;
        const times = [0, 12, 30, 75];
        const widthPct = (parseInt(c.time) / 83) * (W - 20);
        return (
          <g key={c.label}>
            <motion.rect x={x + 2} y={18} height={28} rx={6}
              fill={colors[i] + "22"} stroke={colors[i]} strokeWidth="1"
              initial={{ width: 0 }} animate={inView ? { width: w } : { width: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.18, ease: "easeOut" }} />
            <text x={x + w / 2 + 2} y={34} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">{c.label}</text>
            <text x={x + w / 2 + 2} y={45} textAnchor="middle" fontSize="8" fill={colors[i] + "cc"}>{c.time}</text>
            <text x={x + w / 2 + 2} y={60} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">Step {i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function BootSequencePage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Setup / Boot Sequence
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Ready in under <span style={{ color: "#0052FF" }}>100ms</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              On every startup, LocalOS runs four checks before letting you in. Each one is independent and tells you exactly what is ready and what is not.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Boot check sequence (total typical time: 83ms)</div>
              <BootTimelineSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>What each check does</h2>
          </Reveal>
          <div className="space-y-4">
            {CHECKS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <div className="flex gap-5 rounded-2xl p-5"
                  style={{ background: "rgba(0,82,255,0.05)", border: `1px solid ${c.status === "warn" ? "rgba(245,158,11,0.3)" : "rgba(0,82,255,0.12)"}` }}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ background: "rgba(0,82,255,0.15)", border: "1px solid rgba(0,82,255,0.3)", color: "#0052FF" }}>
                      {c.n}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-bold text-white">{c.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: c.status === "warn" ? "rgba(245,158,11,0.15)" : "rgba(0,82,255,0.15)",
                          color: c.status === "warn" ? "rgba(245,158,11,0.9)" : "#4d88ff",
                        }}>
                        {c.status === "warn" ? "Optional" : "Required"}
                      </span>
                      <span className="text-xs font-mono ml-auto" style={{ color: "rgba(255,255,255,0.35)" }}>{c.time} typical</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Failure behavior</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { check: "Backend fails", result: "Boot screen stays visible. An error message explains the cause. The app does not load until the backend is up." },
              { check: "Database fails", result: "Backend reports a DB error in the health endpoint. The boot screen shows which specific check failed." },
              { check: "LLM runtime not found", result: "Demo Mode activates. All UI features work. Chat responses are simulated with a clear label." },
              { check: "Storage fails", result: "App loads but warns that data may not persist between sessions. localStorage must be enabled in the browser." },
            ].map((item, i) => (
              <Reveal key={item.check} delay={i * 0.08}>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="text-sm font-bold text-white mb-1">{item.check}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{item.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>After the boot sequence</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              All checks pass and you land in the three-panel workspace. Start a new project or pick up where you left off.
            </p>
            <a href="/chat-feature" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              Explore the chat interface
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
