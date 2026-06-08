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

function WebOutputSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  return (
    <svg ref={ref} viewBox="0 0 420 180" className="w-full" style={{ maxHeight: 180 }}>
      {/* Browser frame */}
      <motion.rect x="10" y="10" width="400" height="160" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(0,82,255,0.3)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} />
      {/* Address bar */}
      <rect x="20" y="20" width="380" height="22" rx="6" fill="rgba(255,255,255,0.05)" />
      <circle cx="36" cy="31" r="4" fill="rgba(255,80,80,0.5)" />
      <circle cx="52" cy="31" r="4" fill="rgba(255,180,0,0.5)" />
      <circle cx="68" cy="31" r="4" fill="rgba(0,200,80,0.4)" />
      <text x="90" y="35" fontSize="8" fill="rgba(255,255,255,0.3)">localos://preview/my-landing-page</text>
      {/* Fake page content */}
      <motion.rect x="20" y="50" width="380" height="50" rx="6" fill="rgba(0,82,255,0.15)"
        initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} />
      <text x="210" y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Hero Section</text>
      <text x="210" y="88" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">generated layout, copy, and styling</text>
      <motion.rect x="20" y="108" width="185" height="52" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55 }} />
      <text x="112" y="128" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Feature card</text>
      <motion.rect x="215" y="108" width="185" height="52" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.65 }} />
      <text x="307" y="128" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Feature card</text>
    </svg>
  );
}

function PageTypeBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const types = [
    { label: "Landing page", pct: 98 },
    { label: "Portfolio", pct: 95 },
    { label: "Product page", pct: 93 },
    { label: "Contact and form page", pct: 90 },
    { label: "Documentation page", pct: 87 },
    { label: "Blog layout", pct: 82 },
  ];
  return (
    <div ref={ref} className="space-y-3">
      {types.map((t, i) => (
        <div key={t.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{t.label}</span>
            <span className="text-xs font-bold" style={{ color: "#0052FF" }}>{t.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #0052FF, #3377FF)" }}
              initial={{ width: 0 }} animate={inView ? { width: `${t.pct}%` } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: "easeOut" }} />
          </div>
        </div>
      ))}
      <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Prompt success rates for web page type generation</p>
    </div>
  );
}

export default function WebBuilderPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Build / Web Builder
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Websites from <span style={{ color: "#0052FF" }}>a sentence</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Describe the page you want in plain language. LocalOS generates complete HTML with layout, copy, and styling in one pass.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Generated page preview (live in LocalOS)</div>
              <WebOutputSVG />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Page types</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>What you can generate</h2>
                <PageTypeBars />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Example prompts</div>
                <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>How to write a good prompt</h2>
                <div className="space-y-3">
                  {[
                    { prompt: "A dark-themed landing page for an AI productivity tool with a hero section, three feature cards, and a CTA button", result: "Full landing page with responsive layout and dark styling" },
                    { prompt: "A portfolio page for a freelance designer with a grid of project thumbnails and a contact section", result: "Portfolio with grid layout and mailto contact form" },
                    { prompt: "A product page for a coffee brand with a hero image placeholder, product description, and buy button", result: "Product page with image placeholder and e-commerce styling" },
                  ].map(({ prompt, result }, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.12)" }}>
                      <div className="text-xs font-bold mb-1.5" style={{ color: "rgba(0,82,255,0.8)" }}>Prompt</div>
                      <p className="text-sm mb-2 italic" style={{ color: "rgba(255,255,255,0.6)" }}>{prompt}</p>
                      <div className="text-xs font-bold mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Result</div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{result}</p>
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
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Build your first page</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Open LocalOS, create a project, and use the Build button with a description of the page you want.
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
