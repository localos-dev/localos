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

const FAMILIES = [
  {
    family: "Qwen 2.5",
    org: "Alibaba",
    variants: ["0.5B", "1.5B", "3B", "7B", "14B", "32B"],
    strengths: "Instruction following, multilingual, strong math and coding",
    bestVariant: "Qwen 2.5 3B",
    size: "2.0 GB",
    context: "128K",
    speed: 90,
    quality: 80,
    desc: "The Qwen family covers the widest size range, from sub-1B models up to 32B. The 3B and 7B variants are popular for local inference and perform well on coding tasks.",
  },
  {
    family: "Gemma 3",
    org: "Google DeepMind",
    variants: ["1B", "4B", "12B", "27B"],
    strengths: "General knowledge, factual accuracy, compact quality",
    bestVariant: "Gemma 3 4B",
    size: "2.5 GB",
    context: "32K",
    speed: 88,
    quality: 82,
    desc: "Gemma 3 delivers more capability per parameter than many competitors. The 4B model is the recommended starting point. Strong on factual and reasoning tasks.",
  },
  {
    family: "Phi and Mistral",
    org: "Microsoft and Mistral AI",
    variants: ["Phi 3.5 Mini", "Phi 4 Mini", "Mistral 7B", "Mistral Nemo"],
    strengths: "Efficient reasoning, small footprint, strong benchmarks",
    bestVariant: "Phi 3.5 Mini",
    size: "2.2 GB",
    context: "128K",
    speed: 87,
    quality: 76,
    desc: "Phi models from Microsoft punch above their weight on reasoning tasks. Mistral models offer a European-developed alternative with strong multilingual performance.",
  },
];

function FamilyCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const metrics = FAMILIES.map((f) => ({ name: f.family, speed: f.speed, quality: f.quality }));
  return (
    <div ref={ref} className="space-y-5">
      {metrics.map((m, i) => (
        <div key={m.name} className="rounded-xl p-4" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)" }}>
          <div className="text-sm font-bold text-white mb-3">{m.name}</div>
          {[{ l: "Speed", v: m.speed }, { l: "Quality", v: m.quality }].map(({ l, v }) => (
            <div key={l} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</span>
                <span className="text-xs font-bold" style={{ color: "#0052FF" }}>{v}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #0052FF, #3377FF)" }}
                  initial={{ width: 0 }} animate={inView ? { width: `${v}%` } : { width: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: "easeOut" }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function OtherModelsPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Models / Other Families
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Qwen, Gemma, <span style={{ color: "#0052FF" }}>Phi and Mistral</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Beyond Llama, LocalOS supports three other major model families. Each has distinct strengths worth knowing before you download.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Family comparison</div>
                <h2 className="text-2xl font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>Speed and quality benchmarks</h2>
                <FamilyCompareChart />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="space-y-6">
                {FAMILIES.map((f, i) => (
                  <div key={f.family} className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-base font-bold text-white">{f.family}</div>
                        <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>by {f.org}</div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {f.variants.slice(0, 3).map((v) => (
                          <span key={v} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff" }}>{v}</span>
                        ))}
                        {f.variants.length > 3 && <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>+{f.variants.length - 3}</span>}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>{f.desc}</p>
                    <div className="flex gap-3">
                      <div className="rounded-lg px-2 py-1 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div className="text-xs font-bold" style={{ color: "#0052FF" }}>Start with</div>
                        <div className="text-xs text-white">{f.bestVariant}</div>
                      </div>
                      <div className="rounded-lg px-2 py-1 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div className="text-xs font-bold" style={{ color: "#0052FF" }}>Size</div>
                        <div className="text-xs text-white">{f.size}</div>
                      </div>
                      <div className="rounded-lg px-2 py-1 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div className="text-xs font-bold" style={{ color: "#0052FF" }}>Context</div>
                        <div className="text-xs text-white">{f.context}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Browse the full catalog</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              All families and variants are available in the LocalOS model catalog. Download any of them with one click.
            </p>
            <a href="/models" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              Model Catalog
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
