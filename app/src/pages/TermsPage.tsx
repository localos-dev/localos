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

function OwnershipDiagram() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const items = [
    { label: "Source code", owner: "MIT License", y: 30 },
    { label: "Your prompts", owner: "You own them", y: 62 },
    { label: "Your files", owner: "You own them", y: 94 },
    { label: "Model weights", owner: "Upstream license", y: 126 },
  ];

  return (
    <svg ref={ref} viewBox="0 0 380 170" className="w-full" style={{ maxHeight: 170 }}>
      <text x="90" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.3)" letterSpacing="1">ITEM</text>
      <text x="290" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.3)" letterSpacing="1">OWNERSHIP</text>
      <line x1="190" y1="20" x2="190" y2="155" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {items.map((item, i) => (
        <g key={item.label}>
          <motion.rect x="10" y={item.y} width="160" height="24" rx="6"
            fill="rgba(0,82,255,0.07)" stroke="rgba(0,82,255,0.18)" strokeWidth="1"
            initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1 }} />
          <text x="90" y={item.y + 16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">{item.label}</text>
          <motion.line x1="175" y1={item.y + 12} x2="208" y2={item.y + 12}
            stroke="rgba(0,82,255,0.5)" strokeWidth="1" strokeDasharray="3 2"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 }} />
          <motion.rect x="210" y={item.y} width="160" height="24" rx="6"
            fill={item.owner.startsWith("You") ? "rgba(0,82,255,0.18)" : "rgba(255,255,255,0.04)"}
            stroke={item.owner.startsWith("You") ? "rgba(0,82,255,0.4)" : "rgba(255,255,255,0.08)"} strokeWidth="1"
            initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.1 }} />
          <text x="290" y={item.y + 16} textAnchor="middle" fontSize="10"
            fill={item.owner.startsWith("You") ? "#4d88ff" : "rgba(255,255,255,0.4)"}>{item.owner}</text>
        </g>
      ))}
    </svg>
  );
}

const SECTIONS = [
  {
    title: "Acceptance",
    body: "By downloading, installing, or running LocalOS, you agree to these terms. If you do not agree, do not use the software. These terms apply to the software itself, not to any content you create or process with it.",
  },
  {
    title: "License",
    body: "LocalOS is released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software. The full license text is included in the repository.",
  },
  {
    title: "Your content",
    body: "You retain full ownership of all content you create, upload, or process using LocalOS. This includes prompts, chat history, project files, and knowledge base documents. LocalOS does not claim any rights to your content.",
  },
  {
    title: "No warranty",
    body: "LocalOS is provided as-is, without warranty of any kind, express or implied. This includes but is not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. You use the software at your own risk.",
  },
  {
    title: "Limitation of liability",
    body: "In no event shall the contributors or maintainers of LocalOS be liable for any claim, damages, or other liability arising from your use of the software. This includes data loss, hardware damage, consequential or indirect damages.",
  },
  {
    title: "AI-generated content",
    body: "LocalOS facilitates the use of open language models. You are solely responsible for any content generated through the software, including how it is used, shared, or published. AI outputs are not verified by LocalOS and should be reviewed before any professional or production use.",
  },
  {
    title: "Third-party models",
    body: "Models you download and use through LocalOS are subject to their own licenses. Llama models are subject to the Meta Llama community license. Qwen models follow the Qwen license terms. Other models may have their own restrictions. Review the license for any model before commercial use.",
  },
  {
    title: "Changes to these terms",
    body: "These terms may be updated at any time. Changes are published in the repository changelog. Because LocalOS has no account system, we cannot notify users directly. Continued use of the software after a change constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Terms of Use
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Simple terms for <span style={{ color: "#0052FF" }}>open software</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS is MIT licensed. You own what you build with it. Here is the full statement of what that means.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Ownership summary</div>
              <OwnershipDiagram />
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
              <Reveal key={s.title} delay={i * 0.05}>
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
