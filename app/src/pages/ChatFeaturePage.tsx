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

function StreamingDiagramSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  return (
    <svg ref={ref} viewBox="0 0 480 110" className="w-full" style={{ maxHeight: 110 }}>
      <rect x="10" y="20" width="110" height="70" rx="12" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.3)" strokeWidth="1" />
      <text x="65" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Your Prompt</text>
      <text x="65" y="68" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">sent to local model</text>
      <motion.line x1="124" y1="55" x2="185" y2="55"
        stroke="rgba(0,82,255,0.6)" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.4, delay: 0.3 }} />
      <rect x="188" y="20" width="110" height="70" rx="12" fill="#0052FF" stroke="#0052FF" strokeWidth="1" />
      <text x="243" y="48" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">LLM Engine</text>
      <text x="243" y="63" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">WebAssembly</text>
      <text x="243" y="78" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)">on your device</text>
      <motion.line x1="302" y1="55" x2="360" y2="55"
        stroke="rgba(0,82,255,0.6)" strokeWidth="2" strokeDasharray="5 3"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.5, delay: 0.6 }} />
      <text x="330" y="45" textAnchor="middle" fontSize="8" fill="rgba(0,82,255,0.8)">SSE stream</text>
      <rect x="363" y="20" width="110" height="70" rx="12" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.3)" strokeWidth="1" />
      <text x="418" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Your Screen</text>
      <text x="418" y="68" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">token by token</text>
      <text x="240" y="106" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)">No data sent outside your device at any point</text>
    </svg>
  );
}

function ContextWindowSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const segments = [
    { label: "System prompt", pct: 10, color: "rgba(0,82,255,0.5)" },
    { label: "Knowledge base context", pct: 25, color: "rgba(0,120,255,0.6)" },
    { label: "Chat history", pct: 40, color: "rgba(0,82,255,0.35)" },
    { label: "Current prompt", pct: 15, color: "#0052FF" },
    { label: "Available", pct: 10, color: "rgba(255,255,255,0.06)" },
  ];
  let cumulative = 0;
  return (
    <svg ref={ref} viewBox="0 0 420 80" className="w-full" style={{ maxHeight: 80 }}>
      <text x="210" y="14" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.4)">Context window usage (example)</text>
      {segments.map((seg, i) => {
        const x = 10 + (cumulative / 100) * 400;
        const w = (seg.pct / 100) * 400;
        cumulative += seg.pct;
        return (
          <g key={seg.label}>
            <motion.rect x={x} y={20} height={28} rx={i === 0 ? 6 : 0}
              fill={seg.color}
              initial={{ width: 0 }} animate={inView ? { width: w } : { width: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: "easeOut" }} />
          </g>
        );
      })}
      <rect x="10" y="20" width="400" height="28" rx="6" fill="none" stroke="rgba(0,82,255,0.2)" strokeWidth="1" />
      <text x="10" y="65" fontSize="8" fill="rgba(255,255,255,0.3)">Context window (128K tokens)</text>
      {segments.map((seg, i) => {
        let cum2 = 0;
        for (let j = 0; j < i; j++) cum2 += segments[j].pct;
        const x = 10 + (cum2 / 100) * 400 + (seg.pct / 100) * 200;
        return i < 4 ? (
          <text key={seg.label} x={x} y={33} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)">{seg.label}</text>
        ) : null;
      })}
    </svg>
  );
}

export default function ChatFeaturePage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Workflow / Chat
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Conversation that stays <span style={{ color: "#0052FF" }}>private</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Multi-turn conversations with full context memory, streaming token output, and zero data leaving your device.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>How your message travels</div>
              <StreamingDiagramSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Context memory</div>
                <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>The model sees everything</h2>
                <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Each message includes the full conversation history up to the context limit. The model references earlier turns without you needing to repeat yourself.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Knowledge base documents are injected automatically so the model can cite from your files in any response.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Context window breakdown</div>
                <ContextWindowSVG />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Chat capabilities</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Streaming output", desc: "Tokens appear on screen as they are generated. No waiting for the full response before seeing any text." },
              { title: "Multi-turn history", desc: "The full conversation is included in each new request up to the model's context limit." },
              { title: "Model switching", desc: "Change models mid-session. The conversation history carries over." },
              { title: "Build mode", desc: "Send a prompt through the build pipeline to generate a complete web page or app instead of a text response." },
              { title: "Knowledge injection", desc: "Relevant knowledge base documents are retrieved and prepended to the prompt automatically." },
              { title: "Offline", desc: "Once a model is loaded, chat works with no internet connection. Fully air-gapped capable." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="rounded-xl p-4 h-full" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)" }}>
                  <div className="text-sm font-bold text-white mb-1.5">{item.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Try it now</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS and start your first conversation. No account, no setup, just chat.
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
