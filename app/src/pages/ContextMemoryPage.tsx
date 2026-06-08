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

function ContextStackSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const layers = [
    { label: "System prompt", note: "always injected first", y: 18, h: 28, color: "rgba(0,82,255,0.5)" },
    { label: "Knowledge base context", note: "retrieved per query", y: 54, h: 28, color: "rgba(0,100,255,0.4)" },
    { label: "Message history (turn 1..N)", note: "all prior turns", y: 90, h: 28, color: "rgba(0,82,255,0.3)" },
    { label: "Current user message", note: "the latest prompt", y: 126, h: 28, color: "#0052FF" },
  ];
  return (
    <svg ref={ref} viewBox="0 0 420 175" className="w-full" style={{ maxHeight: 175 }}>
      {layers.map((l, i) => (
        <g key={l.label}>
          <motion.rect x="10" y={l.y} height={l.h} rx={8} fill={l.color} stroke="rgba(0,82,255,0.4)" strokeWidth="1"
            initial={{ width: 0 }} animate={inView ? { width: 400 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: "easeOut" }} />
          <text x="20" y={l.y + 17} fontSize="10" fontWeight="700" fill="white">{l.label}</text>
          <text x="20" y={l.y + 30} fontSize="8" fill="rgba(255,255,255,0.55)">{l.note}</text>
        </g>
      ))}
      <rect x="10" y="18" width="400" height="136" rx="8" fill="none" stroke="rgba(0,82,255,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="210" y="168" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">Full context sent to the model on every turn</text>
    </svg>
  );
}

function TokenBudgetChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const models = [
    { name: "Llama 3.2 1B", tokens: 8192, color: "rgba(0,82,255,0.6)" },
    { name: "Llama 3.2 3B", tokens: 16384, color: "rgba(0,82,255,0.75)" },
    { name: "Llama 3.1 8B", tokens: 131072, color: "#0052FF" },
    { name: "Qwen 2.5 7B", tokens: 131072, color: "#0052FF" },
    { name: "Gemma 3 2B", tokens: 32768, color: "rgba(0,82,255,0.7)" },
  ];
  const max = 131072;
  return (
    <div ref={ref} className="space-y-3">
      {models.map((m, i) => (
        <div key={m.name}>
          <div className="flex justify-between mb-1">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{m.name}</span>
            <span className="text-xs font-bold font-mono" style={{ color: "#0052FF" }}>
              {m.tokens >= 1000 ? `${(m.tokens / 1000).toFixed(0)}K` : m.tokens} tokens
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${m.color}, #4488FF)` }}
              initial={{ width: 0 }} animate={inView ? { width: `${(m.tokens / max) * 100}%` } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: "easeOut" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContextMemoryPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              AI / Context Memory
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              The model remembers <span style={{ color: "#0052FF" }}>everything</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Every prior turn in the conversation, all injected knowledge, and the system prompt travel with every new message you send.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Context stack sent to the model on each turn</div>
              <ContextStackSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Context windows by model</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Token budgets</h2>
                <TokenBudgetChart />
                <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Larger context windows hold more history before older messages are dropped from the prompt.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>How it works</div>
                {[
                  { t: "No summarization", d: "LocalOS does not summarize or compress history. The raw message content is sent as-is, up to the token limit. No information is silently dropped early." },
                  { t: "Knowledge injection", d: "Before each prompt, the most relevant knowledge base chunks are retrieved via similarity search and prepended to the context above the conversation history." },
                  { t: "Context overflow", d: "When history exceeds the context limit, the oldest messages are dropped first. The most recent turns and knowledge context are always preserved." },
                  { t: "Per-project isolation", d: "Context is scoped to the current chat. Switching projects or starting a new chat begins with a clean context. Nothing bleeds between projects." },
                ].map(({ t, d }) => (
                  <div key={t} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)" }}>
                    <div className="text-sm font-bold text-white mb-1">{t}</div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Build your knowledge base</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Add documents to the knowledge base and they will be injected automatically into every conversation in that project.
            </p>
            <a href="/knowledge-base" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              Knowledge Base
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
