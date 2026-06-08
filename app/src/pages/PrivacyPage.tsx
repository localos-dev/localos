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

function DataFlowNone() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <svg ref={ref} viewBox="0 0 420 140" className="w-full" style={{ maxHeight: 140 }}>
      <rect x="10" y="30" width="130" height="80" rx="14" fill="rgba(0,82,255,0.1)" stroke="rgba(0,82,255,0.35)" strokeWidth="1" />
      <text x="75" y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">LocalOS</text>
      <text x="75" y="78" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">all data stays here</text>
      <text x="75" y="96" textAnchor="middle" fontSize="9" fill="rgba(0,82,255,0.7)">your device</text>

      <motion.line x1="145" y1="70" x2="210" y2="70"
        stroke="rgba(255,60,60,0.4)" strokeWidth="1.5" strokeDasharray="6 4"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
        <circle cx="222" cy="70" r="14" fill="rgba(255,50,50,0.1)" stroke="rgba(255,60,60,0.5)" strokeWidth="1.5" />
        <line x1="214" y1="62" x2="230" y2="78" stroke="rgba(255,80,80,0.9)" strokeWidth="2" />
        <line x1="230" y1="62" x2="214" y2="78" stroke="rgba(255,80,80,0.9)" strokeWidth="2" />
        <text x="222" y="100" textAnchor="middle" fontSize="8" fill="rgba(255,80,80,0.6)">NO DATA SENT</text>
      </motion.g>

      <rect x="250" y="30" width="150" height="80" rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="325" y="62" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.2)">Internet</text>
      <text x="325" y="80" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.12)">Cloud servers</text>
      <text x="325" y="97" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.1)">third parties</text>
    </svg>
  );
}

const SECTIONS = [
  {
    title: "What we collect",
    body: "LocalOS collects no personal data. There is no account system, no usage tracking, no analytics endpoint, and no error reporting to any external service. The application has no network calls to any LocalOS-operated or third-party server.",
  },
  {
    title: "Where your data is stored",
    body: "All data (chat history, project files, knowledge base documents, model configuration) is stored in a single SQLite file on your local disk. The path defaults to ./localos.db and can be overridden with the LOCALOS_DB_PATH environment variable. No cloud sync, no remote backup.",
  },
  {
    title: "Model inference",
    body: "When you use the LLM runtime integration (Ollama), inference runs on a local server at localhost:11434. Your prompts and model outputs do not leave your machine. When using in-browser WebLLM inference, all computation happens inside your browser with no network communication.",
  },
  {
    title: "Cookies and sessions",
    body: "LocalOS uses a single server-side session cookie for application state. This cookie does not contain personal information. It is not shared with any third party and is not used for tracking.",
  },
  {
    title: "Third-party dependencies",
    body: "LocalOS uses open source packages. Some packages may have their own network activity (for example, checking for package updates). These calls are initiated by your development environment, not by the LocalOS application itself. Production builds include no third-party analytics or telemetry packages.",
  },
  {
    title: "Changes to this policy",
    body: "If this privacy policy changes, the new version will be committed to the public repository with a clear changelog entry. Because LocalOS has no account system, we cannot notify users directly. Check the repository changelog for updates.",
  },
  {
    title: "Contact",
    body: "Questions about privacy can be directed to the GitHub repository via issues or discussions. There is no separate privacy contact address because LocalOS has no company behind it. It is a community open source project.",
  },
];

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Privacy Policy
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              We collect <span style={{ color: "#0052FF" }}>nothing</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS runs entirely on your machine. There is no server to send data to. No account to track you with. No analytics to watch your behavior.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Data flow: LocalOS to the internet</div>
              <DataFlowNone />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <Reveal className="mb-2">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Effective: June 2026. Last updated: June 8, 2026.</p>
          </Reveal>
          <div className="mt-8 space-y-8">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
                  <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.body}</p>
                </div>
                {i < SECTIONS.length - 1 && <div className="mt-8" style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
