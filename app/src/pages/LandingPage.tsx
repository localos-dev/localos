import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import SiteNavbar from "@/components/SiteNavbar";

// ── Particle canvas ───────────────────────────────────────────────────────────

function ParticleCanvas({ color = "#0052FF", count = 60 }: { color?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = Math.floor((1 - dist / 110) * 35)
              .toString(16)
              .padStart(2, "0");
            ctx.strokeStyle = color + alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = color + "88";
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Scroll reveal wrapper ─────────────────────────────────────────────────────

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
  const yInit = direction === "up" ? 36 : 0;
  const xInit = direction === "left" ? -36 : direction === "right" ? 36 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yInit, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section 1: Hero ───────────────────────────────────────────────────────────

function ArchitectureSVG() {
  const cx = 240;
  const cy = 230;
  const coreR = 62;
  const orbitR = 145;

  // 8 satellites, evenly spaced clockwise from top
  const satellites = [
    { label: "Websites",  angle: 90  },
    { label: "Apps",      angle: 45  },
    { label: "Documents", angle: 0   },
    { label: "Databases", angle: -45 },
    { label: "Agents",    angle: -90 },
    { label: "Knowledge", angle: -135 },
    { label: "Design",    angle: 180 },
    { label: "Code",      angle: 135 },
  ];

  function pos(angle: number, r: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function textAnchor(angle: number): "start" | "middle" | "end" {
    const cos = Math.cos((angle * Math.PI) / 180);
    if (cos < -0.3) return "end";
    if (cos > 0.3) return "start";
    return "middle";
  }

  return (
    <svg viewBox="0 0 500 460" className="w-full">
      <defs>
        <radialGradient id="coreGrad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2B7FFF" />
          <stop offset="100%" stopColor="#0033BB" />
        </radialGradient>
        <filter id="coreBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Spokes - viewBox 500x460 */}
      {satellites.map(({ label, angle }, i) => {
        const dot = pos(angle, orbitR);
        const lineStart = pos(angle, coreR + 2);
        const lineEnd = pos(angle, orbitR - 6);
        const labelPos = pos(angle, orbitR + 20);
        const dotStart = pos(angle, coreR + 8);
        return (
          <g key={label}>
            <line
              x1={lineStart.x} y1={lineStart.y}
              x2={lineEnd.x} y2={lineEnd.y}
              stroke="rgba(0,82,255,0.28)"
              strokeWidth="1"
            />
            {/* traveling dot */}
            <motion.circle
              r={3}
              fill="#4D94FF"
              initial={{ cx: dotStart.x, cy: dotStart.y, opacity: 0.9 }}
              animate={{
                cx: [dotStart.x, lineEnd.x],
                cy: [dotStart.y, lineEnd.y],
                opacity: [0.9, 0.1],
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28, ease: "linear" }}
            />
            {/* endpoint dot */}
            <circle cx={dot.x} cy={dot.y} r={4} fill="#0052FF" opacity={0.85} />
            <text
              x={labelPos.x} y={labelPos.y + 4}
              textAnchor={textAnchor(angle)}
              fill="rgba(255,255,255,0.6)"
              fontSize={10.5}
              fontFamily="system-ui, -apple-system, sans-serif"
            >{label}</text>
          </g>
        );
      })}

      {/* Pulsing glow rings */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke="#0052FF"
          strokeWidth={1.5}
          initial={{ r: coreR, opacity: 0.55 }}
          animate={{ r: coreR + 45, opacity: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
        />
      ))}

      {/* Core circle shadow/glow */}
      <circle cx={cx} cy={cy} r={coreR + 10} fill="#0052FF" opacity={0.18} />

      {/* Core circle */}
      <circle cx={cx} cy={cy} r={coreR} fill="url(#coreGrad)" />

      {/* Core border */}
      <circle cx={cx} cy={cy} r={coreR} fill="none" stroke="rgba(100,160,255,0.4)" strokeWidth={1.5} />

      {/* LocalOS logo centered: fills most of the circle */}
      <image
        href="/logo.png"
        x={cx - 48}
        y={cy - 48}
        width={96}
        height={96}
      />
    </svg>
  );
}

function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #000D2E 0%, #001A6E 40%, #0052FF 100%)",
      }}
    >
      <ParticleCanvas color="#4488ff" count={65} />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 25% 45%, rgba(0,82,255,0.14) 0%, transparent 65%)" }}
      />

      {/* Main content: fills available height */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-5 md:px-10 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center pt-20 pb-8">
          {/* Left: copy */}
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              Own your AI.
              <br />
              <span style={{ color: "#6699FF" }}>Own your data.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto md:mx-0"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              A complete AI operating system that runs entirely on your machine.
              Chat, build, and create with no cloud and no data leaving your device.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <button
                onClick={() => setLocation("/app")}
                data-testid="hero-enter-btn"
                className="px-7 py-3.5 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ background: "#0052FF" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0040CC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0052FF")}
              >
                Open LocalOS
              </button>
              <button
                className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onClick={() => setLocation("/docs")}
              >
                Documentation
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-xs mt-4 text-center md:text-left"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Models under 2 GB are free. Larger models unlock once with USDC on Base. No subscription.
            </motion.p>
          </div>

          {/* Right: architecture diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="flex justify-center"
          >
            <ArchitectureSVG />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient: blends hero into the next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          background: "linear-gradient(to bottom, transparent 0%, #030810 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Stat strip: pinned to bottom of hero */}
      <div className="relative z-10 w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            {[
              { label: "Latency", value: "Zero", sub: "No network round-trips" },
              { label: "Privacy", value: "Total", sub: "Nothing leaves your machine" },
              { label: "Cost", value: "None", sub: "No API fees ever" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="py-5 px-4 md:px-8 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5" style={{ letterSpacing: "-0.03em" }}>{stat.value}</div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "#6699FF" }}>{stat.label}</div>
                <div className="text-xs hidden md:block" style={{ color: "rgba(255,255,255,0.32)" }}>{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Model Logos Strip ─────────────────────────────────────────────────────────

const MODEL_LOGOS = [
  { src: "/logo-llama.png",     alt: "Llama by Meta",    label: "Llama by Meta",    scale: 1.0 },
  { src: "/logo-mistral.png",   alt: "Mistral AI",       label: "Mistral AI",       scale: 1.0 },
  { src: "/logo-gemma.png",     alt: "Gemma by Google",  label: "Gemma by Google",  scale: 2.1 },
  { src: "/logo-qwen.png",      alt: "Qwen",             label: "Qwen",             scale: 1.0 },
  { src: "/logo-microsoft.png", alt: "Phi by Microsoft", label: "Phi by Microsoft", scale: 1.0 },
  { src: "/logo-hermes.png",    alt: "Hermes Agent",     label: "Hermes Agent",     scale: 1.15 },
];

function ModelLogosStrip() {
  const doubled = [...MODEL_LOGOS, ...MODEL_LOGOS];
  return (
    <>
      <style>{`
        @keyframes logoticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes logoticker-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <section
        style={{
          background: "#030810",
          padding: "52px 0 48px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="text-xs font-bold uppercase"
            style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.16em" }}
          >
            Compatible with any local model
          </div>
        </div>

        <div
          style={{
            overflow: "hidden",
            maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 18,
              width: "max-content",
              animation: "logoticker 32s linear infinite",
            }}
          >
            {doubled.map((logo, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 16,
                  width: 172,
                  height: 80,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  flexShrink: 0,
                  padding: "6px 14px 8px",
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      height: 36,
                      width: "auto",
                      maxWidth: 136,
                      objectFit: "contain",
                      transform: `scale(${logo.scale})`,
                      transformOrigin: "center center",
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#4A5568",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                    lineHeight: 1.3,
                    textTransform: "uppercase",
                  }}
                >
                  {logo.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Section 2: Local First ────────────────────────────────────────────────────

function LocalFirstSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-white overflow-hidden" style={{ padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5" style={{ letterSpacing: "-0.03em" }}>
              The internet stays out.
            </h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              LocalOS operates entirely within your machine boundaries. Every inference call,
              every file access, every database query runs locally. The network is never involved.
            </p>
            <div className="space-y-5">
              {[
                ["Offline by design", "Works without any internet connection"],
                ["Air-gap compatible", "Runs in fully disconnected environments"],
                ["No telemetry", "Zero usage data collected or transmitted"],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0052FF" }} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{title}</div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref} className="flex items-center justify-center">
          <svg viewBox="0 0 380 360" className="w-full max-w-xs md:max-w-sm">
            <defs>
              <pattern id="grid-lf" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,82,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="380" height="360" fill="url(#grid-lf)" />

            <ellipse cx={190} cy={58} rx={95} ry={42} fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={190} y={54} textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="system-ui">Internet</text>
            <text x={190} y={70} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="system-ui">not required</text>

            <motion.line x1={130} y1={108} x2={250} y2={108} stroke="#EF4444" strokeWidth="2.5"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} />
            <motion.text x={190} y={128} textAnchor="middle" fill="#EF4444" fontSize="10"
              fontFamily="system-ui" fontWeight="600"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55 }}>
              Disconnected
            </motion.text>

            <motion.rect x={90} y={148} width={200} height={56} rx={12} fill="#0052FF"
              initial={{ scale: 0.8, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.7 }}
              style={{ transformOrigin: "190px 176px" }}
            />
            <motion.text x={190} y={173} textAnchor="middle" fill="white" fontSize="14"
              fontFamily="system-ui" fontWeight="700"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}>
              LocalOS
            </motion.text>
            <motion.text x={190} y={190} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10"
              fontFamily="system-ui"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
              Fully local runtime
            </motion.text>

            <line x1={75} y1={228} x2={305} y2={228} stroke="rgba(0,82,255,0.2)" strokeWidth="1" />
            {[{ label: "AI Models", x: 75 }, { label: "Database", x: 190 }, { label: "File System", x: 305 }].map(({ label, x, }, i) => (
              <motion.g key={label} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 + i * 0.1 }}>
                <line x1={x} y1={228} x2={x} y2={244} stroke="rgba(0,82,255,0.35)" strokeWidth="1" strokeDasharray="3 2" />
                <rect x={x - 48} y={244} width={96} height={36} rx={8} fill="none" stroke="#0052FF" strokeWidth="1.5" />
                <text x={x} y={267} textAnchor="middle" fill="#0052FF" fontSize="11" fontFamily="system-ui" fontWeight="600">{label}</text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Offline Advantage ──────────────────────────────────────────────

function OfflineAdvantageSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#EFF6FF", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "#0A0F1C", letterSpacing: "-0.03em" }}>
            Cloud AI versus Local AI
          </h2>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: "white", border: "1px solid #E2E8F0" }}>
            <div className="text-sm font-semibold text-gray-400 mb-5 tracking-wide">CLOUD AI</div>
            <svg viewBox="0 0 300 240" className="w-full">
              <text x={150} y={28} textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="system-ui">Your Request</text>
              <rect x={100} y={36} width={100} height={34} rx={8} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <text x={150} y={58} textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui">Local Device</text>
              {[0, 1, 2].map((i) => (
                <motion.circle key={i} cx={150} cy={70} r="4" fill="#EF4444"
                  animate={inView ? { cy: [70, 120], opacity: [0.8, 0.3] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: "linear" }} />
              ))}
              <line x1={150} y1={70} x2={150} y2={118} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 3" />
              <ellipse cx={150} cy={132} rx={56} ry={26} fill="#FEF2F2" stroke="#FECACA" strokeWidth="1.5" />
              <text x={150} y={128} textAnchor="middle" fill="#EF4444" fontSize="11" fontFamily="system-ui">Cloud Server</text>
              <text x={150} y={143} textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="system-ui">third party</text>
              <line x1={150} y1={158} x2={150} y2={200} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 3" />
              <text x={150} y={195} textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="system-ui">Your data stored externally</text>
            </svg>
          </div>

          <div className="rounded-2xl p-6 md:p-8" style={{ background: "white", border: "2px solid #0052FF" }}>
            <div className="text-sm font-semibold tracking-wide mb-5" style={{ color: "#0052FF" }}>LOCALOS</div>
            <svg viewBox="0 0 300 240" className="w-full">
              <text x={150} y={28} textAnchor="middle" fill="#374151" fontSize="12" fontFamily="system-ui">Your Request</text>
              <rect x={70} y={36} width={160} height={165} rx={14} fill="rgba(0,82,255,0.04)" stroke="rgba(0,82,255,0.2)" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x={150} y={54} textAnchor="middle" fill="rgba(0,82,255,0.45)" fontSize="8" fontFamily="system-ui" fontWeight="700">YOUR MACHINE</text>
              <rect x={100} y={60} width={100} height={34} rx={8} fill="#EFF6FF" stroke="#0052FF" strokeWidth="1.5" />
              <text x={150} y={82} textAnchor="middle" fill="#0052FF" fontSize="11" fontFamily="system-ui" fontWeight="600">Local Device</text>
              {[0, 1].map((i) => (
                <motion.circle key={i} cx={150} cy={94} r="4" fill="#0052FF"
                  animate={inView ? { cy: [94, 138, 94], opacity: [0.8, 0.6, 0.8] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.7, ease: "linear" }} />
              ))}
              <line x1={150} y1={94} x2={150} y2={138} stroke="rgba(0,82,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
              <rect x={100} y={138} width={100} height={36} rx={8} fill="#0052FF" />
              <text x={150} y={161} textAnchor="middle" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="700">AI Model</text>
              <text x={150} y={215} textAnchor="middle" fill="#10B981" fontSize="10" fontFamily="system-ui" fontWeight="600">Data never leaves device</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: How It Works ───────────────────────────────────────────────────

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const steps = [
    { n: "01", title: "Install", desc: "LocalOS installs and configures the AI runtime automatically. No terminal commands, no config files." },
    { n: "02", title: "Download a Model", desc: "Pick from a catalog of open AI models. Downloaded and stored entirely on your machine." },
    { n: "03", title: "Initialize", desc: "The OS boots, creates your local database, sets up the file system, and verifies every component." },
    { n: "04", title: "Offline Ready", desc: "Disconnect from the internet. Chat, build, and create with no network from this point forward." },
  ];

  return (
    <section id="how-it-works" style={{ background: "#070D1F", padding: "80px 0" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>
            From install to offline in minutes.
          </h2>
        </Reveal>

        {/* Tree connector SVG: desktop only */}
        <div ref={ref} className="relative">
          <svg
            viewBox="0 0 900 60"
            className="hidden md:block w-full mb-0 -mb-px"
            style={{ overflow: "visible" }}
          >
            {/* horizontal trunk */}
            <motion.line x1={225} y1={30} x2={675} y2={30}
              stroke="rgba(0,82,255,0.35)" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }} />
            {/* four drops down to the cards */}
            {[225, 375, 525, 675].map((x, i) => (
              <motion.line key={x} x1={x} y1={30} x2={x} y2={60}
                stroke="rgba(0,82,255,0.35)" strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }} />
            ))}
            {/* dots at top of each drop */}
            {[225, 375, 525, 675].map((x, i) => (
              <motion.circle key={x + "d"} cx={x} cy={30} r={4} fill="#0052FF"
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={{ transformOrigin: `${x}px 30px` }} />
            ))}
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {steps.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.65 + i * 0.1 }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(0,82,255,0.07)", border: "1px solid rgba(0,82,255,0.18)" }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: "#0052FF", boxShadow: "0 0 14px rgba(0,82,255,0.5)" }}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "rgba(0,82,255,0.65)" }}>{step.n}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 5: AI Capabilities ────────────────────────────────────────────────

function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const outerNodes = [
    { label: "Websites", angle: 0 },
    { label: "Apps", angle: 45 },
    { label: "Documents", angle: 90 },
    { label: "Databases", angle: 135 },
    { label: "Agents", angle: 180 },
    { label: "Knowledge", angle: 225 },
    { label: "Design", angle: 270 },
    { label: "Code", angle: 315 },
  ];

  const cx = 220;
  const cy = 220;
  const R = 150;

  return (
    <section id="capabilities" style={{ background: "radial-gradient(ellipse at 50% 40%, #081535 0%, #040A18 70%)", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              One system. Every capability.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.48)" }}>
              LocalOS connects your local AI models to every workflow.
              Build websites, write apps, manage knowledge, run agents. All local, all private.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {outerNodes.map((n) => (
                <div key={n.label} className="text-sm py-2.5 px-3 rounded-lg" style={{ background: "rgba(0,82,255,0.08)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,82,255,0.14)" }}>
                  {n.label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref} className="flex justify-center">
          <svg viewBox="0 0 440 440" className="w-full max-w-xs md:max-w-sm">
            {outerNodes.map(({ label, angle }, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const nx = cx + R * Math.cos(rad);
              const ny = cy + R * Math.sin(rad);
              return (
                <motion.g key={label} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 + i * 0.08 }}>
                  <motion.line x1={cx} y1={cy} x2={nx} y2={ny} stroke="rgba(0,82,255,0.28)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.55, delay: 0.3 + i * 0.08 }} />
                  <motion.circle cx={nx} cy={ny} r="4" fill="#0052FF"
                    animate={{ r: [4, 5.5, 4] }} transition={{ duration: 2 + i * 0.2, repeat: Infinity }} />
                  <text x={cx + (R + 30) * Math.cos(rad)} y={cy + (R + 30) * Math.sin(rad)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="system-ui" fontWeight="500">
                    {label}
                  </text>
                </motion.g>
              );
            })}
            <motion.circle cx={cx} cy={cy} r={40} fill="#0052FF"
              animate={{ r: [40, 42, 40] }} transition={{ duration: 3, repeat: Infinity }} />
            <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="12" fontFamily="system-ui" fontWeight="800">LOCALOS</text>
            <text x={cx} y={cy + 11} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="system-ui">Core Engine</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Build Websites ─────────────────────────────────────────────────

function WebBuilderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const lines = [
    { text: "Creating project structure...", delay: 0.2, color: "rgba(255,255,255,0.38)" },
    { text: "index.html", delay: 0.5, color: "#6699FF" },
    { text: "styles.css", delay: 0.7, color: "#6699FF" },
    { text: "app.js", delay: 0.9, color: "#6699FF" },
    { text: "Generating components...", delay: 1.1, color: "rgba(255,255,255,0.38)" },
    { text: "HeroSection.tsx", delay: 1.3, color: "#34D399" },
    { text: "Navbar.tsx", delay: 1.5, color: "#34D399" },
    { text: "ContactForm.tsx", delay: 1.7, color: "#34D399" },
    { text: "Build complete. Ready.", delay: 2.0, color: "#0052FF" },
  ];

  return (
    <section style={{ background: "#080E1C", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div ref={ref} className="order-2 md:order-1">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              <span className="ml-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>localos generation</span>
            </div>
            <div className="p-5 font-mono text-xs space-y-1.5" style={{ minHeight: 260 }}>
              <div className="mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
                User: Build a fintech website
              </div>
              {lines.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: line.delay }} style={{ color: line.color }}>
                  {line.text}
                </motion.div>
              ))}
              <motion.div className="mt-3" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                style={{ color: "rgba(255,255,255,0.45)" }}>
                _
              </motion.div>
            </div>
          </div>
        </div>

        <Reveal direction="right" className="order-1 md:order-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              Describe it. Get it built.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.48)" }}>
              Tell LocalOS what you want to build. The AI generates the full project structure,
              writes the code, and delivers a working website without any cloud connection.
            </p>
            <div className="space-y-3">
              {[
                "Complete HTML, CSS, and JavaScript output",
                "React and Tailwind component generation",
                "Instant local preview with no deployment needed",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0052FF" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Section 7: Build Apps ─────────────────────────────────────────────────────

function AppBuilderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const nodes = [
    { label: "Frontend", x: 160, y: 55, color: "#0052FF" },
    { label: "API Layer", x: 160, y: 165, color: "#6366F1" },
    { label: "Backend", x: 80, y: 265, color: "#8B5CF6" },
    { label: "Database", x: 240, y: 265, color: "#06B6D4" },
  ];
  const edges = [[0, 1], [1, 2], [1, 3]];

  return (
    <section style={{ background: "#F8FAFC", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ color: "#0A0F1C", letterSpacing: "-0.03em" }}>
              Full-stack, fully local.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "#64748B" }}>
              LocalOS generates complete application architectures. From frontend to database,
              every layer is scaffolded, connected, and ready to run on your machine.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {["Frontend UI", "REST API", "SQL Database", "Auth System", "File Uploads", "Background Jobs"].map((item) => (
                <div key={item} className="py-2.5 px-4 rounded-xl text-sm font-medium" style={{ background: "#EFF6FF", color: "#0052FF" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref} className="flex items-center justify-center">
          <svg viewBox="0 0 320 340" className="w-full max-w-xs">
            {edges.map(([a, b], i) => (
              <motion.line key={i}
                x1={nodes[a].x} y1={nodes[a].y + 20} x2={nodes[b].x} y2={nodes[b].y - 20}
                stroke="#CBD5E1" strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.18 }} />
            ))}
            {nodes.map(({ label, x, y, color }, i) => (
              <motion.g key={label}
                initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.38, delay: i * 0.13 }}
                style={{ transformOrigin: `${x}px ${y}px` }}>
                <rect x={x - 58} y={y - 20} width={116} height={40} rx={10} fill={color} />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="700">{label}</text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Project System ─────────────────────────────────────────────────

function ProjectSystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const spokes = [
    { label: "Chats", angle: 0 },
    { label: "Files", angle: 60 },
    { label: "Assets", angle: 120 },
    { label: "Knowledge", angle: 180 },
    { label: "Tasks", angle: 240 },
    { label: "Builds", angle: 300 },
  ];

  return (
    <section style={{ background: "#0052FF", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div ref={ref} className="flex justify-center order-2 md:order-1">
          <svg viewBox="0 0 380 380" className="w-full max-w-xs md:max-w-sm">
            {spokes.map(({ label, angle }, i) => {
              const rad = angle * (Math.PI / 180) - Math.PI / 2;
              const r = 130;
              const nx = 190 + r * Math.cos(rad);
              const ny = 190 + r * Math.sin(rad);
              return (
                <motion.g key={label} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.1 }}>
                  <motion.line x1={190} y1={190} x2={nx} y2={ny} stroke="rgba(255,255,255,0.22)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} />
                  <circle cx={nx} cy={ny} r={26} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
                  <text x={nx} y={ny + 5} textAnchor="middle" fill="white" fontSize="10" fontFamily="system-ui" fontWeight="600">{label}</text>
                </motion.g>
              );
            })}
            <motion.circle cx={190} cy={190} r={48} fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.45)" strokeWidth={2}
              initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.45 }}
              style={{ transformOrigin: "190px 190px" }} />
            <text x={190} y={186} textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="800">Project</text>
            <text x={190} y={203} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="system-ui">Hub</text>
          </svg>
        </div>

        <Reveal direction="right" className="order-1 md:order-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              Every project, everything connected.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.58)" }}>
              LocalOS organizes all your work into Projects. Each project keeps its chats,
              files, knowledge, and builds together. Persistent, searchable, always local.
            </p>
            <div className="space-y-4">
              {[
                ["Persistent context", "Every chat and file stays linked to its project"],
                ["Knowledge indexing", "Documents are embedded and searchable within each project"],
                ["Build history", "Track every version and generation output locally"],
              ].map(([title, desc]) => (
                <div key={title}>
                  <div className="font-semibold text-white text-sm mb-0.5">{title}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.52)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Section 9: Knowledge Base ─────────────────────────────────────────────────

function KnowledgeBaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#FFFFFF", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ color: "#0A0F1C", letterSpacing: "-0.03em" }}>
              Your documents, searchable by AI.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "#64748B" }}>
              Drop any document into LocalOS. It gets indexed locally, embedded by your AI model,
              and becomes instantly searchable with answers drawn from your own content.
            </p>
            <div className="space-y-3">
              {[
                "PDF, Markdown, and text file ingestion",
                "Local vector embeddings with no external API",
                "Semantic search across all your documents",
                "AI answers grounded in your own knowledge",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#0052FF" }} />
                  <span className="text-sm" style={{ color: "#64748B" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref}>
          <svg viewBox="0 0 360 320" className="w-full max-w-sm mx-auto">
            {[0, 1, 2].map((i) => (
              <motion.g key={i}
                initial={{ x: -50 + i * 15, opacity: 0 }}
                animate={inView ? { x: 50, opacity: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.18 }}>
                <rect x={0} y={25 + i * 22} width={86} height={18} rx={5} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
                <text x={8} y={38 + i * 22} fill="#0052FF" fontSize="9" fontFamily="system-ui" fontWeight="500">
                  {["report.pdf", "notes.md", "data.txt"][i]}
                </text>
              </motion.g>
            ))}
            <motion.rect x={120} y={46} width={116} height={84} rx={12} fill="#0052FF"
              initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.75 }} style={{ transformOrigin: "178px 88px" }} />
            <motion.text x={178} y={84} textAnchor="middle" fill="white" fontSize="12"
              fontFamily="system-ui" fontWeight="700"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.92 }}>
              Index
            </motion.text>
            <motion.text x={178} y={100} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="9"
              fontFamily="system-ui"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.02 }}>
              Local embeddings
            </motion.text>
            <motion.rect x={40} y={185} width={270} height={38} rx={10}
              fill="#F8FAFC" stroke="#0052FF" strokeWidth="1.5"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.15 }} />
            <motion.text x={175} y={209} textAnchor="middle" fill="#0052FF" fontSize="10"
              fontFamily="system-ui"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.25 }}>
              What does the report say about Q3?
            </motion.text>
            <motion.rect x={40} y={242} width={270} height={56} rx={10}
              fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"
              initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.45 }} />
            <motion.text x={58} y={262} fill="#0A0F1C" fontSize="9" fontFamily="system-ui" fontWeight="600"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.55 }}>
              Answer based on report.pdf:
            </motion.text>
            <motion.text x={58} y={278} fill="#64748B" fontSize="9" fontFamily="system-ui"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.65 }}>
              Revenue grew 24% driven by enterprise sales...
            </motion.text>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 10: Local Models ──────────────────────────────────────────────────

function LocalModelsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const layers = [
    { label: "Runtime", color: "#0A1A40", border: "rgba(0,82,255,0.25)" },
    { label: "Embedding", color: "#0D2060", border: "rgba(0,82,255,0.38)" },
    { label: "Vision", color: "#0F3080", border: "rgba(0,82,255,0.5)" },
    { label: "Coding", color: "#1040A0", border: "#0052FF" },
    { label: "Reasoning", color: "#0052FF", border: "#4488FF" },
  ];

  return (
    <section id="models" style={{ background: "#040912", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div ref={ref} className="flex items-center justify-center order-2 md:order-1">
          <div className="relative" style={{ width: 300, height: 340 }}>
            {layers.map((layer, i) => (
              <motion.div key={layer.label} className="absolute rounded-2xl flex items-center justify-center"
                style={{
                  width: 300 - i * 22,
                  height: 56,
                  top: (layers.length - 1 - i) * 66,
                  left: i * 11,
                  background: layer.color,
                  border: `1px solid ${layer.border}`,
                  boxShadow: i === layers.length - 1 ? "0 0 36px rgba(0,82,255,0.38)" : "none",
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}>
                <span className="text-sm font-bold text-white">{layer.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <Reveal direction="right" className="order-1 md:order-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              Every model type, running locally.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.48)" }}>
              LocalOS supports the full spectrum of open AI models. From lightweight reasoning models
              to code specialists and vision models, all running entirely on your hardware.
            </p>
            <div className="space-y-4">
              {[
                ["Reasoning", "General-purpose chat and analysis"],
                ["Coding", "Specialized for code generation and review"],
                ["Vision", "Understands images and documents"],
                ["Embedding", "Powers semantic search and knowledge retrieval"],
              ].map(([title, desc]) => (
                <div key={title}>
                  <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Section 11: Security ──────────────────────────────────────────────────────

function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#000000", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              Your data never moves.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.48)" }}>
              LocalOS has no server to breach. There are no API endpoints transmitting your data,
              no third-party services processing your prompts, no cloud storing your results.
            </p>
            <div className="space-y-5">
              {[
                ["No network calls", "AI inference runs entirely in-process on your machine"],
                ["No accounts required", "LocalOS works with no login, no email, no user profile"],
                ["No telemetry", "Zero usage data is collected or transmitted"],
                ["Air-gap compatible", "Operates in fully disconnected secure environments"],
              ].map(([title, desc]) => (
                <div key={title}>
                  <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref} className="flex items-center justify-center">
          <svg viewBox="0 0 320 320" className="w-full max-w-xs">
            <motion.rect x={110} y={120} width={100} height={80} rx={8}
              fill="#111" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} />
            <motion.text x={160} y={163} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10"
              fontFamily="system-ui"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
              LocalOS
            </motion.text>
            {[1, 2, 3].map((ring) => (
              <motion.circle key={ring} cx={160} cy={160} r={ring * 32}
                fill="none" stroke={`rgba(0,82,255,${0.38 - ring * 0.1})`} strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.55 + ring * 0.14 }}
                style={{ transformOrigin: "160px 160px" }} />
            ))}
            {[30, 90, 150, 210, 270, 330].map((angle, i) => {
              const rad = angle * (Math.PI / 180);
              const sx = 160 + 128 * Math.cos(rad);
              const sy = 160 + 128 * Math.sin(rad);
              const ex = 160 + 86 * Math.cos(rad);
              const ey = 160 + 86 * Math.sin(rad);
              return (
                <motion.g key={angle}
                  initial={{ opacity: 0 }} animate={inView ? { opacity: [0, 0.9, 0] } : {}}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 1.2 + i * 0.22 }}>
                  <circle cx={sx} cy={sy} r={4} fill="#EF4444" opacity={0.7} />
                  <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" opacity={0.35} />
                </motion.g>
              );
            })}
            <motion.text x={160} y={308} textAnchor="middle" fill="rgba(0,82,255,0.75)" fontSize="10"
              fontFamily="system-ui" fontWeight="600"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
              All external data access blocked
            </motion.text>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 12: Performance ───────────────────────────────────────────────────

function PerformanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#FFFFFF", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "#0A0F1C", letterSpacing: "-0.03em" }}>
            Numbers that matter.
          </h2>
        </Reveal>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[
            { label: "Latency", value: "Zero", sub: "No network round-trips" },
            { label: "External Storage", value: "None", sub: "Zero external storage" },
            { label: "Monthly Cost", value: "$0", sub: "No subscriptions" },
            { label: "Data Ownership", value: "100%", sub: "You own everything" },
          ].map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="text-center p-5 md:p-8 rounded-2xl"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#0052FF", letterSpacing: "-0.04em" }}>{m.value}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-900 mb-1">{m.label}</div>
              <div className="text-xs text-gray-400">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-5 max-w-2xl mx-auto">
          {[
            { label: "Local Inference Speed", pct: 92, note: "Hardware dependent" },
            { label: "Offline Availability", pct: 100, note: "Always available" },
            { label: "Data Sovereignty", pct: 100, note: "You own everything" },
          ].map((bar, i) => (
            <Reveal key={bar.label} delay={i * 0.1}>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{bar.label}</span>
                  <span style={{ color: "#0052FF" }}>{bar.note}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#EFF6FF" }}>
                  <motion.div className="h-2 rounded-full" style={{ background: "#0052FF" }}
                    initial={{ width: 0 }} animate={inView ? { width: `${bar.pct}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 13: Enterprise ────────────────────────────────────────────────────

function EnterpriseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const machines = [
    { x: 80, y: 100, label: "Workstation" },
    { x: 200, y: 58, label: "Server" },
    { x: 320, y: 100, label: "Laptop" },
    { x: 80, y: 215, label: "Dev Machine" },
    { x: 200, y: 196, label: "Knowledge Server" },
    { x: 320, y: 215, label: "Laptop" },
  ];
  const edges = [[0, 1], [1, 2], [0, 4], [1, 4], [2, 4], [3, 4], [4, 5]];

  return (
    <section style={{ background: "#060D20", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              Built for air-gapped environments.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.48)" }}>
              LocalOS is designed for organizations that cannot send data to the cloud.
              Run across your internal network with no external dependencies.
            </p>
            <div className="space-y-4">
              {[
                ["Air-gap compliant", "Fully operational with no internet connection"],
                ["Multi-machine support", "Deploy across your internal network"],
                ["Shared knowledge base", "Teams share documents and context locally"],
                ["No vendor dependency", "Open runtime, open models, fully owned"],
              ].map(([title, desc]) => (
                <div key={title}>
                  <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div ref={ref}>
          <svg viewBox="0 0 400 300" className="w-full max-w-sm md:max-w-md mx-auto">
            <rect x={18} y={18} width={364} height={264} rx={14} fill="none" stroke="rgba(0,82,255,0.18)" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x={200} y={36} textAnchor="middle" fill="rgba(0,82,255,0.45)" fontSize="8" fontFamily="system-ui" fontWeight="700">INTERNAL NETWORK  AIR GAPPED</text>
            {edges.map(([a, b], i) => (
              <motion.line key={i}
                x1={machines[a].x} y1={machines[a].y} x2={machines[b].x} y2={machines[b].y}
                stroke="rgba(0,82,255,0.28)" strokeWidth="1"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.08 }} />
            ))}
            {machines.map(({ x, y, label }, i) => (
              <motion.g key={label + i}
                initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{ transformOrigin: `${x}px ${y}px` }}>
                <rect x={x - 38} y={y - 18} width={76} height={36} rx={8}
                  fill={label === "Knowledge Server" ? "#0052FF" : "rgba(0,82,255,0.1)"}
                  stroke={label === "Knowledge Server" ? "#0052FF" : "rgba(0,82,255,0.28)"}
                  strokeWidth="1" />
                <text x={x} y={y + 5} textAnchor="middle"
                  fill={label === "Knowledge Server" ? "white" : "rgba(255,255,255,0.65)"}
                  fontSize="8" fontFamily="system-ui" fontWeight={label === "Knowledge Server" ? "700" : "400"}>
                  {label}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Section 14: Open Architecture ────────────────────────────────────────────

function OpenArchSection() {
  return (
    <section style={{ background: "linear-gradient(155deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <Reveal className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ color: "#0A0F1C", letterSpacing: "-0.03em" }}>
            Built to be extended.
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "#64748B" }}>
            LocalOS is an open platform. Swap models, add tools, connect agents, build plugins.
            Everything is composable and runs on your machine.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { category: "Models", items: ["Llama", "Mistral", "Phi", "Gemma", "DeepSeek"] },
            { category: "Tools", items: ["Code Runner", "Web Builder", "File Manager", "Search", "Agents"] },
            { category: "Integrations", items: ["SQLite", "PostgreSQL", "Git", "REST APIs", "Custom Plugins"] },
          ].map(({ category, items }, i) => (
            <Reveal key={category} delay={i * 0.1}>
              <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #BFDBFE" }}>
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "#0052FF" }}>{category}</div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item} className="text-sm text-gray-700 py-1.5 px-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 15: Final CTA ─────────────────────────────────────────────────────

function FinalCTASection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: "150vh", background: "linear-gradient(175deg, #001A6E 0%, #0052FF 55%, #003AB3 100%)" }}>
      <ParticleCanvas color="#4488ff" count={90} />
      <div className="relative z-10 text-center max-w-3xl mx-auto px-5 md:px-10">
        <Reveal>
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-5"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            Own your AI.
          </h2>
          <p className="text-lg md:text-xl mb-4 font-medium" style={{ color: "rgba(255,255,255,0.68)" }}>
            No Cloud. No Tracking. No Subscription.
          </p>
          <p className="text-sm md:text-base mb-12" style={{ color: "rgba(255,255,255,0.38)" }}>
            Everything runs on your hardware, under your control, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation("/app")}
              data-testid="cta-enter-btn"
              className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all"
              style={{ background: "rgba(255,255,255,0.14)", border: "2px solid rgba(255,255,255,0.38)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            >
              Open LocalOS
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-base transition-all"
              style={{ background: "rgba(0,0,0,0.18)", border: "2px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.58)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.32)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
              onClick={() => setLocation("/docs")}
            >
              Documentation
            </button>
          </div>
        </Reveal>
      </div>
      {/* Fade overlay: blends bottom of CTA into footer seamlessly */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "30vh",
          background: "linear-gradient(to bottom, transparent 0%, #060810 100%)",
          zIndex: 20,
        }}
      />
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Footer() {
  const columns = [
    {
      heading: "PRODUCT",
      links: [
        { label: "Features", href: "/features" },
        { label: "Models", href: "/models" },
        { label: "Knowledge Base", href: "/knowledge-base" },
        { label: "Settings", href: "/settings" },
      ],
    },
    {
      heading: "RESOURCES",
      links: [
        { label: "Documentation", href: "https://localos.xyz/docs" },
        { label: "GitHub", href: "https://github.com/localos-dev" },
        { label: "Community", href: "/community" },
      ],
    },
    {
      heading: "COMPANY",
      links: [
        { label: "About", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer style={{ background: "#060810" }}>
      <div
        className="max-w-7xl mx-auto px-5 md:px-10"
        style={{ paddingTop: 72, paddingBottom: 48 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LocalOS" className="w-8 h-8 object-contain flex-shrink-0" />
              <span className="font-semibold text-white tracking-tight">LocalOS</span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
              A self-hosted AI operating system. Runs entirely on your machine. No cloud required.
            </p>

            <div className="flex gap-3">
              {[
                { icon: <IconX />, label: "X" },
                { icon: <IconLinkedIn />, label: "LinkedIn" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-6">
            {columns.map(({ heading, links }) => (
              <div key={heading}>
                <div
                  className="text-xs font-bold tracking-widest mb-5"
                  style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}
                >
                  {heading}
                </div>
                <ul className="space-y-3.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "white")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)")}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-16 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
            2025 LocalOS. All rights reserved.
          </span>
          <div className="flex gap-6">
            {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Use", href: "/terms" }].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.28)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.28)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="text-white overflow-x-hidden">
      <SiteNavbar transparent />
      <HeroSection />
      <ModelLogosStrip />
      <LocalFirstSection />
      <OfflineAdvantageSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <WebBuilderSection />
      <AppBuilderSection />
      <ProjectSystemSection />
      <KnowledgeBaseSection />
      <LocalModelsSection />
      <SecuritySection />
      <PerformanceSection />
      <EnterpriseSection />
      <OpenArchSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
