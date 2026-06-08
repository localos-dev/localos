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

function LatencyChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const bars = [
    { label: "LocalOS", ms: 0, display: "0 ms", color: "#0052FF" },
    { label: "OpenAI API", ms: 320, display: "320 ms", color: "rgba(255,255,255,0.12)" },
    { label: "Anthropic API", ms: 280, display: "280 ms", color: "rgba(255,255,255,0.12)" },
    { label: "Google Gemini", ms: 240, display: "240 ms", color: "rgba(255,255,255,0.12)" },
  ];
  const max = 400;

  return (
    <div ref={ref} className="space-y-4 mt-8">
      {bars.map((b, i) => (
        <div key={b.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color: i === 0 ? "white" : "rgba(255,255,255,0.55)" }}>{b.label}</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: i === 0 ? "#0052FF" : "rgba(255,255,255,0.35)" }}>{b.display}</span>
          </div>
          <div className="h-8 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {i === 0 ? (
              <motion.div
                className="h-full flex items-center px-3 rounded-lg"
                initial={{ width: 0 }}
                animate={inView ? { width: "5%" } : { width: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                style={{ background: "linear-gradient(90deg, #0052FF, #0066FF)", minWidth: "44px" }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">Network: 0 ms</span>
              </motion.div>
            ) : (
              <motion.div
                className="h-full rounded-lg"
                initial={{ width: 0 }}
                animate={inView ? { width: `${(b.ms / max) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                style={{ background: b.color }}
              />
            )}
          </div>
        </div>
      ))}
      <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
        Network latency comparison. LocalOS runs entirely on-device with zero round-trips to any server.
      </p>
    </div>
  );
}

function PrivacyDiagram() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  return (
    <svg ref={ref} viewBox="0 0 480 200" className="w-full" style={{ maxHeight: 200 }}>
      {/* LocalOS side */}
      <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1">YOUR DEVICE</text>
      <rect x="20" y="32" width="140" height="50" rx="10" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.35)" strokeWidth="1" />
      <text x="90" y="53" textAnchor="middle" fontSize="11" fontWeight="600" fill="white">LocalOS</text>
      <text x="90" y="70" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">LLM runs here</text>
      <rect x="20" y="96" width="140" height="38" rx="10" fill="rgba(0,82,255,0.06)" stroke="rgba(0,82,255,0.2)" strokeWidth="1" />
      <text x="90" y="117" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.7)">SQLite DB</text>
      <text x="90" y="130" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">local file</text>
      <rect x="20" y="148" width="140" height="38" rx="10" fill="rgba(0,82,255,0.06)" stroke="rgba(0,82,255,0.2)" strokeWidth="1" />
      <text x="90" y="168" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.7)">Files and Models</text>
      <text x="90" y="181" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">on-disk only</text>

      {/* Blocked arrow to internet */}
      <motion.line x1="165" y1="100" x2="210" y2="100"
        stroke="rgba(255,60,60,0.5)" strokeWidth="1.5" strokeDasharray="5 3"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }} />
      <motion.circle cx="222" cy="100" r="12" fill="rgba(255,50,50,0.12)" stroke="rgba(255,60,60,0.45)" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.6 }} />
      <text x="222" y="105" textAnchor="middle" fontSize="13" fill="rgba(255,80,80,0.9)" fontWeight="800">x</text>
      <text x="222" y="128" textAnchor="middle" fontSize="9" fill="rgba(255,80,80,0.6)">BLOCKED</text>

      {/* Internet cloud */}
      <rect x="264" y="72" width="100" height="56" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="314" y="97" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.25)">Internet</text>
      <text x="314" y="115" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.18)">Cloud AI</text>

      {/* Zero badge */}
      <motion.rect x="380" y="60" width="86" height="80" rx="12" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.3)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }} />
      <text x="423" y="93" textAnchor="middle" fontSize="22" fontWeight="900" fill="#0052FF">0</text>
      <text x="423" y="110" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">bytes sent</text>
      <text x="423" y="124" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)">to any server</text>
    </svg>
  );
}

function RadarChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const cx = 140; const cy = 140; const r = 100;
  const axes = [
    { label: "Privacy", angle: -90 },
    { label: "Speed", angle: -18 },
    { label: "Offline", angle: 54 },
    { label: "Cost", angle: 126 },
    { label: "Control", angle: 198 },
  ];
  const scores = [1.0, 0.85, 1.0, 1.0, 1.0];
  const cloudScores = [0.1, 0.7, 0.0, 0.2, 0.15];

  const toXY = (angle: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos((angle * Math.PI) / 180),
    y: cy + r * ratio * Math.sin((angle * Math.PI) / 180),
  });

  const localPts = axes.map((a, i) => toXY(a.angle, scores[i]));
  const cloudPts = axes.map((a, i) => toXY(a.angle, cloudScores[i]));
  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg ref={ref} viewBox="0 0 340 280" className="w-full" style={{ maxHeight: 280 }}>
      {/* Grid */}
      {gridLevels.map((level) => {
        const pts = axes.map((a) => toXY(a.angle, level));
        return (
          <polygon key={level} points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        );
      })}
      {/* Axis lines */}
      {axes.map((a) => {
        const end = toXY(a.angle, 1.0);
        return <line key={a.label} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      {/* Cloud polygon */}
      <motion.polygon
        points={cloudPts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} />
      {/* LocalOS polygon */}
      <motion.polygon
        points={localPts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(0,82,255,0.18)" stroke="#0052FF" strokeWidth="2"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5, duration: 0.6 }} />
      {/* Dots */}
      {localPts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={4} fill="#0052FF"
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.8 + i * 0.08 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
      ))}
      {/* Labels */}
      {axes.map((a) => {
        const pos = toXY(a.angle, 1.22);
        return (
          <text key={a.label} x={pos.x} y={pos.y + 4} textAnchor="middle"
            fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.6)">{a.label}</text>
        );
      })}
      {/* Legend */}
      <rect x="200" y="30" width="12" height="12" rx="3" fill="rgba(0,82,255,0.5)" stroke="#0052FF" strokeWidth="1.5" />
      <text x="217" y="41" fontSize="10" fill="rgba(255,255,255,0.6)">LocalOS</text>
      <rect x="200" y="52" width="12" height="12" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <text x="217" y="63" fontSize="10" fill="rgba(255,255,255,0.4)">Cloud AI</text>
    </svg>
  );
}

const FEATURES = [
  { title: "In-Browser Inference", desc: "Models run entirely in WebAssembly inside your browser. No server, no GPU cluster, no API key." },
  { title: "Streaming Output", desc: "Token-by-token streaming with real-time display. Responses appear as they are generated." },
  { title: "Project Workspaces", desc: "Organize chats and files into isolated projects. Each project keeps its own history and context." },
  { title: "Knowledge Base", desc: "Index your documents locally. The model reads from your files during every conversation." },
  { title: "Web Builder", desc: "Generate complete websites with layout, copy, and styling from a single plain-language prompt." },
  { title: "Code Editor", desc: "Monaco editor with syntax highlighting for every file generated in a project." },
  { title: "Model Switching", desc: "Switch between downloaded models mid-session. No restart required." },
  { title: "Offline First", desc: "Once a model is downloaded, the entire system operates without an internet connection." },
];

export default function FeaturesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Features
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              The complete AI toolkit.
              <br />
              <span style={{ color: "#0052FF" }}>Yours to keep.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Every capability of a modern AI system, running on your own hardware with zero cloud dependency, zero subscription, and zero data exposure.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Latency section */}
      <section style={{ background: "#070D1F", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Performance</div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Zero network latency</h2>
                <p className="leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Cloud AI services add 200 to 400 ms of network overhead to every prompt, before the model even begins thinking. LocalOS starts generating the moment you hit send.
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Inference speed depends on your hardware. The comparison above measures only the network round-trip to external API providers.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>API network latency</div>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Time before first token (network only, ms)</div>
                <LatencyChart />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Privacy diagram */}
      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Data flow diagram</div>
                <PrivacyDiagram />
              </div>
            </Reveal>
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Privacy</div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Nothing leaves your machine</h2>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Your prompts, files, chats, and model weights stay on your hardware. There is no telemetry, no analytics endpoint, and no cloud sync.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ v: "0", l: "bytes sent" }, { v: "0", l: "API keys needed" }, { v: "100%", l: "data stays local" }].map(({ v, l }) => (
                    <div key={l} className="rounded-xl p-3 text-center" style={{ background: "rgba(0,82,255,0.08)", border: "1px solid rgba(0,82,255,0.15)" }}>
                      <div className="text-xl font-black" style={{ color: "#0052FF" }}>{v}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Radar chart */}
      <section style={{ background: "#070D1F", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Comparison</div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Built different</h2>
                <p className="leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  LocalOS leads on every dimension that matters for sensitive, professional, and offline use. Cloud AI trades privacy and control for raw model scale.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Privacy", value: "Complete. No data leaves the device." },
                    { label: "Offline Use", value: "Full capability with no network." },
                    { label: "Cost", value: "Free. No tokens, no subscription." },
                    { label: "Control", value: "You own every component." },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0052FF" }} />
                      <div>
                        <span className="text-sm font-semibold text-white">{label}: </span>
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Capability radar: LocalOS vs Cloud AI</div>
                <RadarChart />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>All Features</div>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Everything in one system</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="rounded-2xl p-5 h-full transition-all"
                  style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(0,82,255,0.3)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(0,82,255,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(0,82,255,0.12)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(0,82,255,0.05)"; }}>
                  <div className="w-8 h-8 rounded-xl mb-4 flex items-center justify-center text-white font-black text-sm"
                    style={{ background: "rgba(0,82,255,0.2)", border: "1px solid rgba(0,82,255,0.3)" }}>
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#070D1F", padding: "80px 0" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Ready to get started?</h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              LocalOS is free, open, and runs entirely on your hardware. No signup, no payment, no waiting.
            </p>
            <a href="/app" className="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all"
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
