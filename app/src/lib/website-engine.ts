// Unified build engine: handles any "build X" request.
// Replaces the old template-fill approach with full AI code generation.

import type { BuildStyle } from "./build-styles";

// ── Detection ─────────────────────────────────────────────────────────────

const BUILD_KEYWORDS = [
  // English: generic build intent
  "build me a", "create me a", "make me a", "generate me a",
  "build me an", "create me an", "make me an",
  "build a ", "create a ", "make a ", "generate a ",
  "build an ", "create an ", "make an ",
  // English: specific types
  "build a website", "create a website", "make a website",
  "build a landing", "create a landing", "make a landing",
  "build a dashboard", "create a dashboard", "make a dashboard",
  "build a calculator", "create a calculator", "make a calculator",
  "build a game", "create a game", "make a game",
  "build a todo", "create a todo", "make a todo",
  "build a timer", "create a timer", "make a timer",
  "build a quiz", "create a quiz", "make a quiz",
  "build a form", "create a form", "make a form",
  "build a portfolio", "create a portfolio", "make a portfolio",
  "build a clock", "create a clock",
  "build a tool", "create a tool",
  "build a chat", "create a chat",
  "build a calendar", "create a calendar",
  "build a weather", "create a weather",
  "build a music", "create a music",
  "build a app", "create a app", "make a app",
  "create homepage", "build homepage",
  "create a site", "build a site", "make a site",
  "create a page", "build a page", "make a page",
];

export function isBuildRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return BUILD_KEYWORDS.some((kw) => lower.includes(kw));
}

// Keep old name as alias so any lingering imports still work
export { isBuildRequest as isWebsiteRequest };

// ── Type-specific structural blueprints ───────────────────────────────────

function getStructuralBlueprint(userRequest: string): string {
  const lower = userRequest.toLowerCase();

  if (lower.includes("calculator")) {
    return `Structure: a calculator app.
- Full-screen dark panel, vertically centered.
- Display area at top: large right-aligned number (font-size 3rem+), secondary row showing the expression, rounded-2xl panel.
- Button grid below: 5 rows x 4 columns using CSS grid, gap 8px.
- Row 1: AC, +/-, %, /
- Row 2: 7, 8, 9, x
- Row 3: 4, 5, 6, -
- Row 4: 1, 2, 3, +
- Row 5: 0 (spans 2 cols), ., =
- Operator buttons (/, x, -, +, =) use the accent color. = button is highlighted.
- Number buttons are darker. All buttons rounded-2xl, min 64px tall, font-size 1.3rem.
- JS: full arithmetic logic with decimal support, chained operations, AC clears all.`;
  }

  if (lower.includes("todo") || lower.includes("task")) {
    return `Structure: a todo / task manager app.
- Header with app title and total task count badge.
- Input row: text input + "Add" button side by side.
- Filter tabs: All, Active, Completed.
- Task list: each item has a checkbox, task text, and delete button. Completed tasks show strikethrough.
- Footer: "X tasks left" count + "Clear completed" button.
- JS: add/complete/delete tasks, filter, persist in localStorage.`;
  }

  if (lower.includes("timer") || lower.includes("stopwatch") || lower.includes("countdown")) {
    return `Structure: a timer/stopwatch app.
- Large centered time display (HH:MM:SS.ms) in monospace font, font-size 4rem+.
- Control buttons: Start/Pause, Reset, and Lap (for stopwatch).
- Lap list below showing each lap time and split.
- JS: accurate interval-based timing, format with leading zeros.`;
  }

  if (lower.includes("quiz") || lower.includes("trivia")) {
    return `Structure: a quiz app.
- Progress bar at top showing question number.
- Question card in center with large question text.
- 4 answer option buttons in a 2x2 grid. On click: highlight correct (green) and wrong (red).
- Score display and "Next" button appear after answering.
- Final score screen at the end with "Play Again" button.
- JS: 5+ built-in questions, score tracking, randomize options.`;
  }

  if (lower.includes("clock") || lower.includes("analog")) {
    return `Structure: an analog + digital clock.
- Large analog clock face (SVG circle, tick marks, hour/minute/second hands).
- Digital time display below in large monospace text.
- Current date shown below.
- JS: update every second using setInterval and Date().`;
  }

  if (lower.includes("weather")) {
    return `Structure: a weather dashboard (mock data, no API needed).
- City name header with search input.
- Main weather card: large temperature, weather icon (CSS/SVG), condition label.
- 5-day forecast row with day name, icon, high/low temp.
- Details grid: humidity, wind speed, visibility, UV index.
- JS: use realistic mock data for multiple cities.`;
  }

  if (lower.includes("game")) {
    if (lower.includes("snake")) {
      return `Structure: Snake game.
- Canvas element 400x400px, centered.
- Score display above canvas.
- Arrow key controls. Game over screen with score and restart button.
- JS: requestAnimationFrame game loop, collision detection, food spawning.`;
    }
    if (lower.includes("tetris")) {
      return `Structure: Tetris game.
- Canvas 300x600px. Next piece preview panel. Score, level, lines display.
- JS: all 7 tetrominoes, rotation, line clearing, gravity, keyboard controls.`;
    }
    return `Structure: a browser mini-game.
- Canvas or DOM-based game area, centered.
- Score/lives display. Clear game state (playing/game over).
- JS: game loop with requestAnimationFrame, collision detection, keyboard/click controls, restart functionality.`;
  }

  if (lower.includes("dashboard")) {
    return `Structure: a data dashboard.
- Top header with title and date.
- 4 KPI stat cards in a row (number + label + trend indicator).
- Main chart area: bar chart or line chart drawn with SVG or Canvas.
- Side panel with a list of recent items or top entries.
- Use realistic mock data.`;
  }

  if (lower.includes("music") || lower.includes("player") || lower.includes("audio")) {
    return `Structure: a music player UI (no audio needed, just the interface).
- Album art area (colored gradient square).
- Track title and artist below.
- Progress bar that animates.
- Control buttons: Previous, Play/Pause, Next, Shuffle, Repeat.
- Volume slider.
- Playlist below with 5 mock tracks.`;
  }

  // Generic fallback
  return `Structure: a clean, fully functional single-page web app.
- Clear header with app title.
- Main content area with the core functionality.
- All interactive elements work via JavaScript.
- Responsive layout using flexbox or grid.`;
}

