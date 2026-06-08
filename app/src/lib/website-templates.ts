// 30 website templates = 6 layouts × 5 themes
// All self-contained HTML/CSS, no external dependencies

export interface TemplateVars {
  title: string;
  tagline: string;
  description: string;
  primaryColor: string;
  ctaText: string;
  f1Title: string; f1Desc: string;
  f2Title: string; f2Desc: string;
  f3Title: string; f3Desc: string;
}

interface Theme {
  name: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  radius: string;
  headingStyle: string;
}

const THEMES: Theme[] = [
  {
    name: "midnight",
    bg: "linear-gradient(135deg,#050d1f 0%,#0a1a3a 50%,#050d1f 100%)",
    surface: "rgba(255,255,255,0.05)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.55)",
    accent: "{{PRIMARY_COLOR}}",
    accentText: "#ffffff",
    border: "rgba(255,255,255,0.1)",
    radius: "12px",
    headingStyle: "font-weight:800;letter-spacing:-0.03em",
  },
  {
    name: "clean",
    bg: "#ffffff",
    surface: "#f8f9fb",
    text: "#0a0a0a",
    muted: "#6b7280",
    accent: "{{PRIMARY_COLOR}}",
    accentText: "#ffffff",
    border: "#e5e7eb",
    radius: "10px",
    headingStyle: "font-weight:800;letter-spacing:-0.02em",
  },
  {
    name: "vibrant",
    bg: "linear-gradient(135deg,{{PRIMARY_COLOR}} 0%,#6366f1 100%)",
    surface: "rgba(255,255,255,0.12)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    accent: "#ffffff",
    accentText: "{{PRIMARY_COLOR}}",
    border: "rgba(255,255,255,0.2)",
    radius: "14px",
    headingStyle: "font-weight:900;letter-spacing:-0.04em",
  },
  {
    name: "warm",
    bg: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 100%)",
    surface: "#ffffff",
    text: "#1c1917",
    muted: "#78716c",
    accent: "{{PRIMARY_COLOR}}",
    accentText: "#ffffff",
    border: "#fed7aa",
    radius: "10px",
    headingStyle: "font-weight:800;letter-spacing:-0.02em",
  },
  {
    name: "forest",
    bg: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
    surface: "rgba(255,255,255,0.06)",
    text: "#f1f5f9",
    muted: "#94a3b8",
    accent: "{{PRIMARY_COLOR}}",
    accentText: "#ffffff",
    border: "rgba(255,255,255,0.08)",
    radius: "8px",
    headingStyle: "font-weight:700;letter-spacing:-0.01em",
  },
];

// ── Layout 1: Centered Hero + Card Grid ──────────────────────────────────────

const LAYOUT_CENTERED = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:{{BG}};color:{{TEXT}};min-height:100vh}
nav{display:flex;align-items:center;justify-content:space-between;padding:20px 48px;border-bottom:1px solid {{BORDER}}}
.logo{font-size:18px;font-weight:700;color:{{TEXT}}}
.nav-cta{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:10px 22px;border-radius:{{RADIUS}};font-size:14px;font-weight:600;cursor:pointer}
.hero{text-align:center;padding:100px 48px 80px;max-width:800px;margin:0 auto}
.hero h1{font-size:clamp(40px,6vw,72px);{{HEADING_STYLE}};line-height:1.05;margin-bottom:20px;color:{{TEXT}}}
.hero p.tagline{font-size:20px;color:{{MUTED}};margin-bottom:12px;font-weight:500}
.hero p.desc{font-size:16px;color:{{MUTED}};line-height:1.7;margin-bottom:36px;max-width:560px;margin-left:auto;margin-right:auto}
.hero-cta{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:16px 40px;border-radius:{{RADIUS}};font-size:16px;font-weight:700;cursor:pointer;display:inline-block}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto;padding:0 48px 80px}
.card{background:{{SURFACE}};border:1px solid {{BORDER}};border-radius:{{RADIUS}};padding:32px;text-align:left}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;color:{{TEXT}}}
.card p{font-size:14px;color:{{MUTED}};line-height:1.6}
.card-icon{width:44px;height:44px;background:{{ACCENT}};border-radius:10px;margin-bottom:18px;opacity:0.9}
footer{text-align:center;padding:32px;color:{{MUTED}};font-size:13px;border-top:1px solid {{BORDER}}}
@media(max-width:768px){.cards{grid-template-columns:1fr}.hero{padding:60px 24px}.nav{padding:16px 24px}}</style></head>
<body>
<nav><span class="logo">{{TITLE}}</span><button class="nav-cta">{{CTA}}</button></nav>
<div class="hero">
  <p class="tagline">{{TAGLINE}}</p>
  <h1>{{TITLE}}</h1>
  <p class="desc">{{DESCRIPTION}}</p>
  <button class="hero-cta">{{CTA}}</button>
