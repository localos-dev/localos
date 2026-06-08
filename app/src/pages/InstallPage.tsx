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

function FlowDiagramSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });
  const steps = [
    { x: 60, label: "Open App", sub: "localos.xyz/app" },
    { x: 190, label: "Download", sub: "pick a model" },
    { x: 320, label: "Set Up", sub: "configure" },
    { x: 450, label: "Go Offline", sub: "done" },
  ];
  return (
    <svg ref={ref} viewBox="0 0 510 90" className="w-full" style={{ maxHeight: 90 }}>
      {steps.slice(0, -1).map((s, i) => (
        <motion.line key={i} x1={s.x + 46} y1={38} x2={steps[i + 1].x - 46} y2={38}
          stroke="rgba(0,82,255,0.45)" strokeWidth="1.5" strokeDasharray="4 3"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.3 + i * 0.2 }} />
      ))}
      {steps.map((s, i) => (
        <g key={s.label}>
          <motion.rect x={s.x - 46} y={18} width={92} height={40} rx={10}
            fill={i === 3 ? "#0052FF" : "rgba(0,82,255,0.1)"} stroke="rgba(0,82,255,0.4)" strokeWidth="1"
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 + i * 0.15 }} style={{ transformOrigin: `${s.x}px 38px` }} />
          <text x={s.x} y={35} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{s.label}</text>
          <text x={s.x} y={50} textAnchor="middle" fontSize="8" fill={i === 3 ? "rgba(255,255,255,0.7)" : "rgba(0,82,255,0.7)"}>{s.sub}</text>
          <text x={s.x} y={78} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">Step {i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

const STEPS = [
  {
    number: "1",
    title: "Open the app",
    desc: "Navigate to localos.xyz/app in your browser. The app runs entirely in your browser. No installation, no terminal, no package manager needed.",
    note: "Works on any modern browser on Mac, Windows, or Linux.",
    cta: { label: "Open LocalOS", href: "https://localos.xyz/app" },
  },
  {
    number: "2",
    title: "Download a model",
    desc: "While you still have internet access, pick a model from the Models page and download it. The download goes directly to your browser storage. This is the only step that needs a connection.",
    note: "Models under 2 GB are free with no wallet needed. Larger models (2 GB and above) require a one-time USDC payment on Base. Connect a wallet on the Models page to unlock them.",
    cta: { label: "Browse Models", href: "/models" },
  },
  {
    number: "3",
    title: "Set up your workspace",
    desc: "Create a project, name it, and optionally add files or knowledge documents. Projects are stored locally in your browser. Nothing is sent anywhere.",
    note: "You can create as many projects as you like. Each gets its own chat history, file tree, and context.",
    cta: null,
  },
  {
    number: "4",
    title: "Turn off your internet",
    desc: "Once your model is downloaded, disconnect from the internet. Everything continues to work. Inference, chat, file access, and the full workspace run with zero network dependency.",
    note: "Air-gap compatible. Works in fully disconnected environments. No telemetry, no cloud calls.",
    cta: null,
  },
];

export default function InstallPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Get Started
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Up and running in <span style={{ color: "#0052FF" }}>4 steps</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              No terminal. No install. Visit the app, download a model while online, set up your workspace, then go fully offline.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Setup flow</div>
              <FlowDiagramSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.08}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-lg"
                    style={{ background: "#0052FF" }}>
                    {step.number}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <h3 className="text-xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>{step.desc}</p>
                    <p className="text-xs leading-relaxed mb-4 px-3 py-2 rounded-lg" style={{ color: "rgba(255,255,255,0.38)", background: "rgba(0,82,255,0.07)", border: "1px solid rgba(0,82,255,0.1)" }}>
                      {step.note}
                    </p>
                    {step.cta && (
                      <a href={step.cta.href}
                        className="inline-block px-5 py-2 rounded-lg text-white font-semibold text-sm"
                        style={{ background: "#0052FF" }}
                        target={step.cta.href.startsWith("http") ? "_blank" : undefined}
                        rel={step.cta.href.startsWith("http") ? "noreferrer" : undefined}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
                        {step.cta.label}
                      </a>
                    )}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="ml-5 mt-3 w-px h-8" style={{ background: "rgba(0,82,255,0.25)" }} />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>What gets created automatically</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Local database", desc: "All your projects, chats, files, and knowledge documents are stored locally in your browser. Nothing leaves your device." },
              { title: "Model cache", desc: "Downloaded models are cached in browser storage. After the first download you never need internet again for that model." },
              { title: "Workspace state", desc: "Window layout, open files, and active project are all persisted locally. The OS restores exactly where you left off." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl p-5 h-full" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <div className="text-sm font-bold text-white mb-2">{item.title}</div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Ready to start?</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open the app, pick a model, and you are running local AI in minutes.
            </p>
            <a href="https://localos.xyz/app" target="_blank" rel="noreferrer"
              className="inline-block px-7 py-3 rounded-xl text-white font-semibold text-sm"
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
