import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import SiteNavbar from "@/components/SiteNavbar";

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const yInit = direction === "up" ? 32 : 0;
  const xInit = direction === "left" ? -32 : direction === "right" ? 32 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yInit, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "60vh",
        background: "linear-gradient(170deg, #010818 0%, #020D2E 60%, #030F38 100%)",
        padding: "140px 20px 80px",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,82,255,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto">
        <Reveal>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 tracking-widest"
            style={{
              background: "rgba(0,82,255,0.12)",
              border: "1px solid rgba(0,82,255,0.3)",
              color: "#4d8aff",
            }}
          >
            LOCALOS TOKEN
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Community owned.
            <br />
            <span style={{ color: "#0052FF" }}>Zero insider allocation.</span>
          </h1>
          <p className="text-lg md:text-xl mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            Launched fairly through Clanker. No private rounds, no team tokens, no venture capital.
            100 percent of supply entered circulation through the community.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DistributionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const rows = [
    { category: "Community", allocation: "100%", fill: 1.0 },
    { category: "Team", allocation: "0%", fill: 0 },
    { category: "Investors", allocation: "0%", fill: 0 },
    { category: "Advisors", allocation: "0%", fill: 0 },
    { category: "Foundation", allocation: "0%", fill: 0 },
    { category: "Treasury", allocation: "0%", fill: 0 },
  ];

  return (
    <section style={{ background: "#070D1F", padding: "100px 0" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Token distribution
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Every token that exists was acquired by community participants in the open market.
            No reserved allocations, no vesting schedules for insiders.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Reveal direction="left">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="px-5 py-3 text-xs font-bold tracking-widest"
                style={{
                  background: "rgba(0,82,255,0.1)",
                  borderBottom: "1px solid rgba(0,82,255,0.15)",
                  color: "#4d8aff",
                }}
              >
                INITIAL DISTRIBUTION
              </div>
              {rows.map((row, i) => (
                <div
                  key={row.category}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderBottom:
                      i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  }}
                >
                  <span className="text-sm font-medium text-white">{row.category}</span>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ width: "100px", background: "rgba(255,255,255,0.06)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${row.fill * 100}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ background: row.fill > 0 ? "#0052FF" : "transparent" }}
                      />
                    </div>
                    <span
                      className="text-sm font-bold tabular-nums w-10 text-right"
                      style={{ color: row.fill > 0 ? "#fff" : "rgba(255,255,255,0.2)" }}
                    >
                      {row.allocation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div ref={ref} className="space-y-5">
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(0,82,255,0.07)", border: "1px solid rgba(0,82,255,0.2)" }}
              >
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Community circulating supply at launch
                </div>
              </div>
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-3xl font-bold text-white mb-1">0%</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Team, investor, and advisor allocation
                </div>
              </div>
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-sm font-medium mb-2" style={{ color: "#4d8aff" }}>
                  Launch method
                </div>
                <div className="text-base font-semibold text-white">
                  Fair launch via Clanker
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No presale. No whitelist. No private round.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ValueFlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const nodes = [
    { label: "Users", sub: "Pay for services", color: "#0052FF", x: 50, y: 0 },
    { label: "LocalOS Platform", sub: "Processes activity", color: "#1A3A7A", x: 50, y: 1 },
    { label: "Service Revenue", sub: "USDC and Token", color: "#0A1F4A", x: 20, y: 2 },
    { label: "Trading Fees", sub: "2% platform fee", color: "#0A1F4A", x: 80, y: 2 },
    { label: "Team Operations", sub: "Sustainable growth", color: "#051030", x: 50, y: 3 },
  ];

  return (
    <section
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #081535 0%, #040A18 70%)",
        padding: "100px 0",
      }}
    >
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Value flow
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Revenue flows from platform activity, not from selling reserved tokens.
          </p>
        </Reveal>

        <div ref={ref} className="space-y-4">
          {[
            {
              label: "Users",
              sub: "Pay for services via USDC or LocalOS Token",
              delay: 0,
            },
            {
              label: "LocalOS Platform",
              sub: "Handles AI services, enterprise deployments, hosted solutions",
              delay: 0.1,
              arrow: true,
            },
            {
              label: "Revenue split",
              sub: "",
              delay: 0.2,
              isSplit: true,
            },
            {
              label: "Team Operations",
              sub: "Funds product development and ecosystem growth",
              delay: 0.35,
              arrow: true,
              isEnd: true,
            },
          ].map((item, i) =>
            item.isSplit ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: item.delay }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { title: "Service Payments", detail: "USDC and LocalOS Token", icon: "S" },
                  { title: "2% Trading Fee", detail: "Collected on platform activity", icon: "T" },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: "rgba(0,82,255,0.08)",
                      border: "1px solid rgba(0,82,255,0.2)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2"
                      style={{ background: "#0052FF", color: "#fff" }}
                    >
                      {card.icon}
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{card.title}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {card.detail}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: item.delay }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-full rounded-xl p-5 text-center"
                  style={{
                    background: item.isEnd
                      ? "rgba(0,82,255,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: item.isEnd
                      ? "1px solid rgba(0,82,255,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="text-base font-bold text-white">{item.label}</div>
                  {item.sub && (
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {item.sub}
                    </div>
                  )}
                </div>
                {item.arrow && (
                  <div
                    className="w-px my-2"
                    style={{ height: "24px", background: "rgba(0,82,255,0.4)" }}
                  />
                )}
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function RevenueSection() {
  const sources = [
    {
      title: "AI Services",
      desc: "Premium AI features and advanced capabilities within the LocalOS platform.",
    },
    {
      title: "Enterprise Deployments",
      desc: "Private infrastructure and enterprise licensing for organizations.",
    },
    {
      title: "Hosted Solutions",
      desc: "Managed environments for teams that need a turnkey LocalOS setup.",
    },
    {
      title: "Professional Services",
      desc: "Custom integrations and implementation support for enterprise clients.",
    },
    {
      title: "Marketplace",
      desc: "Future ecosystem products, plugins, agents, and extensions.",
    },
    {
      title: "Trading Fees",
      desc: "A 2% platform trading fee collected on activity within the ecosystem.",
    },
  ];

  return (
    <section style={{ background: "#070D1F", padding: "100px 0" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Revenue model
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            The team earns through platform activity and service revenue,
            not through selling reserved tokens.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sources.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div
                className="rounded-2xl p-5 h-full"
                style={{
                  background: "rgba(0,82,255,0.05)",
                  border: "1px solid rgba(0,82,255,0.15)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ background: "#0052FF" }}
                />
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10">
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="text-sm font-semibold text-white mb-1">Team compensation method</div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Service payments received in USDC and LocalOS Token, plus a 2% platform trading fee.
              No token allocations. No vesting schedules. Revenue comes from building useful products.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function UtilitySection() {
  const utilities = [
    {
      title: "Premium Features",
      desc: "Unlock advanced LocalOS functionality beyond the free tier.",
    },
    {
      title: "AI Credits",
      desc: "Access enhanced compute and agent capabilities within the platform.",
    },
    {
      title: "Marketplace Payments",
      desc: "Purchase plugins, templates, agents, and tools from the ecosystem.",
    },
    {
      title: "Governance",
      desc: "Participate in ecosystem proposals and voting on future direction.",
    },
    {
      title: "Service Discounts",
      desc: "Receive discounts when paying for LocalOS services with the token.",
    },
  ];

  return (
    <section
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #081535 0%, #040A18 70%)",
        padding: "100px 0",
      }}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Token utility
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            The LocalOS Token is designed to power activity across the entire ecosystem.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {utilities.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.08}>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-xs font-bold tracking-widest mb-3"
                  style={{ color: "#4d8aff" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{u.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {u.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const points = [
    {
      title: "No team allocation",
      body: "Most token launches allocate large percentages to insiders. LocalOS takes a different approach. The team earns through product adoption, service revenue, and ecosystem growth, not through selling reserved tokens. This creates a cleaner alignment between the platform and its community.",
    },
    {
      title: "Revenue driven",
      body: "The team does not rely on token allocations. The team earns through platform activity and service revenue. Long-term success depends on building useful products, not on managing a token treasury.",
    },
    {
      title: "Long term alignment",
      body: "The success of LocalOS depends on building useful products and services rather than selling reserved tokens. When the platform grows, everyone who holds the token benefits alongside the team.",
    },
  ];

  return (
    <section style={{ background: "#040912", padding: "100px 0" }}>
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Core philosophy
          </h2>
        </Reveal>
        <div className="space-y-5">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const pillars = [
    "Users own their data",
    "AI runs without cloud dependency",
    "Builders create value through products",
    "The community owns the token supply",
  ];

  return (
    <section
      style={{
        background: "linear-gradient(170deg, #030B24 0%, #070D1F 100%)",
        padding: "100px 0",
      }}
    >
      <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
        <Reveal className="mb-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-5"
            style={{ letterSpacing: "-0.03em" }}
          >
            Long term vision
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            Build the leading local-first AI ecosystem. The LocalOS Token serves as the economic
            layer connecting users, builders, services, and the broader LocalOS ecosystem.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar} delay={i * 0.08}>
              <div
                className="rounded-xl px-5 py-4 text-sm font-medium text-white text-left"
                style={{
                  background: "rgba(0,82,255,0.08)",
                  border: "1px solid rgba(0,82,255,0.2)",
                }}
              >
                <span
                  className="inline-block text-xs font-bold mr-2"
                  style={{ color: "#4d8aff" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {pillar}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [, setLocation] = useLocation();
  return (
    <section
      className="text-center"
      style={{
        background: "linear-gradient(170deg, #001A6E 0%, #0052FF 60%, #003AB3 100%)",
        padding: "100px 20px",
      }}
    >
      <Reveal>
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          Own the ecosystem.
        </h2>
        <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
          100 percent community owned. Zero insider allocation. Built to last.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation("/app")}
            className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "2px solid rgba(255,255,255,0.38)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
          >
            Open LocalOS
          </button>
          <button
            onClick={() => setLocation("/docs")}
            className="px-8 py-4 rounded-xl font-bold text-base transition-all"
            style={{
              background: "rgba(0,0,0,0.18)",
              border: "2px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.65)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.32)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
          >
            Documentation
          </button>
        </div>
      </Reveal>
    </section>
  );
}

export default function TokenPage() {
  return (
    <div className="text-white overflow-x-hidden" style={{ background: "#010818" }}>
      <SiteNavbar transparent />
      <HeroSection />
      <DistributionSection />
      <ValueFlowSection />
      <RevenueSection />
      <UtilitySection />
      <PhilosophySection />
      <VisionSection />
      <CTASection />
    </div>
  );
}