// ── Prompt builder ────────────────────────────────────────────────────────

export function buildBuildPrompt(userRequest: string, style: BuildStyle): string {
  const blueprint = getStructuralBlueprint(userRequest);
  return `You are a senior UI engineer. Build a complete, polished, fully functional single-file web app.

Request: "${userRequest}"

${blueprint}

Design theme: ${style.desc}

Coding rules:
- Vanilla HTML + CSS + JS only. Zero CDN links, zero imports, zero external resources.
- ONE file: all CSS in <style>, all JS in <script>.
- Follow the Structure above exactly. Do not skip sections or simplify the layout.
- Apply the design theme precisely: use the exact colors, fonts, and visual style described.
- Every button, input, and control must be wired up and functional.
- Hover and focus states on all interactive elements.
- Smooth CSS transitions on interactive elements.
- No placeholder text. Every element has real labels and real purpose.

Output ONLY raw HTML starting with <!DOCTYPE html>. No markdown, no fences, no explanation.`;
}

// ── HTML extraction ────────────────────────────────────────────────────────

export function extractHtmlFromResponse(raw: string): string {
  // Strip markdown fences if model wrapped output
  const fenceMatch = raw.match(/```(?:html)?\s*\n([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  // Find <!DOCTYPE html> block
  const doctypeIdx = raw.search(/<!DOCTYPE\s+html/i);
  if (doctypeIdx !== -1) return raw.slice(doctypeIdx).trim();

  // Find opening <html> tag
  const htmlIdx = raw.search(/<html[\s>]/i);
  if (htmlIdx !== -1) return raw.slice(htmlIdx).trim();

  return raw.trim();
}

// ── File ID embedding ──────────────────────────────────────────────────────

export function injectFileId(html: string, fileId: number): string {
  // Inject after the DOCTYPE declaration so isHtmlDoc still matches
  return html.replace(/(<!DOCTYPE\s+html[^>]*>)/i, `$1\n<!-- __LOCALOS_FILE_ID__=${fileId} -->`);
}

export function extractFileId(content: string): number | null {
  const match = content.match(/<!-- __LOCALOS_FILE_ID__=(\d+) -->/);
  return match ? parseInt(match[1], 10) : null;
}

// ── Filename generation ────────────────────────────────────────────────────

const TYPE_MAP: [string, string][] = [
  ["calculator", "calculator.html"],
  ["dashboard", "dashboard.html"],
  ["todo", "todo-app.html"],
  ["game", "game.html"],
  ["timer", "timer.html"],
  ["clock", "clock.html"],
  ["quiz", "quiz.html"],
  ["form", "form.html"],
  ["portfolio", "portfolio.html"],
  ["landing", "landing.html"],
  ["website", "website.html"],
  ["chat", "chat-app.html"],
  ["calendar", "calendar.html"],
  ["weather", "weather.html"],
  ["music", "music-player.html"],
  ["player", "player.html"],
  ["app", "app.html"],
  ["site", "site.html"],
];

export function generateFilename(userRequest: string): string {
  const lower = userRequest.toLowerCase();
  for (const [keyword, filename] of TYPE_MAP) {
    if (lower.includes(keyword)) return filename;
  }
  // Derive from meaningful words in the request
  const stopWords = new Set([
    "build", "create", "make", "generate", "me", "a", "an", "the",
  ]);
  const words = lower
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  return (words.slice(0, 2).join("-") || "app") + ".html";
}

// ── Website content generation (hybrid template + LLM) ────────────────────

export function buildWebsiteContentPrompt(userRequest: string): string {
  return `Generate website copy for: "${userRequest}"

Write ONLY these fields, one per line, as "KEY: value". No other text, no markdown, no explanations.

BRAND: product or brand name (1-3 words)
BADGE: short announcement text (4-6 words)
H1_PLAIN: hero headline opening (3-4 words)
H1_EM: hero headline accented closing (2-4 words, specific to the product)
HERO_P: one sentence description of the product (20-28 words)
BTN1: primary call to action (2-3 words)
BTN2: secondary button text (2-4 words)
FEAT_H2: features section headline (4-6 words)
FEAT_SUB: features section subheading (12-16 words)
F1T: feature 1 title (2-4 words)
F1D: feature 1 description (12-16 words)
F2T: feature 2 title
F2D: feature 2 description
F3T: feature 3 title
F3D: feature 3 description
F4T: feature 4 title
F4D: feature 4 description
F5T: feature 5 title
F5D: feature 5 description
F6T: feature 6 title
F6D: feature 6 description
STATS_H2: stats section headline (5-8 words)
S1N: stat 1 number (e.g. 10K+)
S1L: stat 1 label (2-4 words)
S2N: stat 2 number
S2L: stat 2 label
S3N: stat 3 number
S3L: stat 3 label
S4N: stat 4 number
S4L: stat 4 label
HOW_H2: how it works headline (4-6 words)
HOW_P: how it works subheading (12-16 words)
P1T: step 1 title (2-4 words)
P1D: step 1 description (12-16 words)
P2T: step 2 title
P2D: step 2 description
P3T: step 3 title
P3D: step 3 description
P4T: step 4 title
P4D: step 4 description
CTA_H: final call to action headline (6-8 words)
CTA_P: final call to action description (15-20 words)`;
}

export function parseWebsiteFields(response: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of response.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val && /^[A-Z0-9_]+$/.test(key)) {
      fields[key] = val;
    }
  }
  return fields;
}

// ── Streaming label ───────────────────────────────────────────────────────

export function guessBuildLabel(userRequest: string): string {
  const lower = userRequest.toLowerCase();
  if (lower.includes("dashboard")) return "Building dashboard...";
  if (lower.includes("calculator")) return "Building calculator...";
  if (lower.includes("game")) return "Building game...";
  if (lower.includes("todo")) return "Building todo app...";
  if (lower.includes("timer")) return "Building timer...";
  if (lower.includes("quiz")) return "Building quiz...";
  if (lower.includes("portfolio")) return "Building portfolio...";
  if (lower.includes("landing") || lower.includes("website") || lower.includes("site")) return "Building website...";
  return "Building app...";
}