</div>
<div class="cards">
  <div class="card"><div class="card-icon"></div><h3>{{F1T}}</h3><p>{{F1D}}</p></div>
  <div class="card"><div class="card-icon"></div><h3>{{F2T}}</h3><p>{{F2D}}</p></div>
  <div class="card"><div class="card-icon"></div><h3>{{F3T}}</h3><p>{{F3D}}</p></div>
</div>
<footer>&copy; 2025 {{TITLE}}. All rights reserved.</footer>
</body></html>`;

// ── Layout 2: Split Hero ──────────────────────────────────────────────────────

const LAYOUT_SPLIT = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:{{BG}};color:{{TEXT}};min-height:100vh}
nav{display:flex;align-items:center;justify-content:space-between;padding:20px 60px;border-bottom:1px solid {{BORDER}}}
.logo{font-size:18px;font-weight:700}.nav-links{display:flex;gap:28px;font-size:14px;color:{{MUTED}};list-style:none}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1200px;margin:0 auto;padding:80px 60px}
.hero-left h1{font-size:clamp(32px,4.5vw,58px);{{HEADING_STYLE}};line-height:1.1;margin-bottom:16px}
.hero-left .tag{display:inline-block;background:{{SURFACE}};border:1px solid {{BORDER}};border-left:3px solid {{ACCENT}};padding:6px 14px;font-size:13px;color:{{MUTED}};border-radius:4px;margin-bottom:20px}
.hero-left p{font-size:17px;color:{{MUTED}};line-height:1.7;margin-bottom:32px}
.btns{display:flex;gap:14px}.btn-p{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:14px 32px;border-radius:{{RADIUS}};font-weight:600;font-size:15px;cursor:pointer}
.btn-s{background:transparent;color:{{TEXT}};border:1px solid {{BORDER}};padding:14px 28px;border-radius:{{RADIUS}};font-weight:500;font-size:15px;cursor:pointer}
.hero-right{background:{{SURFACE}};border:1px solid {{BORDER}};border-radius:20px;padding:40px;min-height:360px;display:flex;flex-direction:column;gap:20px}
.stat{padding:20px;background:{{BG}};border:1px solid {{BORDER}};border-radius:12px}
.stat .num{font-size:32px;font-weight:800;color:{{ACCENT}};margin-bottom:4px}.stat .lbl{font-size:13px;color:{{MUTED}}}
.features{display:flex;flex-direction:column;gap:0;border-top:1px solid {{BORDER}};margin-top:60px}
.feature{display:grid;grid-template-columns:60px 1fr;gap:24px;padding:32px 60px;border-bottom:1px solid {{BORDER}};align-items:start}
.feature-num{font-size:36px;font-weight:900;color:{{ACCENT}};opacity:0.3}.feature h3{font-size:18px;font-weight:700;margin-bottom:8px}
.feature p{font-size:14px;color:{{MUTED}};line-height:1.6}
footer{text-align:center;padding:32px;color:{{MUTED}};font-size:13px;border-top:1px solid {{BORDER}}}
@media(max-width:768px){.hero{grid-template-columns:1fr;padding:40px 24px}.nav{padding:16px 24px}.feature{padding:24px}.btns{flex-direction:column}}</style></head>
<body>
<nav><span class="logo">{{TITLE}}</span><ul class="nav-links"><li>Features</li><li>About</li><li>Contact</li></ul></nav>
<div class="hero">
  <div class="hero-left">
    <div class="tag">{{TAGLINE}}</div>
    <h1>{{TITLE}}</h1>
    <p>{{DESCRIPTION}}</p>
    <div class="btns"><button class="btn-p">{{CTA}}</button><button class="btn-s">Learn More</button></div>
  </div>
  <div class="hero-right">
    <div class="stat"><div class="num">01</div><div class="lbl">{{F1T}}</div></div>
    <div class="stat"><div class="num">02</div><div class="lbl">{{F2T}}</div></div>
    <div class="stat"><div class="num">03</div><div class="lbl">{{F3T}}</div></div>
  </div>
</div>
<div class="features">
  <div class="feature"><div class="feature-num">01</div><div><h3>{{F1T}}</h3><p>{{F1D}}</p></div></div>
  <div class="feature"><div class="feature-num">02</div><div><h3>{{F2T}}</h3><p>{{F2D}}</p></div></div>
  <div class="feature"><div class="feature-num">03</div><div><h3>{{F3T}}</h3><p>{{F3D}}</p></div></div>
</div>
<footer>&copy; 2025 {{TITLE}}</footer>
</body></html>`;

