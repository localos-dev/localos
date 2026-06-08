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

function ActivityChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const W = 340; const H = 80; const cols = 24; const rows = 7;
  const cellSize = 12; const gap = 3;
  const totalW = cols * (cellSize + gap);
  const offsetX = (W - totalW) / 2;
  const cells: { x: number; y: number; intensity: number }[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const intensity = Math.random();
      const recentBoost = c > 18 ? 1.5 : 1;
      cells.push({ x: offsetX + c * (cellSize + gap), y: r * (cellSize + gap), intensity: Math.min(1, intensity * recentBoost) });
    }
  }
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
      {cells.map((cell, i) => (
        <motion.rect key={i} x={cell.x} y={cell.y} width={cellSize} height={cellSize} rx={3}
          fill={`rgba(0,82,255,${cell.intensity > 0.6 ? 0.8 : cell.intensity > 0.3 ? 0.4 : 0.1})`}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.05 + (i / cells.length) * 0.5 }} />
      ))}
      <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">
        24 weeks of community activity
      </text>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const CHANNELS = [
  {
    name: "GitHub",
    icon: "github",
    desc: "Browse the source code, open issues, and submit pull requests. All development happens in the open at github.com/localos-dev.",
    action: "View on GitHub",
    href: "https://github.com/localos-dev",
    stat: "Open source",
  },
  {
    name: "X",
    icon: "x",
    desc: "Follow for releases, updates, and what the community is building. Announcements go out here first.",
    action: "Follow on X",
    href: "https://x.com/localos_xyz",
    stat: "Updates",
  },
  {
    name: "Documentation",
    icon: "docs",
    desc: "Full reference for setup, configuration, API endpoints, and model management. Hosted at localos.xyz/docs.",
    action: "Read the docs",
    href: "https://localos.xyz/docs",
    stat: "Reference",
  },
];

const WAYS_TO_CONTRIBUTE = [
  { title: "Report a bug", desc: "Open a GitHub issue with reproduction steps. Include your OS, Node version, and the exact error message." },
  { title: "Suggest a feature", desc: "Start a GitHub Discussion with your use case. Good feature requests include the problem, not just the proposed solution." },
  { title: "Submit a pull request", desc: "Fork the repo, make your change in a feature branch, and open a PR against main. All PRs require passing typechecks." },
  { title: "Improve documentation", desc: "Docs PRs are always welcome. Fix typos, add examples, or expand thin sections." },
  { title: "Add a model", desc: "New model entries go in the LLM runtime catalog file. Include the model ID, display name, size, and description." },
  { title: "Share what you built", desc: "Built something interesting with LocalOS? Post it in GitHub Discussions. Community showcases drive adoption." },
];

function ChannelIcon({ type, color }: { type: string; color: string }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(0,82,255,0.1)", border: "1px solid rgba(0,82,255,0.2)", color }}>
      {type === "github" && <GitHubIcon />}
      {type === "x" && <XIcon />}
      {type === "docs" && <DocsIcon />}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <PageWrapper>
      <section style={{ background: "linear-gradient(180deg, #040A1C 0%, #070D1F 100%)", padding: "80px 0 60px" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <Reveal>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,82,255,0.12)", color: "#4d88ff", border: "1px solid rgba(0,82,255,0.25)", letterSpacing: "0.1em" }}>
              Community
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ letterSpacing: "-0.03em" }}>
              Built in the <span style={{ color: "#0052FF" }}>open</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              LocalOS is open source and community-driven. Follow for updates, contribute on GitHub, and read the full documentation at localos.xyz/docs.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "48px 0" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.12)" }}>
              <div className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Community activity heatmap</div>
              <ActivityChart />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "72px 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <Reveal className="mb-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Channels</div>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Where to find us</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CHANNELS.map((ch, i) => (
              <Reveal key={ch.name} delay={i * 0.1}>
                <a href={ch.href} target="_blank" rel="noreferrer" className="rounded-2xl p-6 flex flex-col h-full group"
                  style={{ background: "rgba(0,82,255,0.05)", border: "1px solid rgba(0,82,255,0.12)", textDecoration: "none",
                    transition: "border-color 0.2s, background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,82,255,0.4)"; e.currentTarget.style.background = "rgba(0,82,255,0.09)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,82,255,0.12)"; e.currentTarget.style.background = "rgba(0,82,255,0.05)"; }}>
                  <div className="flex items-center gap-3 mb-4">
                    <ChannelIcon type={ch.icon} color={ch.icon === "x" ? "white" : "#4d88ff"} />
                    <div>
                      <div className="text-base font-bold text-white">{ch.name}</div>
                      <div className="text-xs" style={{ color: "#4d88ff" }}>{ch.stat}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>{ch.desc}</p>
                  <div className="text-sm font-semibold" style={{ color: "#4d88ff" }}>{ch.action}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#070D1F", padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <Reveal className="mb-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,82,255,0.7)", letterSpacing: "0.1em" }}>Contribute</div>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Ways to contribute</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WAYS_TO_CONTRIBUTE.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="rounded-xl p-5 h-full" style={{ background: "rgba(0,82,255,0.04)", border: "1px solid rgba(0,82,255,0.1)" }}>
                  <div className="text-sm font-bold text-white mb-2">{w.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{w.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#060B18", padding: "60px 0 80px" }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Start on GitHub</h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              All code, issues, and discussions are at github.com/localos-dev.
            </p>
            <a href="https://github.com/localos-dev" target="_blank" rel="noreferrer"
              className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "#0052FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}>
              View on GitHub
            </a>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
