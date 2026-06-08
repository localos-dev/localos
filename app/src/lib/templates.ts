// Pre-built HTML templates. Zero LLM involvement.
// Templates are bundled in the app JS — no download needed, always offline.

export interface Template {
  type: string;
  html: string;
}

// ── Detect which template to use ──────────────────────────────────────────

export function getTemplateForRequest(req: string): Template | null {
  const l = req.toLowerCase();
  if (l.includes("calculator"))                                         return { type: "calculator", html: CALCULATOR };
  if (l.includes("todo") || l.includes("task list") || l.includes("task manager")) return { type: "todo", html: TODO };
  if (l.includes("stopwatch") || l.includes("timer") || l.includes("countdown"))   return { type: "timer", html: TIMER };
  if (l.includes("quiz") || l.includes("trivia"))                       return { type: "quiz", html: QUIZ };
  if (l.includes("clock") || l.includes("analog clock"))                return { type: "clock", html: CLOCK };
  if (l.includes("snake"))                                               return { type: "snake", html: SNAKE };
  if (l.includes("weather"))                                             return { type: "weather", html: WEATHER };
  if (l.includes("music player") || l.includes("music app"))            return { type: "music", html: MUSIC };
  if (l.includes("dashboard") || l.includes("analytics"))               return { type: "dashboard", html: DASHBOARD };
  if (
    l.includes("website") || l.includes("landing") || l.includes("homepage") ||
    l.includes("site") || l.includes("web page") ||
    l.includes("memecoin") || l.includes("crypto") ||
    l.includes("startup") || l.includes("company") || l.includes("portfolio")
  ) return { type: "website", html: WEBSITE };
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATOR — Google-style dark calculator
// ─────────────────────────────────────────────────────────────────────────────

const CALCULATOR = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Calculator</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#202124;display:flex;align-items:center;justify-content:center;min-height:100vh;
     font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.wrap{width:340px}
.display{background:#303134;border-radius:20px;padding:20px 24px 16px;margin-bottom:16px;
         text-align:right;min-height:108px;display:flex;flex-direction:column;
         justify-content:flex-end;gap:6px}
.expr{color:rgba(255,255,255,.4);font-size:15px;min-height:22px;word-break:break-all}
.num{color:#fff;font-size:52px;font-weight:300;line-height:1;word-break:break-all;transition:font-size .1s}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
button{border:none;border-radius:50px;height:72px;font-size:22px;font-weight:400;cursor:pointer;
       transition:opacity .1s,transform .08s;font-family:inherit;letter-spacing:-.01em;outline:none}
button:active{transform:scale(.93);opacity:.75}
.n{background:#3c4043;color:#fff}
.f{background:#5f6368;color:#fff;font-size:18px}
.o{background:#5f6368;color:#fff}
.eq{background:#8ab4f8;color:#202124;font-weight:500}
.z{grid-column:span 2;text-align:left;padding-left:30px}
button:not(:active):hover{filter:brightness(1.14)}
</style>
</head>
<body>
<div class="wrap">
  <div class="display">
    <div class="expr" id="expr"></div>
    <div class="num" id="num">0</div>
  </div>
  <div class="grid">
    <button class="f" id="b-ac">AC</button>
    <button class="f" id="b-sg">+/-</button>
    <button class="f" id="b-pc">%</button>
    <button class="o" id="b-dv">&#247;</button>
    <button class="n" id="b-7">7</button>
    <button class="n" id="b-8">8</button>
    <button class="n" id="b-9">9</button>
    <button class="o" id="b-mu">&#215;</button>
    <button class="n" id="b-4">4</button>
    <button class="n" id="b-5">5</button>
    <button class="n" id="b-6">6</button>
    <button class="o" id="b-mi">&#8722;</button>
    <button class="n" id="b-1">1</button>
    <button class="n" id="b-2">2</button>
    <button class="n" id="b-3">3</button>
    <button class="o" id="b-pl">+</button>
    <button class="n z" id="b-0">0</button>
    <button class="n" id="b-dt">.</button>
    <button class="eq" id="b-eq">=</button>
  </div>
</div>
<script>
(function(){
var cur='0',prv='',opr='',fresh=false;
var N=document.getElementById('num');
var E=document.getElementById('expr');
var SYM={'+':'+','-':'\u2212','*':'\u00d7','/':'\u00f7'};
function render(){
  N.textContent=cur;
  var l=cur.length;
  N.style.fontSize=l>11?'22px':l>8?'34px':l>6?'42px':'52px';
}
function digit(v){
  if(fresh){cur=v==='.'?'0.':v;fresh=false;}
  else if(v==='.'&&cur.includes('.'))return;
  else if(cur==='0'&&v!=='.')cur=v;
  else cur+=v;
  render();
}
function clear(){cur='0';prv='';opr='';fresh=false;E.textContent='';render();}
function sign(){cur=cur.startsWith('-')?cur.slice(1):(cur!=='0'?'-'+cur:'0');render();}
function pct(){cur=String(parseFloat(cur)/100);render();}
function oper(o){
  if(opr&&!fresh){calc(true);}
  prv=cur;opr=o;fresh=true;
  E.textContent=prv+' '+SYM[o];
}
function calc(chain){
  if(!opr)return;
  var a=parseFloat(prv),b=parseFloat(cur);
  var r=opr==='+'?a+b:opr==='-'?a-b:opr==='*'?a*b:b===0?NaN:a/b;
  if(!chain){E.textContent='';opr='';prv='';}
  cur=isNaN(r)?'Error':String(parseFloat(r.toFixed(10)));
  fresh=true;render();
}
document.getElementById('b-ac').addEventListener('click',clear);
document.getElementById('b-sg').addEventListener('click',sign);
document.getElementById('b-pc').addEventListener('click',pct);
document.getElementById('b-dv').addEventListener('click',function(){oper('/');});
document.getElementById('b-7').addEventListener('click',function(){digit('7');});
document.getElementById('b-8').addEventListener('click',function(){digit('8');});
document.getElementById('b-9').addEventListener('click',function(){digit('9');});
document.getElementById('b-mu').addEventListener('click',function(){oper('*');});
document.getElementById('b-4').addEventListener('click',function(){digit('4');});
document.getElementById('b-5').addEventListener('click',function(){digit('5');});
document.getElementById('b-6').addEventListener('click',function(){digit('6');});
document.getElementById('b-mi').addEventListener('click',function(){oper('-');});
document.getElementById('b-1').addEventListener('click',function(){digit('1');});
document.getElementById('b-2').addEventListener('click',function(){digit('2');});
document.getElementById('b-3').addEventListener('click',function(){digit('3');});
document.getElementById('b-pl').addEventListener('click',function(){oper('+');});
document.getElementById('b-0').addEventListener('click',function(){digit('0');});
document.getElementById('b-dt').addEventListener('click',function(){digit('.');});
document.getElementById('b-eq').addEventListener('click',function(){calc(false);});
render();
})();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE — structure hardcoded, content filled by LLM via fillWebsite()
// ─────────────────────────────────────────────────────────────────────────────

const WEBSITE_RAW = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__BRAND__</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--p:#0052FF;--dark:#050d1f;--card:rgba(255,255,255,.04);--border:rgba(255,255,255,.08)}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--dark);color:#fff;line-height:1.6}
a{text-decoration:none;color:inherit}
nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
    padding:0 64px;height:68px;background:rgba(5,13,31,.85);backdrop-filter:blur(24px);
    border-bottom:1px solid var(--border)}
.logo{font-size:18px;font-weight:800;color:var(--p);letter-spacing:-.02em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(255,255,255,.55);font-size:14px;transition:color .2s}
.nav-links a:hover{color:#fff}
.nav-btn{background:var(--p);color:#fff;padding:9px 22px;border-radius:8px;font-size:14px;
         font-weight:600;border:none;cursor:pointer;transition:background .2s}
.nav-btn:hover{background:#0040cc}
.hero{min-height:88vh;display:flex;align-items:center;justify-content:center;text-align:center;
      padding:100px 20px 80px;background:radial-gradient(ellipse 80% 55% at 50% 0%,rgba(0,82,255,.14) 0%,transparent 70%)}
.hero-inner{max-width:820px}
.badge{display:inline-block;background:rgba(0,82,255,.14);border:1px solid rgba(0,82,255,.3);
       color:#6699ff;padding:6px 18px;border-radius:20px;font-size:12px;font-weight:700;
       letter-spacing:.06em;text-transform:uppercase;margin-bottom:28px}
h1{font-size:clamp(38px,7vw,80px);font-weight:900;line-height:1.08;letter-spacing:-.04em;margin-bottom:22px}
h1 em{color:var(--p);font-style:normal}
.hero p{color:rgba(255,255,255,.5);font-size:18px;max-width:560px;margin:0 auto 40px;line-height:1.75}
.btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn-p{background:var(--p);color:#fff;padding:15px 36px;border-radius:12px;font-size:15px;
       font-weight:700;border:none;cursor:pointer;transition:all .2s}
.btn-p:hover{background:#0040cc;transform:translateY(-2px)}
.btn-s{background:rgba(255,255,255,.06);color:#fff;padding:15px 36px;border-radius:12px;
       font-size:15px;font-weight:600;border:1px solid rgba(255,255,255,.12);cursor:pointer;transition:all .2s}
.btn-s:hover{background:rgba(255,255,255,.1)}
section{padding:96px 64px}
.tag{color:var(--p);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}
h2{font-size:clamp(28px,4vw,46px);font-weight:900;letter-spacing:-.03em;margin-bottom:14px}
.sub{color:rgba(255,255,255,.45);font-size:17px;max-width:500px;line-height:1.75;margin-bottom:56px}
.features{background:rgba(255,255,255,.02);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:32px;transition:border-color .2s}
.card:hover{border-color:rgba(0,82,255,.35)}
.icon{width:48px;height:48px;background:rgba(0,82,255,.14);border-radius:12px;display:flex;
      align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
.card h3{font-size:17px;font-weight:700;margin-bottom:10px}
.card p{color:rgba(255,255,255,.45);font-size:14px;line-height:1.75}
.stats{text-align:center}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:48px;margin-top:64px}
.big{font-size:58px;font-weight:900;color:var(--p);letter-spacing:-.04em}
.lbl{color:rgba(255,255,255,.4);font-size:15px;margin-top:6px}
.how{background:rgba(255,255,255,.02);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px}
.step{text-align:center}
.sn{width:56px;height:56px;background:var(--p);border-radius:50%;display:flex;
    align-items:center;justify-content:center;font-size:20px;font-weight:900;margin:0 auto 18px}
.step h3{font-size:16px;font-weight:700;margin-bottom:8px}
.step p{color:rgba(255,255,255,.4);font-size:14px;line-height:1.7}
.cta{text-align:center;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(0,82,255,.1) 0%,transparent 70%)}
.cta .sub{margin:14px auto 40px}
footer{padding:44px 64px;border-top:1px solid var(--border);display:flex;justify-content:space-between;
       align-items:center;flex-wrap:wrap;gap:16px}
footer .logo{font-size:15px}
footer span{color:rgba(255,255,255,.25);font-size:13px}
.flinks{display:flex;gap:24px}
.flinks a{color:rgba(255,255,255,.3);font-size:13px;transition:color .2s}
.flinks a:hover{color:rgba(255,255,255,.7)}
</style>
</head>
<body>
<nav>
  <div class="logo">__BRAND__</div>
  <div class="nav-links">
    <a href="#features">__NAV1__</a>
    <a href="#stats">__NAV2__</a>
    <a href="#how">__NAV3__</a>
    <a href="#cta">__NAV4__</a>
  </div>
  <button class="nav-btn">__BTN1__</button>
</nav>
<div class="hero">
  <div class="hero-inner">
    <div class="badge">__BADGE__</div>
    <h1>__H1_PLAIN__<br><em>__H1_EM__</em></h1>
    <p>__HERO_P__</p>
    <div class="btns">
      <button class="btn-p">__BTN1__</button>
      <button class="btn-s">__BTN2__</button>
    </div>
  </div>
</div>
<section class="features" id="features">
  <div class="tag">Features</div>
  <h2>__FEAT_H2__</h2>
  <p class="sub">__FEAT_SUB__</p>
  <div class="cards">
    <div class="card"><div class="icon">&#9889;</div><h3>__F1T__</h3><p>__F1D__</p></div>
    <div class="card"><div class="icon">&#128274;</div><h3>__F2T__</h3><p>__F2D__</p></div>
    <div class="card"><div class="icon">&#128279;</div><h3>__F3T__</h3><p>__F3D__</p></div>
    <div class="card"><div class="icon">&#128200;</div><h3>__F4T__</h3><p>__F4D__</p></div>
    <div class="card"><div class="icon">&#129302;</div><h3>__F5T__</h3><p>__F5D__</p></div>
    <div class="card"><div class="icon">&#127758;</div><h3>__F6T__</h3><p>__F6D__</p></div>
  </div>
</section>
<section class="stats" id="stats">
  <div class="tag">By the numbers</div>
  <h2>__STATS_H2__</h2>
  <div class="stat-grid">
    <div><div class="big">__S1N__</div><div class="lbl">__S1L__</div></div>
    <div><div class="big">__S2N__</div><div class="lbl">__S2L__</div></div>
    <div><div class="big">__S3N__</div><div class="lbl">__S3L__</div></div>
    <div><div class="big">__S4N__</div><div class="lbl">__S4L__</div></div>
  </div>
</section>
<section class="how" id="how">
  <div class="tag">How it works</div>
  <h2>__HOW_H2__</h2>
  <p class="sub">__HOW_P__</p>
  <div class="steps">
    <div class="step"><div class="sn">1</div><h3>__P1T__</h3><p>__P1D__</p></div>
    <div class="step"><div class="sn">2</div><h3>__P2T__</h3><p>__P2D__</p></div>
    <div class="step"><div class="sn">3</div><h3>__P3T__</h3><p>__P3D__</p></div>
    <div class="step"><div class="sn">4</div><h3>__P4T__</h3><p>__P4D__</p></div>
  </div>
</section>
<section class="cta" id="cta">
  <div class="tag">Get started</div>
  <h2>__CTA_H2__</h2>
  <p class="sub">__CTA_P__</p>
  <div class="btns">
    <button class="btn-p">__BTN1__</button>
    <button class="btn-s">__BTN2__</button>
  </div>
</section>
<footer>
  <div class="logo">__FOOT_BRAND__</div>
  <span>__FOOT_COPY__</span>
  <div class="flinks">
    <a href="#">Privacy</a>
    <a href="#">Terms</a>
    <a href="#">Contact</a>
  </div>
</footer>
</body>
</html>`;

// ── Derive a brand name from the user's request ────────────────────────────

function deriveBrand(req: string): string {
  const stop = new Set([
    "build", "create", "make", "a", "an", "the", "me", "website", "landing",
    "page", "site", "app", "for", "startup", "company", "portfolio", "crypto",
    "memecoin", "homepage", "saas",
  ]);
  const words = req
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stop.has(w));
  if (words.length === 0) return "Product";
  const w = words[0];
  return w[0].toUpperCase() + w.slice(1);
}

// ── Fill website template with LLM-provided fields + sensible defaults ─────

export function fillWebsite(
  html: string,
  fields: Record<string, string>,
  userRequest: string
): string {
  const brand = fields["BRAND"] || deriveBrand(userRequest);
  const year = new Date().getFullYear();

  const vals: Record<string, string> = {
    __BRAND__:    brand,
    __BADGE__:    fields["BADGE"]    || "Now available",
    __H1_PLAIN__: fields["H1_PLAIN"] || "The future of",
    __H1_EM__:    fields["H1_EM"]    || brand,
    __HERO_P__:   fields["HERO_P"]   || `${brand} is built for the modern era.`,
    __BTN1__:     fields["BTN1"]     || "Get started",
    __BTN2__:     fields["BTN2"]     || "Learn more",
    __NAV1__:     fields["NAV1"]     || "Features",
    __NAV2__:     fields["NAV2"]     || "About",
    __NAV3__:     fields["NAV3"]     || "How it works",
    __NAV4__:     fields["NAV4"]     || "Pricing",
    __FEAT_H2__:  fields["FEAT_H2"]  || `Everything ${brand} offers`,
    __FEAT_SUB__: fields["FEAT_SUB"] || `Powerful features built for ${brand} users worldwide.`,
    __F1T__: fields["F1T"] || "Fast",
    __F1D__: fields["F1D"] || "Built for speed from the ground up with zero lag.",
    __F2T__: fields["F2T"] || "Secure",
    __F2D__: fields["F2D"] || "End-to-end protection keeps your data safe at every layer.",
    __F3T__: fields["F3T"] || "Reliable",
    __F3D__: fields["F3D"] || "99.9% uptime guaranteed so you never miss a moment.",
    __F4T__: fields["F4T"] || "Scalable",
    __F4D__: fields["F4D"] || "Grows with you from day one to millions of users.",
    __F5T__: fields["F5T"] || "Simple",
    __F5D__: fields["F5D"] || "Clean interface that stays out of your way.",
    __F6T__: fields["F6T"] || "Open",
    __F6D__: fields["F6D"] || "Integrates with every tool in your existing workflow.",
    __STATS_H2__: fields["STATS_H2"] || `Trusted by thousands of ${brand} users`,
    __S1N__: fields["S1N"] || "10K+",
    __S1L__: fields["S1L"] || "Active users",
    __S2N__: fields["S2N"] || "99.9%",
    __S2L__: fields["S2L"] || "Uptime",
    __S3N__: fields["S3N"] || "2M+",
    __S3L__: fields["S3L"] || "Transactions",
    __S4N__: fields["S4N"] || "4.9",
    __S4L__: fields["S4L"] || "Rating",
    __HOW_H2__: fields["HOW_H2"] || "Get started in minutes",
    __HOW_P__:  fields["HOW_P"]  || "Simple setup, no engineering required.",
    __P1T__: fields["P1T"] || "Sign up",
    __P1D__: fields["P1D"] || "Create your account in under 60 seconds.",
    __P2T__: fields["P2T"] || "Connect",
    __P2D__: fields["P2D"] || "Link your existing tools and data sources.",
    __P3T__: fields["P3T"] || "Launch",
    __P3D__: fields["P3D"] || "Go live and see results from day one.",
    __P4T__: fields["P4T"] || "Grow",
    __P4D__: fields["P4D"] || "Scale your usage as your needs expand.",
    __CTA_H2__: fields["CTA_H"] || `Ready to start with ${brand}?`,
    __CTA_P__:  fields["CTA_P"] || `Join thousands already using ${brand}. Free to get started today.`,
    __FOOT_BRAND__: fields["FOOT_BRAND"] || brand,
    __FOOT_COPY__:  fields["FOOT_COPY"]  || `${year} ${brand}. All rights reserved.`,
  };

  let result = html;
  for (const [placeholder, value] of Object.entries(vals)) {
    result = result.split(placeholder).join(value);
  }
  return result;
}

// Keep WEBSITE as an alias so getTemplateForRequest still works
const WEBSITE = WEBSITE_RAW;

// ─────────────────────────────────────────────────────────────────────────────
// TODO APP
// ─────────────────────────────────────────────────────────────────────────────

const TODO = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Todo App</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f1117;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;justify-content:center;padding:48px 16px}
.app{width:100%;max-width:560px}
h1{font-size:32px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px}
.count{color:rgba(255,255,255,.35);font-size:14px;margin-bottom:28px}
.add-row{display:flex;gap:10px;margin-bottom:24px}
input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;
      padding:14px 18px;color:#fff;font-size:15px;outline:none;transition:border-color .2s;font-family:inherit}
input:focus{border-color:#0052FF}
input::placeholder{color:rgba(255,255,255,.25)}
.add-btn{background:#0052FF;color:#fff;border:none;border-radius:12px;padding:14px 22px;
         font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;white-space:nowrap;font-family:inherit}
.add-btn:hover{background:#0040cc}
.filters{display:flex;gap:6px;margin-bottom:20px}
.filter{background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:8px;
        padding:7px 16px;color:rgba(255,255,255,.45);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit}
.filter.active{background:#0052FF;border-color:#0052FF;color:#fff}
.filter:hover:not(.active){border-color:rgba(255,255,255,.3);color:#fff}
.list{display:flex;flex-direction:column;gap:8px}
.item{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px 16px;transition:border-color .2s}
.item:hover{border-color:rgba(255,255,255,.15)}
.cb{width:22px;height:22px;border:2px solid rgba(255,255,255,.25);border-radius:6px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;background:transparent}
.cb.done{background:#0052FF;border-color:#0052FF}
.cb.done::after{content:'';width:6px;height:10px;border:2px solid #fff;border-top:none;border-left:none;
                transform:rotate(45deg);display:block;margin-bottom:3px}
.txt{flex:1;font-size:15px;transition:all .2s}
.txt.done{text-decoration:line-through;color:rgba(255,255,255,.3)}
.del{background:transparent;border:none;color:rgba(255,255,255,.2);cursor:pointer;font-size:18px;
     padding:4px;border-radius:6px;transition:all .2s;line-height:1}
.del:hover{color:#ef4444;background:rgba(239,68,68,.1)}
.footer{display:flex;justify-content:space-between;align-items:center;margin-top:20px;
        color:rgba(255,255,255,.3);font-size:13px}
.clear{background:transparent;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:13px;
       transition:color .2s;font-family:inherit}
.clear:hover{color:#ef4444}
.empty{text-align:center;color:rgba(255,255,255,.2);padding:48px 0;font-size:15px}
</style>
</head>
<body>
<div class="app">
  <h1>My Tasks</h1>
  <div class="count" id="cnt"></div>
  <div class="add-row">
    <input id="inp" placeholder="Add a new task..." onkeydown="if(event.key==='Enter')add()">
    <button class="add-btn" onclick="add()">Add</button>
  </div>
  <div class="filters">
    <button class="filter active" onclick="setFilter('all',this)">All</button>
    <button class="filter" onclick="setFilter('active',this)">Active</button>
    <button class="filter" onclick="setFilter('done',this)">Completed</button>
  </div>
  <div class="list" id="list"></div>
  <div class="footer">
    <span id="left"></span>
    <button class="clear" onclick="clearDone()">Clear completed</button>
  </div>
</div>
<script>
let tasks=JSON.parse(localStorage.getItem('los_tasks')||'[]');
let filt='all';
function save(){localStorage.setItem('los_tasks',JSON.stringify(tasks));}
function render(){
  const vis=tasks.filter(t=>filt==='all'?true:filt==='active'?!t.done:t.done);
  const list=document.getElementById('list');
  list.innerHTML=vis.length?'':'<div class="empty">No tasks here</div>';
  vis.forEach(t=>{
    const d=document.createElement('div');d.className='item';
    d.innerHTML='<div class="cb'+(t.done?' done':'')+'" onclick="toggle('+t.id+')"></div>'+
      '<div class="txt'+(t.done?' done':'')+'">'+t.text+'</div>'+
      '<button class="del" onclick="del('+t.id+')">&#10005;</button>';
    list.appendChild(d);
  });
  const left=tasks.filter(t=>!t.done).length;
  document.getElementById('left').textContent=left+' task'+(left===1?'':'s')+' left';
  document.getElementById('cnt').textContent=tasks.length+' total task'+(tasks.length===1?'':'s');
}
function add(){
  const v=document.getElementById('inp').value.trim();
  if(!v)return;
  tasks.push({id:Date.now(),text:v,done:false});
  document.getElementById('inp').value='';save();render();
}
function toggle(id){const t=tasks.find(x=>x.id===id);if(t){t.done=!t.done;save();render();}}
function del(id){tasks=tasks.filter(x=>x.id!==id);save();render();}
function clearDone(){tasks=tasks.filter(t=>!t.done);save();render();}
function setFilter(f,btn){
  filt=f;
  document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');render();
}
render();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// TIMER / STOPWATCH
// ─────────────────────────────────────────────────────────────────────────────

const TIMER = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stopwatch</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px}
.time{font-size:clamp(56px,12vw,120px);font-weight:200;letter-spacing:.02em;font-variant-numeric:tabular-nums;
      font-family:'SF Mono',Monaco,monospace;margin-bottom:48px;line-height:1}
.ms{font-size:50%;color:rgba(255,255,255,.4)}
.btns{display:flex;gap:16px;margin-bottom:40px}
.btn{border:none;border-radius:50%;width:80px;height:80px;font-size:15px;font-weight:700;cursor:pointer;
     transition:all .15s;font-family:inherit;letter-spacing:.02em}
.btn:active{transform:scale(.93)}
.start{background:#0052FF;color:#fff}
.start:hover{background:#0040cc}
.start.running{background:#ef4444}
.start.running:hover{background:#dc2626}
.lap-btn{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1)}
.lap-btn:hover:not(:disabled){background:rgba(255,255,255,.14);color:#fff}
.lap-btn:disabled{opacity:.3;cursor:not-allowed}
.reset{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1)}
.reset:hover{background:rgba(255,255,255,.14);color:#fff}
.laps{width:100%;max-width:400px;max-height:220px;overflow-y:auto}
.lap-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);
         font-size:15px;font-family:monospace;color:rgba(255,255,255,.6)}
.lap-row:first-child{color:#0052FF;font-weight:700}
.lap-label{color:rgba(255,255,255,.3);font-size:13px}
</style>
</head>
<body>
<div class="time"><span id="hms">00:00</span><span class="ms">.<span id="cs">00</span></span></div>
<div class="btns">
  <button class="btn lap-btn" id="lapBtn" onclick="lap()" disabled>Lap</button>
  <button class="btn start" id="startBtn" onclick="toggle()">Start</button>
  <button class="btn reset" onclick="reset()">Reset</button>
</div>
<div class="laps" id="laps"></div>
<script>
let running=false,elapsed=0,lapStart=0,start=0,raf=0,laps=[];
const hms=document.getElementById('hms'),cs=document.getElementById('cs');
const startBtn=document.getElementById('startBtn'),lapBtn=document.getElementById('lapBtn');
function fmt(ms){
  const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),c=Math.floor(ms%1000/10);
  return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function update(){
  const now=performance.now();elapsed=Date.now()-start+elapsed;start=Date.now();
  hms.textContent=fmt(elapsed);cs.textContent=String(Math.floor(elapsed%1000/10)).padStart(2,'0');
  if(running)raf=requestAnimationFrame(update);
}
function toggle(){
  if(!running){running=true;start=Date.now();lapStart=elapsed;startBtn.textContent='Stop';
    startBtn.classList.add('running');lapBtn.disabled=false;raf=requestAnimationFrame(update);}
  else{running=false;cancelAnimationFrame(raf);startBtn.textContent='Start';startBtn.classList.remove('running');}
}
function lap(){
  const t=elapsed-lapStart;lapStart=elapsed;laps.unshift({n:laps.length+1,t,total:elapsed});renderLaps();}
function reset(){
  if(running){running=false;cancelAnimationFrame(raf);startBtn.textContent='Start';startBtn.classList.remove('running');}
  elapsed=0;lapStart=0;laps=[];lapBtn.disabled=true;hms.textContent='00:00';cs.textContent='00';renderLaps();}
function renderLaps(){
  const el=document.getElementById('laps');
  el.innerHTML=laps.map((l,i)=>'<div class="lap-row"><span class="lap-label">Lap '+l.n+'</span><span>'+fmt(l.t)+'</span><span>'+fmt(l.total)+'</span></div>').join('');
}
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ APP
// ─────────────────────────────────────────────────────────────────────────────

const QUIZ = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quiz</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f1117;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;
      padding:40px;width:100%;max-width:560px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.qn{font-size:13px;color:rgba(255,255,255,.4);font-weight:600}
.score{font-size:13px;color:#0052FF;font-weight:700}
.bar{height:4px;background:rgba(255,255,255,.08);border-radius:4px;margin-bottom:32px}
.bar-fill{height:100%;background:#0052FF;border-radius:4px;transition:width .4s}
h2{font-size:22px;font-weight:700;line-height:1.45;margin-bottom:28px}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px}
.opt{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;
     padding:16px;font-size:14px;font-weight:500;cursor:pointer;text-align:left;color:#fff;
     transition:all .2s;font-family:inherit;line-height:1.4}
.opt:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25)}
.opt.correct{background:rgba(34,197,94,.15);border-color:#22c55e;color:#4ade80}
.opt.wrong{background:rgba(239,68,68,.15);border-color:#ef4444;color:#f87171}
.opt:disabled{cursor:default}
.next{width:100%;background:#0052FF;color:#fff;border:none;border-radius:12px;padding:15px;
      font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;font-family:inherit}
.next:hover{background:#0040cc}
.next:disabled{opacity:.3;cursor:not-allowed}
.result{text-align:center}
.big-score{font-size:80px;font-weight:900;color:#0052FF;margin:16px 0}
.result h2{font-size:28px;margin-bottom:8px}
.result p{color:rgba(255,255,255,.45);margin-bottom:32px}
.retry{background:#0052FF;color:#fff;border:none;border-radius:12px;padding:14px 40px;
       font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;font-family:inherit}
.retry:hover{background:#0040cc}
</style>
</head>
<body>
<div class="card" id="card"></div>
<script>
const Q=[
  {q:"What is the capital of France?",opts:["Berlin","Madrid","Paris","Rome"],a:2},
  {q:"Which planet is closest to the Sun?",opts:["Venus","Mercury","Earth","Mars"],a:1},
  {q:"How many sides does a hexagon have?",opts:["5","7","8","6"],a:3},
  {q:"Who painted the Mona Lisa?",opts:["Van Gogh","Picasso","Da Vinci","Rembrandt"],a:2},
  {q:"What is the chemical symbol for Gold?",opts:["Go","Gd","Au","Ag"],a:2},
  {q:"Which ocean is the largest?",opts:["Atlantic","Indian","Arctic","Pacific"],a:3},
  {q:"What year did World War II end?",opts:["1943","1944","1945","1946"],a:2},
  {q:"How many legs does a spider have?",opts:["6","8","10","12"],a:1},
];
let idx=0,score=0,answered=false;
const card=document.getElementById('card');
function render(){
  if(idx>=Q.length){renderResult();return;}
  const q=Q[idx];const pct=Math.round((idx/Q.length)*100);
  card.innerHTML='<div class="top"><span class="qn">Question '+(idx+1)+' of '+Q.length+'</span><span class="score">'+score+' correct</span></div>'+
    '<div class="bar"><div class="bar-fill" style="width:'+pct+'%"></div></div>'+
    '<h2>'+q.q+'</h2>'+
    '<div class="opts">'+q.opts.map((o,i)=>'<button class="opt" onclick="pick('+i+')" id="o'+i+'">'+o+'</button>').join('')+'</div>'+
    '<button class="next" id="nx" onclick="next()" disabled>Next question</button>';
  answered=false;
}
function pick(i){
  if(answered)return;answered=true;
  const q=Q[idx];
  if(i===q.a)score++;
  document.querySelectorAll('.opt').forEach((b,j)=>{
    b.disabled=true;
    if(j===q.a)b.classList.add('correct');
    else if(j===i)b.classList.add('wrong');
  });
  document.getElementById('nx').disabled=false;
}
function next(){idx++;render();}
function renderResult(){
  const pct=Math.round(score/Q.length*100);
  card.innerHTML='<div class="result">'+
    '<p>Quiz complete!</p>'+
    '<div class="big-score">'+pct+'%</div>'+
    '<h2>'+score+'/'+Q.length+' correct</h2>'+
    '<p style="margin-bottom:32px">'+(pct>=80?'Excellent work!':pct>=50?'Good effort! Keep practicing.':'Keep studying and try again!')+
    '</p><button class="retry" onclick="restart()">Play Again</button></div>';
}
function restart(){idx=0;score=0;render();}
render();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────────────────────────────

const CLOCK = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Clock</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px}
canvas{filter:drop-shadow(0 0 32px rgba(0,82,255,.25))}
.digital{font-size:clamp(40px,8vw,72px);font-weight:200;font-family:'SF Mono',Monaco,monospace;
         letter-spacing:.05em;font-variant-numeric:tabular-nums}
.date{color:rgba(255,255,255,.35);font-size:16px;letter-spacing:.05em;text-transform:uppercase}
</style>
</head>
<body>
<canvas id="c" width="280" height="280"></canvas>
<div class="digital" id="dig"></div>
<div class="date" id="dat"></div>
<script>
const c=document.getElementById('c'),ctx=c.getContext('2d'),cx=140,cy=140,r=130;
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function draw(){
  const now=new Date(),h=now.getHours(),m=now.getMinutes(),s=now.getSeconds(),ms=now.getMilliseconds();
  ctx.clearRect(0,0,280,280);
  // Face
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#141928';ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(0,82,255,.3)';ctx.lineWidth=2;ctx.stroke();
  // Ticks
  for(let i=0;i<60;i++){
    const a=i*6*Math.PI/180,big=i%5===0,tr=big?r-14:r-8,tw=big?2.5:1.5;
    ctx.beginPath();ctx.moveTo(cx+Math.sin(a)*tr,cy-Math.cos(a)*tr);
    ctx.lineTo(cx+Math.sin(a)*r,cy-Math.cos(a)*r);
    ctx.strokeStyle=big?'rgba(255,255,255,.6)':'rgba(255,255,255,.2)';ctx.lineWidth=tw;ctx.stroke();
  }
  // Hour numbers
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='bold 13px -apple-system,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  [12,3,6,9].forEach((n,i)=>{const a=i*90*Math.PI/180,nr=r-30;ctx.fillText(n,cx+Math.sin(a)*nr,cy-Math.cos(a)*nr);});
  // Smooth seconds
  const sa=(s+ms/1000)*6*Math.PI/180;
  const ha=(h%12+m/60+s/3600)*30*Math.PI/180;
  const ma=(m+s/60)*6*Math.PI/180;
  function hand(a,len,w,col){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
    ctx.beginPath();ctx.moveTo(0,len*.2);ctx.lineTo(0,-len);
    ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();ctx.restore();
  }
  hand(ha,r*.5,5,'#fff');
  hand(ma,r*.7,3.5,'#fff');
  hand(sa,r*.82,1.5,'#0052FF');
  // Center dot
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='#0052FF';ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  // Digital
  const hh=String(h).padStart(2,'0'),mm=String(m).padStart(2,'0'),ss=String(s).padStart(2,'0');
  document.getElementById('dig').textContent=hh+':'+mm+':'+ss;
  document.getElementById('dat').textContent=DAYS[now.getDay()]+', '+MONTHS[now.getMonth()]+' '+now.getDate()+', '+now.getFullYear();
  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// SNAKE GAME
// ─────────────────────────────────────────────────────────────────────────────

const SNAKE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Snake</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.hud{display:flex;gap:48px}
.stat{text-align:center}
.stat-n{font-size:32px;font-weight:800;color:#0052FF}
.stat-l{font-size:12px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
canvas{border-radius:12px;border:1px solid rgba(255,255,255,.08)}
.msg{position:absolute;background:rgba(10,15,26,.95);border:1px solid rgba(255,255,255,.1);
     border-radius:16px;padding:32px 48px;text-align:center}
.msg h2{font-size:24px;margin-bottom:8px}
.msg p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:24px}
.msg button{background:#0052FF;color:#fff;border:none;border-radius:10px;padding:12px 32px;
            font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}
.msg button:hover{background:#0040cc}
.wrap{position:relative}
</style>
</head>
<body>
<div class="hud">
  <div class="stat"><div class="stat-n" id="sc">0</div><div class="stat-l">Score</div></div>
  <div class="stat"><div class="stat-n" id="hi">0</div><div class="stat-l">Best</div></div>
  <div class="stat"><div class="stat-n" id="lv">1</div><div class="stat-l">Level</div></div>
</div>
<div class="wrap">
  <canvas id="c" width="400" height="400"></canvas>
  <div class="msg" id="msg">
    <h2>Snake</h2>
    <p>Use arrow keys to move. Eat the red food to grow. Don't hit the walls or yourself!</p>
    <button onclick="start()">Play</button>
  </div>
</div>
<script>
const c=document.getElementById('c'),ctx=c.getContext('2d'),SZ=20,COLS=20;
let snake,dir,food,score,hi=0,level,speed,tid,running=false,nextDir;
function start(){
  document.getElementById('msg').style.display='none';
  snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir={x:1,y:0};nextDir={x:1,y:0};score=0;level=1;speed=150;
  food=rndFood();running=true;
  document.getElementById('sc').textContent=0;
  document.getElementById('lv').textContent=1;
  if(tid)clearInterval(tid);tid=setInterval(tick,speed);
}
function rndFood(){
  let f;do{f={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*COLS)};
  }while(snake.some(s=>s.x===f.x&&s.y===f.y));return f;}
function tick(){
  dir=nextDir;
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=COLS||snake.some(s=>s.x===head.x&&s.y===head.y)){end();return;}
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score+=10*level;food=rndFood();
    if(score%(50*level)===0&&level<10){level++;clearInterval(tid);speed=Math.max(60,150-level*12);tid=setInterval(tick,speed);}
    document.getElementById('sc').textContent=score;
    document.getElementById('lv').textContent=level;
    if(score>hi){hi=score;document.getElementById('hi').textContent=hi;}
  }else snake.pop();
  draw();
}
function draw(){
  ctx.fillStyle='#0d1221';ctx.fillRect(0,0,400,400);
  // Grid
  ctx.strokeStyle='rgba(255,255,255,.03)';ctx.lineWidth=1;
  for(let i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*SZ,0);ctx.lineTo(i*SZ,400);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,i*SZ);ctx.lineTo(400,i*SZ);ctx.stroke();}
  // Snake
  snake.forEach((s,i)=>{
    const ratio=i/snake.length;
    ctx.fillStyle=i===0?'#0052FF':\`hsl(220,80%,\${60-ratio*25}%)\`;
    ctx.beginPath();ctx.roundRect(s.x*SZ+1,s.y*SZ+1,SZ-2,SZ-2,4);ctx.fill();
  });
  // Food
  ctx.fillStyle='#ef4444';
  ctx.beginPath();ctx.arc(food.x*SZ+SZ/2,food.y*SZ+SZ/2,SZ/2-2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.beginPath();ctx.arc(food.x*SZ+SZ/2-3,food.y*SZ+SZ/2-3,3,0,Math.PI*2);ctx.fill();
}
function end(){
  running=false;clearInterval(tid);
  const msg=document.getElementById('msg');msg.style.display='block';
  msg.innerHTML='<h2>Game Over</h2><p>Score: '+score+'  |  Best: '+hi+'</p><button onclick="start()">Play Again</button>';
}
document.addEventListener('keydown',e=>{
  if(!running)return;
  const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
  const nd=m[e.key];
  if(nd&&!(nd.x===-dir.x&&nd.y===-dir.y)){nextDir=nd;e.preventDefault();}
});
draw();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER (mock data)
// ─────────────────────────────────────────────────────────────────────────────

const WEATHER = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Weather</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;justify-content:center;align-items:flex-start;padding:40px 16px}
.app{width:100%;max-width:520px}
.search{display:flex;gap:10px;margin-bottom:24px}
select{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;
       padding:12px 16px;color:#fff;font-size:15px;outline:none;cursor:pointer;font-family:inherit}
select option{background:#1a1f2e}
.main-card{background:linear-gradient(135deg,#0052FF,#1a3a8f);border-radius:20px;padding:32px;margin-bottom:16px}
.city-name{font-size:22px;font-weight:700;margin-bottom:4px}
.condition{color:rgba(255,255,255,.7);font-size:15px;margin-bottom:24px}
.temp-row{display:flex;align-items:flex-end;gap:16px}
.temp{font-size:80px;font-weight:200;line-height:1}
.feels{color:rgba(255,255,255,.6);font-size:14px;margin-bottom:4px}
.hl{font-size:16px;color:rgba(255,255,255,.7)}
.forecast{display:flex;gap:10px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px}
.day{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;
     padding:16px 12px;text-align:center;flex-shrink:0;min-width:80px}
.day-name{font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px}
.day-icon{font-size:24px;margin-bottom:8px}
.day-hi{font-size:15px;font-weight:700}
.day-lo{font-size:13px;color:rgba(255,255,255,.4)}
.details{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.detail{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px}
.detail-l{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:4px}
.detail-v{font-size:20px;font-weight:700}
.detail-u{font-size:12px;color:rgba(255,255,255,.4);margin-left:2px}
</style>
</head>
<body>
<div class="app">
  <div class="search">
    <select id="city" onchange="load()">
      <option value="nyc">New York</option>
      <option value="lon">London</option>
      <option value="tok">Tokyo</option>
      <option value="par">Paris</option>
      <option value="syd">Sydney</option>
    </select>
  </div>
  <div id="content"></div>
</div>
<script>
const DATA={
  nyc:{name:"New York",temp:22,feels:20,cond:"Partly Cloudy",icon:"&#9925;",hi:25,lo:17,hum:58,wind:14,vis:16,uv:5,
       fc:[{d:"Mon",i:"&#9925;",h:25,l:17},{d:"Tue",i:"&#127773;",h:28,l:19},{d:"Wed",i:"&#127783;",h:21,l:15},{d:"Thu",i:"&#9728;",h:24,l:16},{d:"Fri",i:"&#9728;",h:26,l:18}]},
  lon:{name:"London",temp:14,feels:12,cond:"Overcast",icon:"&#9729;",hi:16,lo:10,hum:74,wind:20,vis:10,uv:2,
       fc:[{d:"Mon",i:"&#9729;",h:16,l:10},{d:"Tue",i:"&#127783;",h:13,l:8},{d:"Wed",i:"&#127783;",h:12,l:7},{d:"Thu",i:"&#9729;",h:15,l:9},{d:"Fri",i:"&#9925;",h:17,l:11}]},
  tok:{name:"Tokyo",temp:28,feels:31,cond:"Sunny",icon:"&#9728;",hi:31,lo:23,hum:65,wind:8,vis:20,uv:8,
       fc:[{d:"Mon",i:"&#9728;",h:31,l:23},{d:"Tue",i:"&#9728;",h:32,l:24},{d:"Wed",i:"&#9925;",h:29,l:22},{d:"Thu",i:"&#127783;",h:26,l:20},{d:"Fri",i:"&#127783;",h:25,l:19}]},
  par:{name:"Paris",temp:18,feels:16,cond:"Clear",icon:"&#9728;",hi:21,lo:13,hum:52,wind:11,vis:18,uv:6,
       fc:[{d:"Mon",i:"&#9728;",h:21,l:13},{d:"Tue",i:"&#9925;",h:19,l:12},{d:"Wed",i:"&#9925;",h:20,l:13},{d:"Thu",i:"&#127783;",h:17,l:11},{d:"Fri",i:"&#9728;",h:22,l:14}]},
  syd:{name:"Sydney",temp:16,feels:15,cond:"Windy",icon:"&#127773;",hi:18,lo:12,hum:68,wind:28,vis:14,uv:4,
       fc:[{d:"Mon",i:"&#127773;",h:18,l:12},{d:"Tue",i:"&#9925;",h:20,l:13},{d:"Wed",i:"&#9728;",h:22,l:14},{d:"Thu",i:"&#9728;",h:23,l:15},{d:"Fri",i:"&#9925;",h:21,l:14}]},
};
function load(){
  const d=DATA[document.getElementById('city').value];
  document.getElementById('content').innerHTML=
    '<div class="main-card"><div class="city-name">'+d.name+'</div><div class="condition">'+d.icon+' '+d.cond+'</div>'+
    '<div class="temp-row"><div class="temp">'+d.temp+'&deg;</div><div><div class="feels">Feels like '+d.feels+'&deg;</div><div class="hl">H: '+d.hi+'&deg; &nbsp; L: '+d.lo+'&deg;</div></div></div></div>'+
    '<div class="forecast">'+d.fc.map(f=>'<div class="day"><div class="day-name">'+f.d+'</div><div class="day-icon">'+f.i+'</div><div class="day-hi">'+f.h+'&deg;</div><div class="day-lo">'+f.l+'&deg;</div></div>').join('')+'</div>'+
    '<div class="details">'+
    '<div class="detail"><div class="detail-l">Humidity</div><div class="detail-v">'+d.hum+'<span class="detail-u">%</span></div></div>'+
    '<div class="detail"><div class="detail-l">Wind Speed</div><div class="detail-v">'+d.wind+'<span class="detail-u">km/h</span></div></div>'+
    '<div class="detail"><div class="detail-l">Visibility</div><div class="detail-v">'+d.vis+'<span class="detail-u">km</span></div></div>'+
    '<div class="detail"><div class="detail-l">UV Index</div><div class="detail-v">'+d.uv+'<span class="detail-u">/10</span></div></div>'+
    '</div>';
}
load();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// MUSIC PLAYER UI
// ─────────────────────────────────────────────────────────────────────────────

const MUSIC = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Music Player</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.player{width:100%;max-width:400px}
.album{width:100%;aspect-ratio:1;border-radius:20px;margin-bottom:28px;position:relative;overflow:hidden;
       box-shadow:0 24px 60px rgba(0,0,0,.6)}
.album-art{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;
           transition:background .5s}
.track-info{margin-bottom:20px}
.track-name{font-size:22px;font-weight:700;letter-spacing:-.01em;margin-bottom:4px}
.artist{color:rgba(255,255,255,.45);font-size:15px}
.progress-wrap{margin-bottom:20px}
.bar{height:4px;background:rgba(255,255,255,.12);border-radius:4px;cursor:pointer;position:relative;margin-bottom:8px}
.fill{height:100%;background:#0052FF;border-radius:4px;position:relative;transition:width .1s linear}
.fill::after{content:'';width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;
             right:-7px;top:-5px;box-shadow:0 0 0 3px rgba(0,82,255,.3)}
.times{display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.3);font-variant-numeric:tabular-nums}
.controls{display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px}
.ctrl{background:transparent;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:22px;
      transition:all .2s;padding:8px;border-radius:50%;display:flex}
.ctrl:hover{color:#fff;background:rgba(255,255,255,.08)}
.play{background:#0052FF;color:#fff;width:64px;height:64px;border-radius:50%;font-size:26px;
      border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.play:hover{background:#0040cc;transform:scale(1.06)}
.play:active{transform:scale(.96)}
.volume{display:flex;align-items:center;gap:12px;margin-bottom:24px}
.vol-icon{color:rgba(255,255,255,.4);font-size:16px}
input[type=range]{flex:1;-webkit-appearance:none;height:4px;background:rgba(255,255,255,.12);border-radius:4px;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer}
.playlist{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden}
.pl-item{display:flex;align-items:center;gap:14px;padding:12px 16px;cursor:pointer;transition:background .15s}
.pl-item:hover{background:rgba(255,255,255,.06)}
.pl-item.active{background:rgba(0,82,255,.12)}
.pl-num{font-size:13px;color:rgba(255,255,255,.25);width:20px;text-align:center;font-variant-numeric:tabular-nums}
.pl-info{flex:1}
.pl-name{font-size:14px;font-weight:500}
.pl-artist{font-size:12px;color:rgba(255,255,255,.35);margin-top:2px}
.pl-dur{font-size:12px;color:rgba(255,255,255,.3);font-variant-numeric:tabular-nums}
</style>
</head>
<body>
<div class="player">
  <div class="album"><div class="album-art" id="art">&#127911;</div></div>
  <div class="track-info"><div class="track-name" id="tname"></div><div class="artist" id="tartist"></div></div>
  <div class="progress-wrap">
    <div class="bar" id="bar" onclick="seek(event)"><div class="fill" id="fill" style="width:0%"></div></div>
    <div class="times"><span id="cur">0:00</span><span id="dur">0:00</span></div>
  </div>
  <div class="controls">
    <button class="ctrl" onclick="prev()" title="Previous">&#9664;&#9664;</button>
    <button class="play" id="playBtn" onclick="togglePlay()">&#9654;</button>
    <button class="ctrl" onclick="next()" title="Next">&#9654;&#9654;</button>
  </div>
  <div class="volume"><span class="vol-icon">&#128264;</span><input type="range" id="vol" value="70" oninput=""></div>
  <div class="playlist" id="pl"></div>
</div>
<script>
const TRACKS=[
  {name:"Midnight Drive",artist:"Neon Echo",dur:213,grad:"linear-gradient(135deg,#1a0040,#0052FF)",emoji:"&#127769;"},
  {name:"Golden Hour",artist:"Solar Drifts",dur:187,grad:"linear-gradient(135deg,#7c2d00,#f59e0b)",emoji:"&#9728;"},
  {name:"Ocean Waves",artist:"Blue Mirage",dur:245,grad:"linear-gradient(135deg,#003366,#06b6d4)",emoji:"&#127754;"},
  {name:"City Lights",artist:"Urban Pulse",dur:198,grad:"linear-gradient(135deg,#1a1a2e,#e94560)",emoji:"&#127749;"},
  {name:"Forest Rain",artist:"Ambient Woods",dur:231,grad:"linear-gradient(135deg,#0d1f0d,#22c55e)",emoji:"&#127795;"},
];
let idx=0,playing=false,elapsed=0,iv=null;
function fmt(s){return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60;}
function load(){
  const t=TRACKS[idx];
  document.getElementById('tname').textContent=t.name;
  document.getElementById('tartist').textContent=t.artist;
  document.getElementById('art').style.background=t.grad;
  document.getElementById('art').innerHTML=t.emoji;
  document.getElementById('dur').textContent=fmt(t.dur);
  document.getElementById('fill').style.width=(elapsed/t.dur*100)+'%';
  document.getElementById('cur').textContent=fmt(elapsed);
  document.querySelectorAll('.pl-item').forEach((el,i)=>el.classList.toggle('active',i===idx));
}
function renderPl(){
  document.getElementById('pl').innerHTML=TRACKS.map((t,i)=>
    '<div class="pl-item'+(i===idx?' active':'')+'" onclick="jumpTo('+i+')">'+
    '<div class="pl-num">'+(i+1)+'</div><div class="pl-info"><div class="pl-name">'+t.name+'</div><div class="pl-artist">'+t.artist+'</div></div>'+
    '<div class="pl-dur">'+fmt(t.dur)+'</div></div>').join('');
}
function tick(){elapsed=Math.min(elapsed+1,TRACKS[idx].dur);if(elapsed>=TRACKS[idx].dur){next();return;}load();}
function togglePlay(){
  playing=!playing;
  document.getElementById('playBtn').innerHTML=playing?'&#9646;&#9646;':'&#9654;';
  if(playing)iv=setInterval(tick,1000);else clearInterval(iv);
}
function prev(){elapsed=0;idx=(idx-1+TRACKS.length)%TRACKS.length;load();renderPl();}
function next(){elapsed=0;idx=(idx+1)%TRACKS.length;load();renderPl();}
function jumpTo(i){idx=i;elapsed=0;load();renderPl();if(!playing)togglePlay();}
function seek(e){const r=e.currentTarget.getBoundingClientRect();elapsed=Math.round((e.clientX-r.left)/r.width*TRACKS[idx].dur);load();}
renderPl();load();
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

const DASHBOARD = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;padding:32px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
h1{font-size:24px;font-weight:800;letter-spacing:-.02em}
.date{color:rgba(255,255,255,.35);font-size:14px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.kpi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px}
.kpi-l{font-size:12px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}
.kpi-v{font-size:36px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.kpi-t{font-size:13px;font-weight:600}
.up{color:#22c55e}.down{color:#ef4444}
.grid2{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px}
.panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px}
.panel h3{font-size:15px;font-weight:700;margin-bottom:20px}
canvas{width:100%;height:180px}
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:160px}
.bc{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
.bv{background:#0052FF;border-radius:6px 6px 0 0;width:100%;transition:height .3s;min-height:4px}
.bl{font-size:11px;color:rgba(255,255,255,.3)}
.rows{display:flex;flex-direction:column;gap:10px}
.row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.row:last-child{border:none}
.row-n{font-size:14px;font-weight:500}
.row-s{font-size:12px;color:rgba(255,255,255,.35);margin-top:2px}
.row-v{font-size:14px;font-weight:700;color:#0052FF}
.status{width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0}
</style>
</head>
<body>
<div class="header">
  <h1>Analytics Dashboard</h1>
  <div class="date" id="d"></div>
</div>
<div class="kpis">
  <div class="kpi"><div class="kpi-l">Total Revenue</div><div class="kpi-v">$84,230</div><div class="kpi-t up">+12.5% this month</div></div>
  <div class="kpi"><div class="kpi-l">Active Users</div><div class="kpi-v">12,847</div><div class="kpi-t up">+8.3% this week</div></div>
  <div class="kpi"><div class="kpi-l">Conversion Rate</div><div class="kpi-v">3.24%</div><div class="kpi-t down">-0.4% vs last month</div></div>
  <div class="kpi"><div class="kpi-l">Avg Session</div><div class="kpi-v">4m 32s</div><div class="kpi-t up">+22s vs last week</div></div>
</div>
<div class="grid2">
  <div class="panel">
    <h3>Weekly Revenue</h3>
    <div class="bar-chart" id="bc"></div>
  </div>
  <div class="panel">
    <h3>Top Pages</h3>
    <div class="rows">
      <div class="row"><div><div class="row-n">Homepage</div><div class="row-s">24,832 views</div></div><div class="row-v">38%</div></div>
      <div class="row"><div><div class="row-n">Pricing</div><div class="row-s">12,104 views</div></div><div class="row-v">19%</div></div>
      <div class="row"><div><div class="row-n">Features</div><div class="row-s">9,841 views</div></div><div class="row-v">15%</div></div>
      <div class="row"><div><div class="row-n">Blog</div><div class="row-s">7,230 views</div></div><div class="row-v">11%</div></div>
      <div class="row"><div><div class="row-n">Docs</div><div class="row-s">5,991 views</div></div><div class="row-v">9%</div></div>
    </div>
  </div>
</div>
<div class="panel">
  <h3>Recent Activity</h3>
  <div class="rows">
    <div class="row"><div style="display:flex;align-items:center;gap:10px"><div class="status"></div><div><div class="row-n">New enterprise signup — Acme Corp</div><div class="row-s">2 minutes ago</div></div></div><div class="row-v">+$1,200/mo</div></div>
    <div class="row"><div style="display:flex;align-items:center;gap:10px"><div class="status"></div><div><div class="row-n">Stripe payment processed successfully</div><div class="row-s">14 minutes ago</div></div></div><div class="row-v">$349</div></div>
    <div class="row"><div style="display:flex;align-items:center;gap:10px"><div class="status" style="background:#f59e0b"></div><div><div class="row-n">Server response time spike detected</div><div class="row-s">1 hour ago</div></div></div><div class="row-v" style="color:#f59e0b">Warning</div></div>
    <div class="row"><div style="display:flex;align-items:center;gap:10px"><div class="status"></div><div><div class="row-n">Deployment completed — v2.4.1</div><div class="row-s">3 hours ago</div></div></div><div class="row-v" style="color:#22c55e">Success</div></div>
  </div>
</div>
<script>
document.getElementById('d').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const vals=[42,61,38,74,56,88,65];const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];const max=Math.max(...vals);
document.getElementById('bc').innerHTML=vals.map((v,i)=>'<div class="bc"><div class="bv" style="height:'+(v/max*140)+'px;'+(i===5?'background:#22c55e':'')+'"></div><div class="bl">'+days[i]+'</div></div>').join('');
</script>
</body>
</html>`;