// ── Layout 3: Dark Neon Glow ──────────────────────────────────────────────────

const LAYOUT_DARK_NEON = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:#050914;color:#fff;min-height:100vh;overflow-x:hidden}
.glow{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(circle,{{PRIMARY_COLOR}}22 0%,transparent 70%);pointer-events:none}
nav{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:20px 60px;border-bottom:1px solid rgba(255,255,255,0.06)}
.logo{font-size:17px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase}
.nav-cta{background:{{PRIMARY_COLOR}};color:#fff;border:none;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:0.05em}
.hero{position:relative;z-index:5;text-align:center;padding:120px 48px 100px;max-width:900px;margin:0 auto}
.badge{display:inline-block;border:1px solid {{PRIMARY_COLOR}}55;color:{{PRIMARY_COLOR}};padding:6px 16px;border-radius:100px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px}
.hero h1{font-size:clamp(44px,7vw,88px);font-weight:900;letter-spacing:-0.04em;line-height:0.95;margin-bottom:28px;background:linear-gradient(180deg,#fff 50%,rgba(255,255,255,0.4));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:18px;color:rgba(255,255,255,0.5);line-height:1.7;margin-bottom:40px;max-width:560px;margin-left:auto;margin-right:auto}
.hero-cta{background:{{PRIMARY_COLOR}};color:#fff;border:none;padding:18px 48px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 0 40px {{PRIMARY_COLOR}}55}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);max-width:900px;margin:0 auto 80px}
.cell{background:#050914;padding:40px 32px}
.cell .icon{width:40px;height:40px;border:1px solid {{PRIMARY_COLOR}}44;border-radius:10px;margin-bottom:20px;display:flex;align-items:center;justify-content:center}
.cell .dot{width:12px;height:12px;background:{{PRIMARY_COLOR}};border-radius:50%}
.cell h3{font-size:16px;font-weight:700;margin-bottom:10px;color:#fff}
.cell p{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7}
footer{text-align:center;padding:32px;color:rgba(255,255,255,0.2);font-size:12px;letter-spacing:0.05em}
@media(max-width:768px){.grid{grid-template-columns:1fr}.nav{padding:16px 24px}}</style></head>
<body>
<div class="glow"></div>
<nav><span class="logo">{{TITLE}}</span><button class="nav-cta">{{CTA}}</button></nav>
<div class="hero">
  <div class="badge">{{TAGLINE}}</div>
  <h1>{{TITLE}}</h1>
  <p>{{DESCRIPTION}}</p>
  <button class="hero-cta">{{CTA}}</button>
</div>
<div class="grid">
  <div class="cell"><div class="icon"><div class="dot"></div></div><h3>{{F1T}}</h3><p>{{F1D}}</p></div>
  <div class="cell"><div class="icon"><div class="dot"></div></div><h3>{{F2T}}</h3><p>{{F2D}}</p></div>
  <div class="cell"><div class="icon"><div class="dot"></div></div><h3>{{F3T}}</h3><p>{{F3D}}</p></div>
</div>
<footer>{{TITLE}} &mdash; ALL RIGHTS RESERVED &copy; 2025</footer>
</body></html>`;

// ── Layout 4: Bold Statement / Big Typography ─────────────────────────────────

const LAYOUT_BOLD = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:{{BG}};color:{{TEXT}};min-height:100vh}
nav{display:flex;align-items:center;justify-content:space-between;padding:24px 64px;border-bottom:1px solid {{BORDER}}}
.logo{font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em}
.nav-r{display:flex;align-items:center;gap:24px;font-size:14px;color:{{MUTED}}}
.nav-cta{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:10px 20px;border-radius:{{RADIUS}};font-weight:700;font-size:13px;cursor:pointer}
.hero{padding:80px 64px;max-width:1200px;margin:0 auto;border-bottom:1px solid {{BORDER}}}
.hero-label{font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:{{ACCENT}};margin-bottom:20px}
.hero h1{font-size:clamp(52px,8vw,120px);font-weight:900;letter-spacing:-0.04em;line-height:0.9;margin-bottom:40px}
.hero-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.hero-desc p{font-size:17px;color:{{MUTED}};line-height:1.7;max-width:440px;margin-bottom:28px}
.hero-cta{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:16px 40px;border-radius:{{RADIUS}};font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap}
.features{display:grid;grid-template-columns:repeat(3,1fr);max-width:1200px;margin:0 auto}
.feat{padding:48px 64px;border-right:1px solid {{BORDER}}}
.feat:last-child{border-right:none}
.feat-num{font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:{{MUTED}};margin-bottom:16px}
.feat h3{font-size:22px;font-weight:800;margin-bottom:12px;letter-spacing:-0.01em}
.feat p{font-size:14px;color:{{MUTED}};line-height:1.7}
footer{padding:32px 64px;border-top:1px solid {{BORDER}};display:flex;justify-content:space-between;align-items:center;font-size:13px;color:{{MUTED}}}
@media(max-width:768px){nav,footer,hero,feat{padding-left:24px;padding-right:24px}.features{grid-template-columns:1fr}.hero-bottom{flex-direction:column}}</style></head>
<body>
<nav><span class="logo">{{TITLE}}</span><div class="nav-r"><span>Features</span><span>About</span><button class="nav-cta">{{CTA}}</button></div></nav>
<div class="hero">
  <div class="hero-label">{{TAGLINE}}</div>
  <h1>{{TITLE}}</h1>
  <div class="hero-bottom">
    <div class="hero-desc"><p>{{DESCRIPTION}}</p><button class="hero-cta">{{CTA}}</button></div>
  </div>
</div>
<div class="features">
  <div class="feat"><div class="feat-num">01 / {{F1T}}</div><h3>{{F1T}}</h3><p>{{F1D}}</p></div>
  <div class="feat"><div class="feat-num">02 / {{F2T}}</div><h3>{{F2T}}</h3><p>{{F2D}}</p></div>
  <div class="feat"><div class="feat-num">03 / {{F3T}}</div><h3>{{F3T}}</h3><p>{{F3D}}</p></div>
</div>
<footer><span>&copy; 2025 {{TITLE}}</span><span>{{TAGLINE}}</span></footer>
</body></html>`;

// ── Layout 5: Modern SaaS Multi-Section ──────────────────────────────────────

const LAYOUT_SAAS = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:{{BG}};color:{{TEXT}}}
nav{display:flex;align-items:center;justify-content:space-between;padding:18px 60px;position:sticky;top:0;background:{{BG}};border-bottom:1px solid {{BORDER}};z-index:100}
.logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px}
.logo-dot{width:28px;height:28px;background:{{ACCENT}};border-radius:8px}
.nav-links{display:flex;gap:32px;font-size:14px;color:{{MUTED}};list-style:none}
.nav-cta{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:10px 22px;border-radius:{{RADIUS}};font-size:14px;font-weight:600;cursor:pointer}
.hero{text-align:center;padding:100px 60px 80px;border-bottom:1px solid {{BORDER}}}
.pill{display:inline-flex;align-items:center;gap:8px;background:{{SURFACE}};border:1px solid {{BORDER}};border-radius:100px;padding:6px 14px;font-size:13px;color:{{MUTED}};margin-bottom:24px}
.pill-dot{width:6px;height:6px;background:{{ACCENT}};border-radius:50%}
.hero h1{font-size:clamp(36px,5.5vw,68px);{{HEADING_STYLE}};line-height:1.08;margin-bottom:20px;max-width:800px;margin-left:auto;margin-right:auto}
.hero p{font-size:18px;color:{{MUTED}};line-height:1.7;max-width:560px;margin:0 auto 36px}
.hero-btns{display:flex;gap:14px;justify-content:center}
.btn-p{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:14px 36px;border-radius:{{RADIUS}};font-weight:700;font-size:15px;cursor:pointer}
.btn-s{background:{{SURFACE}};color:{{TEXT}};border:1px solid {{BORDER}};padding:14px 28px;border-radius:{{RADIUS}};font-weight:500;font-size:15px;cursor:pointer}
.features{max-width:1100px;margin:0 auto;padding:80px 60px}
.features h2{font-size:clamp(28px,3.5vw,42px);{{HEADING_STYLE}};margin-bottom:14px;text-align:center}
.features .sub{text-align:center;color:{{MUTED}};font-size:16px;margin-bottom:60px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.feat-card{background:{{SURFACE}};border:1px solid {{BORDER}};border-radius:{{RADIUS}};padding:36px;transition:transform .2s}
.feat-card:hover{transform:translateY(-4px)}
.feat-icon{width:48px;height:48px;background:{{ACCENT}}18;border-radius:12px;margin-bottom:20px;display:flex;align-items:center;justify-content:center}
.feat-icon-inner{width:20px;height:20px;background:{{ACCENT}};border-radius:5px}
.feat-card h3{font-size:17px;font-weight:700;margin-bottom:10px}
.feat-card p{font-size:14px;color:{{MUTED}};line-height:1.65}
.cta-section{background:{{ACCENT}};padding:80px 60px;text-align:center}
.cta-section h2{font-size:clamp(28px,4vw,48px);font-weight:900;color:{{ACCENT_TEXT}};margin-bottom:16px;letter-spacing:-0.02em}
.cta-section p{font-size:17px;color:{{ACCENT_TEXT}};opacity:0.8;margin-bottom:36px}
.cta-btn{background:{{ACCENT_TEXT}};color:{{ACCENT}};border:none;padding:16px 48px;border-radius:{{RADIUS}};font-size:16px;font-weight:700;cursor:pointer}
footer{text-align:center;padding:32px;color:{{MUTED}};font-size:13px;border-top:1px solid {{BORDER}}}
@media(max-width:768px){.feat-grid{grid-template-columns:1fr}nav{padding:16px 24px}.hero,.features{padding-left:24px;padding-right:24px}.hero-btns{flex-direction:column;align-items:center}}</style></head>
<body>
<nav>
  <div class="logo"><div class="logo-dot"></div>{{TITLE}}</div>
  <ul class="nav-links"><li>Features</li><li>Pricing</li><li>Docs</li></ul>
  <button class="nav-cta">{{CTA}}</button>
</nav>
<div class="hero">
  <div class="pill"><div class="pill-dot"></div>{{TAGLINE}}</div>
  <h1>{{TITLE}}</h1>
  <p>{{DESCRIPTION}}</p>
  <div class="hero-btns"><button class="btn-p">{{CTA}}</button><button class="btn-s">See How It Works</button></div>
</div>
<div class="features">
  <h2>Everything you need</h2>
  <p class="sub">Built to deliver results from day one</p>
  <div class="feat-grid">
    <div class="feat-card"><div class="feat-icon"><div class="feat-icon-inner"></div></div><h3>{{F1T}}</h3><p>{{F1D}}</p></div>
    <div class="feat-card"><div class="feat-icon"><div class="feat-icon-inner"></div></div><h3>{{F2T}}</h3><p>{{F2D}}</p></div>
    <div class="feat-card"><div class="feat-icon"><div class="feat-icon-inner"></div></div><h3>{{F3T}}</h3><p>{{F3D}}</p></div>
  </div>
</div>
<div class="cta-section">
  <h2>Ready to get started?</h2>
  <p>Join thousands already using {{TITLE}}</p>
  <button class="cta-btn">{{CTA}}</button>
</div>
<footer>&copy; 2025 {{TITLE}} &mdash; {{TAGLINE}}</footer>
</body></html>`;

// ── Layout 6: Asymmetric Grid / Creative ─────────────────────────────────────

const LAYOUT_CREATIVE = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{TITLE}}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif;background:{{BG}};color:{{TEXT}};min-height:100vh}
nav{display:flex;align-items:center;justify-content:space-between;padding:20px 48px}
.logo{font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em}
.nav-cta{background:transparent;color:{{ACCENT}};border:2px solid {{ACCENT}};padding:9px 20px;border-radius:{{RADIUS}};font-weight:700;font-size:13px;cursor:pointer}
.main-grid{display:grid;grid-template-columns:3fr 2fr;gap:0;min-height:80vh;border-top:1px solid {{BORDER}}}
.left{padding:80px 60px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid {{BORDER}}}
.label{font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:{{ACCENT}};margin-bottom:24px;display:flex;align-items:center;gap:10px}
.label::before{content:'';width:32px;height:2px;background:{{ACCENT}}}
.left h1{font-size:clamp(40px,5.5vw,76px);font-weight:900;letter-spacing:-0.03em;line-height:0.95;margin-bottom:28px}
.left p{font-size:16px;color:{{MUTED}};line-height:1.75;max-width:460px;margin-bottom:40px}
.left-btns{display:flex;gap:16px;align-items:center}
.btn-main{background:{{ACCENT}};color:{{ACCENT_TEXT}};border:none;padding:16px 36px;border-radius:{{RADIUS}};font-weight:700;font-size:15px;cursor:pointer}
.btn-link{font-size:14px;color:{{MUTED}};text-decoration:underline;cursor:pointer;background:none;border:none}
.right{display:flex;flex-direction:column}
.right-top{flex:1;padding:40px;border-bottom:1px solid {{BORDER}};background:{{SURFACE}};display:flex;flex-direction:column;justify-content:center}
.right-top h2{font-size:28px;font-weight:800;margin-bottom:12px;line-height:1.2}
.right-top p{font-size:14px;color:{{MUTED}};line-height:1.65}
.right-feat{padding:28px 40px;border-bottom:1px solid {{BORDER}};display:flex;gap:16px;align-items:flex-start}
.feat-line{width:3px;flex-shrink:0;background:{{ACCENT}};border-radius:2px;align-self:stretch;min-height:40px}
.feat-text h3{font-size:14px;font-weight:700;margin-bottom:5px}
.feat-text p{font-size:13px;color:{{MUTED}};line-height:1.5}
footer{padding:24px 48px;border-top:1px solid {{BORDER}};display:flex;justify-content:space-between;align-items:center;font-size:12px;color:{{MUTED}}}
@media(max-width:768px){.main-grid{grid-template-columns:1fr}.left{padding:40px 24px}nav{padding:16px 24px}}</style></head>
<body>
<nav><span class="logo">{{TITLE}}</span><button class="nav-cta">{{CTA}}</button></nav>
<div class="main-grid">
  <div class="left">
    <div class="label">{{TAGLINE}}</div>
    <h1>{{TITLE}}</h1>
    <p>{{DESCRIPTION}}</p>
    <div class="left-btns"><button class="btn-main">{{CTA}}</button><button class="btn-link">Learn more</button></div>
  </div>
  <div class="right">
    <div class="right-top"><h2>What we offer</h2><p>Three reasons {{TITLE}} stands apart.</p></div>
    <div class="right-feat"><div class="feat-line"></div><div class="feat-text"><h3>{{F1T}}</h3><p>{{F1D}}</p></div></div>
    <div class="right-feat"><div class="feat-line"></div><div class="feat-text"><h3>{{F2T}}</h3><p>{{F2D}}</p></div></div>
    <div class="right-feat"><div class="feat-line"></div><div class="feat-text"><h3>{{F3T}}</h3><p>{{F3D}}</p></div></div>
  </div>
</div>
<footer><span>&copy; 2025 {{TITLE}}</span><span>{{TAGLINE}}</span></footer>
</body></html>`;

// ── Generate 30 templates (6 layouts × 5 themes) ─────────────────────────────

const LAYOUTS = [
  LAYOUT_CENTERED,
  LAYOUT_SPLIT,
  LAYOUT_DARK_NEON,
  LAYOUT_BOLD,
  LAYOUT_SAAS,
  LAYOUT_CREATIVE,
];

export interface WebTemplate {
  id: number;
  html: string; // with {{PLACEHOLDERS}}
}

export const WEB_TEMPLATES: WebTemplate[] = LAYOUTS.flatMap((layout, li) =>
  THEMES.map((theme, ti) => ({
    id: li * THEMES.length + ti,
    html: layout
      .replaceAll("{{BG}}", theme.bg)
      .replaceAll("{{SURFACE}}", theme.surface)
      .replaceAll("{{TEXT}}", theme.text)
      .replaceAll("{{MUTED}}", theme.muted)
      .replaceAll("{{ACCENT}}", theme.accent)
      .replaceAll("{{ACCENT_TEXT}}", theme.accentText)
      .replaceAll("{{BORDER}}", theme.border)
      .replaceAll("{{RADIUS}}", theme.radius)
      .replaceAll("{{HEADING_STYLE}}", theme.headingStyle),
  }))
);

export function pickRandomTemplate(): WebTemplate {
  return WEB_TEMPLATES[Math.floor(Math.random() * WEB_TEMPLATES.length)];
}

export function fillTemplate(tpl: WebTemplate, vars: TemplateVars): string {
  return tpl.html
    .replaceAll("{{PRIMARY_COLOR}}", vars.primaryColor)
    .replaceAll("{{TITLE}}", vars.title)
    .replaceAll("{{TAGLINE}}", vars.tagline)
    .replaceAll("{{DESCRIPTION}}", vars.description)
    .replaceAll("{{CTA}}", vars.ctaText)
    .replaceAll("{{F1T}}", vars.f1Title).replaceAll("{{F1D}}", vars.f1Desc)
    .replaceAll("{{F2T}}", vars.f2Title).replaceAll("{{F2D}}", vars.f2Desc)
    .replaceAll("{{F3T}}", vars.f3Title).replaceAll("{{F3D}}", vars.f3Desc);
}
