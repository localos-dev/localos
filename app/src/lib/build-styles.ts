// 30 random visual style seeds injected into code generation prompts.
// Picked randomly each time so generated apps never look the same.

export interface BuildStyle {
  name: string;
  desc: string;
}

export const BUILD_STYLES: BuildStyle[] = [
  {
    name: "midnight-blue",
    desc: "Dark deep-navy background (#050d1f), electric blue (#0052FF) primary accents, white text, clean Inter-style sans-serif, subtle glass-card surfaces with rgba white 5% fill",
  },
  {
    name: "terminal-green",
    desc: "Pure black background, bright matrix green (#00ff41) text and accents, monospace font throughout, subtle CRT scanline texture via repeating linear-gradient, blinking cursor elements",
  },
  {
    name: "glassmorphism-purple",
    desc: "Deep purple-to-indigo gradient background (#1a0533 to #0d0b33), frosted glass cards (backdrop-filter blur 20px, rgba white 10%), violet (#8b5cf6) accents, white text",
  },
  {
    name: "retro-80s",
    desc: "Very dark purple background (#120020), neon pink (#ff006e) and cyan (#00f5ff) accents, bold retro typography, grid lines, glowing text-shadow effects, synthwave aesthetic",
  },
  {
    name: "soft-warm",
    desc: "Warm cream/off-white background (#fff7ed), coral-orange (#f97316) accents, dark brown text, rounded-2xl cards with soft orange shadows, friendly approachable feel",
  },
  {
    name: "dark-gold",
    desc: "Deep navy background (#0a0f1e), gold (#fbbf24) primary accents, platinum text (#e2e8f0), elegant wide letter-spacing headings, thin gold border lines, premium luxury feel",
  },
  {
    name: "minimal-red",
    desc: "Pure white background, crisp black text, bold red (#ef4444) accents only on interactive elements, lots of whitespace, minimal decoration, sharp corners, ultra-clean",
  },
  {
    name: "cyber-cyan",
    desc: "Dark graphite background (#0a0e17), electric cyan (#06b6d4) accents, subtle grid-line background pattern via CSS, angular UI elements, tech-HUD aesthetic",
  },
  {
    name: "pastel-lavender",
    desc: "Very light lavender background (#f5f3ff), soft purple (#7c3aed) accents, dark gray text, extra-rounded corners (24px), soft box-shadows, gentle dreamy feel",
  },
  {
    name: "olive-lime",
    desc: "Dark olive background (#1a2010), lime green (#84cc16) accents, warm off-white text, earthy natural aesthetic, organic rounded shapes, nature-inspired",
  },
  {
    name: "neumorphism",
    desc: "Light gray background (#e0e5ec), same-color raised/inset shadows (box-shadow with light and dark gray), no bright colors, subtle depth effects, soft and tactile feel",
  },
  {
    name: "dark-rose",
    desc: "Very dark background (#1a0a0f), rose pink (#ec4899) primary accents, white text, gradient overlays blending dark-to-pink, romantic soft glow effects",
  },
  {
    name: "corporate-blue",
    desc: "White background, professional navy (#1e3a5f) and blue (#3b82f6) palette, crisp table borders, structured grid layouts, business-formal typography, high contrast",
  },
  {
    name: "dark-amber",
    desc: "Near-black background (#120d00), warm amber (#f59e0b) accents, warm white text, campfire/sunset warmth, slightly rough texture feel via subtle noise",
  },
  {
    name: "dark-glass",
    desc: "Deep dark background (#0a0f1a), frosted glass panels (rgba white 8%, border rgba white 12%, backdrop-filter blur 16px), blue (#0052FF) primary accent, white text, smooth rounded-2xl corners",
  },
  {
    name: "dark-teal",
    desc: "Dark slate background (#0f1f1f), teal-mint (#14b8a6) accents, cool white text, clean horizontal dividers, fresh clean technical look",
  },
  {
    name: "purple-gradient",
    desc: "Deep purple-to-blue gradient background (135deg, #1e0040 to #001a40), layered translucent surfaces, violet and blue accent mix, atmospheric depth",
  },
  {
    name: "fresh-mint",
    desc: "Light white-to-mint background (#f0fdf4), emerald green (#059669) accents, dark gray text, very clean fresh feel, natural and airy, generous padding",
  },
  {
    name: "graphite-silver",
    desc: "Dark graphite background (#111318), silver (#94a3b8) accents, cool neutral palette, no warm colors, industrial metallic aesthetic, precise clean lines",
  },
  {
    name: "newspaper",
    desc: "Aged paper background (#fdf6e3), dark sepia text (#3b2f1e), Georgia/serif fonts throughout, newspaper column layouts where applicable, classic editorial feel",
  },
  {
    name: "deep-indigo",
    desc: "Dark indigo background (#1e1b4b), medium-indigo (#6366f1) accents, lavender (#c7d2fe) secondary text, soft glow on accent elements, night-sky feel",
  },
  {
    name: "sunshine-yellow",
    desc: "Bright white background, sunshine yellow (#eab308) accents and highlights, black text, cheerful energetic feel, rounded shapes, playful but clean",
  },
  {
    name: "dark-crimson",
    desc: "Very dark background (#0f0505), crimson red (#dc2626) accents, white text, bold dramatic contrasts, strong visual hierarchy, intense urgent feel",
  },
  {
    name: "snow-minimal",
    desc: "Pure white background (#ffffff), zero decorative elements, black text only, single accent in light gray (#d1d5db), extreme whitespace, zen minimal design",
  },
  {
    name: "forest-dark",
    desc: "Deep forest green background (#0d1f0d), bright green (#22c55e) accents, warm white text, organic leaf-curve border-radius, rich earthy nature palette",
  },
  {
    name: "sky-airy",
    desc: "Very light sky background (#f0f9ff), azure blue (#0ea5e9) accents, dark navy text, airy open layouts, cloud-soft shadows, light and breathable feel",
  },
  {
    name: "slate-muted",
    desc: "Dark slate background (#1e2433), muted zinc (#71717a) accents, cool light text, understated no-frills design, maximum readability, developer-tool aesthetic",
  },
  {
    name: "holographic",
    desc: "Dark background (#0a0a0a), rainbow holographic gradient on accent elements (linear-gradient cycling hue 0-360deg), animated gradient borders, futuristic iridescent feel",
  },
  {
    name: "zen-black",
    desc: "Pure black background (#000000), white text only, zero color accents, ultra-minimal, maximum contrast, typographic focus, bauhaus-inspired restraint",
  },
  {
    name: "coral-sunset",
    desc: "Warm coral-to-orange sunset gradient background (#ff6b6b to #ffa500), white text, dark coral accents, vibrant and energetic, summer tropical feel",
  },
];

export function randomBuildStyle(): BuildStyle {
  return BUILD_STYLES[Math.floor(Math.random() * BUILD_STYLES.length)];
}
