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

function AppPreviewSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  return (
    <svg ref={ref} viewBox="0 0 420 190" className="w-full" style={{ maxHeight: 190 }}>
      <motion.rect x="10" y="10" width="400" height="170" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(0,82,255,0.3)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} />
      <rect x="20" y="20" width="380" height="22" rx="6" fill="rgba(255,255,255,0.05)" />
      <circle cx="36" cy="31" r="4" fill="rgba(255,80,80,0.5)" />
      <circle cx="52" cy="31" r="4" fill="rgba(255,180,0,0.5)" />
      <circle cx="68" cy="31" r="4" fill="rgba(0,200,80,0.4)" />
      <text x="90" y="35" fontSize="8" fill="rgba(255,255,255,0.3)">Budget Tracker App</text>
      {/* App UI elements */}
      <motion.rect x="20" y="50" width="380" height="38" rx="6" fill="rgba(0,82,255,0.15)"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.35 }} />
      <text x="210" y="65" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">Total Balance</text>
      <text x="210" y="81" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0052FF">$2,450.00</text>
      <motion.rect x="20" y="96" width="115" height="70" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} />
      <text x="77" y="118" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">Income</text>
      <text x="77" y="134" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(0,200,100,0.9)">+$3,200</text>
      <motion.rect x="145" y="96" width="115" height="70" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.58 }} />
      <text x="202" y="118" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">Expenses</text>
      <text x="202" y="134" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(255,80,80,0.9)">-$750</text>
      <motion.rect x="270" y="96" width="130" height="70" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.66 }} />
      <text x="335" y="118" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">Add Transaction</text>
      <rect x="285" y="126" width="100" height="22" rx="5" fill="#0052FF" />
      <text x="335" y="141" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">Add</text>
    </svg>
  );
}

function AppComplexityBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const apps = [
    { label: "Calculator or converter", pct: 98, type: "Utility" },
    { label: "To-do or task list", pct: 95, type: "Productivity" },
    { label: "Budget or expense tracker", pct: 90, type: "Finance" },
    { label: "Habit or goal tracker", pct: 88, type: "Personal" },
    { label: "Quiz or flashcard app", pct: 85, type: "Education" },
    { label: "Kanban or project board", pct: 80, type: "Management" },
  ];
  return (
    <div ref={ref} className="space-y-3">
      {apps.map((a, i) => (
        <div key={a.label}>
          <div className="flex justify-between mb-1">
            <div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{a.label}</span>
              <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,82,255,0.15)", color: "#4d88ff" }}>{a.type}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: "#0052FF" }}>{a.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #0052FF, #3377FF)" }}
              initial={{ width: 0 }} animate={inView ? { width: `${a.pct}%` } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: "easeOut" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppBuilderPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Build / App Builder
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Apps with <span style={{ color: "#0052FF" }}>real logic</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS generates complete interactive applications: data input, state management, calculations, and display, all in a single self-contained file.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Example: budget tracker app generated from one prompt</div>
              <AppPreviewSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>App types</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>What works best</h2>
                <AppComplexityBars />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Best practices</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>Writing a good Build prompt</h2>
                <div className="space-y-3">
                  {[
                    { t: "Name the output type", d: "Say 'a budget tracker app' not 'a finance thing'. The model produces better structure when it knows the output category." },
                    { t: "Describe the inputs", d: "List the fields users will fill in. 'A form with amount, category, and date fields that adds to a running total' produces a cleaner implementation." },
                    { t: "Specify the interactions", d: "Mention what buttons do, what calculations happen, and how the display updates. The more specific, the less iteration is needed." },
                    { t: "Ask for local storage", d: "Adding 'save state to localStorage' makes the app persist between page refreshes without needing a backend." },
                  ].map(({ t, d }) => (
                    <div key={t} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
                      <div className="text-sm font-bold text-white mb-1">{t}</div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Build your first app</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS, create a project, type a description of the app you want, and press Build.
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
