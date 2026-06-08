import { useRef, useState } from "react";
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

function ResponseTimeSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const data = [
    { label: "GitHub Issues", hours: 48, max: 72 },
    { label: "GitHub Discussions", hours: 24, max: 72 },
    { label: "Discord", hours: 4, max: 72 },
  ];

  return (
    <svg ref={ref} viewBox="0 0 340 120" className="w-full" style={{ maxHeight: 120 }}>
      <text x="170" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.5)">Typical response time</text>
      {data.map((d, i) => {
        const y = 28 + i * 30;
        const barW = 200;
        const filled = (d.hours / d.max) * barW;
        return (
          <g key={d.label}>
            <text x="118" y={y + 12} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.5)">{d.label}</text>
            <rect x="122" y={y} width={barW} height={18} rx="5" fill="rgba(255,255,255,0.04)" />
            <motion.rect x="122" y={y} width={0} height={18} rx="5"
              fill="rgba(0,82,255,0.5)"
              animate={inView ? { width: filled } : { width: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: "easeOut" }} />
            <text x={126 + filled} y={y + 12} fontSize="9" fontWeight="700" fill="#4d88ff">
              {d.hours}h
            </text>
          </g>
        );
      })}
      <text x="170" y="115" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.2)">Response times are estimates and not guaranteed</text>
    </svg>
  );
}

const TOPICS = [
  { title: "Bug reports", desc: "Open a GitHub Issue with your OS, Node version, and the exact error. Include steps to reproduce.", href: "https://github.com/localos-dev" },
  { title: "Feature requests", desc: "Start a GitHub Discussion describing the problem you want solved, not just the feature.", href: "https://github.com/localos-dev" },
  { title: "Security issues", desc: "Do not open a public issue. Send a private message via GitHub security advisories instead.", href: "https://github.com/localos-dev" },
  { title: "General questions", desc: "Use GitHub Discussions for setup help and usage questions.", href: "https://github.com/localos-dev" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Contact
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Get in <span style={{ color: "#0052FF" }}>touch</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS is an open source project. All support, feedback, and contributions happen in the open on GitHub.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "60px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Channels */}
            <Reveal>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Where to reach us</div>
                <div className="space-y-4">
                  {TOPICS.map((t) => (
                    <a key={t.title} href={t.href} target="_blank" rel="noreferrer"
                      className="block rounded-xl p-4 transition-all"
                      style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.1)", textDecoration: "none" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(0,82,255,0.3)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(0,82,255,0.1)"; }}>
                      <div className="text-sm font-bold text-white mb-1">{t.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{t.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Response time chart */}
            <Reveal delay={0.1}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Response times</div>
                <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
                  <ResponseTimeSVG />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Message form */}
      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Send a message</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>Direct message</h2>
            <p className="mb-7 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              For private inquiries not suited to public GitHub threads, use the form below. Note that response is not guaranteed and may take several business days.
            </p>
          </Reveal>

          {sent ? (
            <Reveal>
              <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(0,82,255,0.08)", border: "1px solid rgba(0,82,255,0.25)" }}>
                <div className="text-2xl font-black text-white mb-2">Message sent</div>
                <p style={{ color: "rgba(255,255,255,0.5)" }}>Thank you. We will follow up if appropriate. For faster responses, try GitHub Discussions or Discord.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.1}>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Topic</label>
                  <select
                    value={topic} onChange={(e) => setTopic(e.target.value)} required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: topic ? "white" : "rgba(255,255,255,0.35)" }}>
                    <option value="">Select a topic</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="security">Security concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Your email</label>
                  <input type="email" required placeholder="you@example.com"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Message</label>
                  <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
                  style={{ background: "#0052FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
                  Send message
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
