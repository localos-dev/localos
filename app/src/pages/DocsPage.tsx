import { useState, useMemo, useEffect, useRef } from "react";

// ── Theme ──────────────────────────────────────────────────────────────────

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vite-ui-theme", next ? "dark" : "light");
    setDark(next);
  };
  return { dark, toggle };
}

// ── Types ──────────────────────────────────────────────────────────────────

type Block =
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "h3"; v: string }
  | { t: "code"; lang: string; v: string }
  | { t: "note"; kind: "info" | "warn" | "tip"; v: string }
  | { t: "list"; items: string[] }
  | { t: "table"; headers: string[]; rows: string[][] }
  | { t: "endpoint"; method: "GET" | "POST" | "PATCH" | "DELETE"; path: string; desc: string; body?: string; response?: string }
  | { t: "visual"; id: string };

interface DocPage {
  id: string;
  title: string;
  subtitle: string;
  blocks: Block[];
}

interface DocSection {
  id: string;
  label: string;
  pages: DocPage[];
}

// ── Content ────────────────────────────────────────────────────────────────

const DOCS: DocSection[] = [
  {
    id: "get-started",
    label: "Get Started",
    pages: [
      {
        id: "introduction",
        title: "Introduction",
        subtitle: "What LocalOS is and why it exists.",
        blocks: [
          { t: "p", v: "LocalOS is a self-hosted local AI operating system. It lets you chat with language models, manage projects, write code, and build your knowledge base entirely on your own hardware with no cloud dependency." },
          { t: "p", v: "All data lives in a single SQLite file on disk. No account required, no API key required, no internet required after first setup." },
          { t: "h2", v: "Key features" },
          { t: "list", items: [
            "Chat with any LLM runtime model including Llama, Mistral, Gemma, Phi, Qwen, and more",
            "Three-panel workspace: projects, chat or code editor, and context panel",
            "SQLite database with zero setup and WAL mode for concurrent reads",
            "SSE-based streaming chat so responses appear token by token",
            "Monaco code editor with syntax highlighting for 20 languages",
            "Knowledge base and file tree per project",
            "Full dark and light mode",
            "Boot sequence that checks backend, database, and LLM runtime before you start",
          ]},
          { t: "h2", v: "Technology stack" },
          { t: "table", headers: ["Layer", "Technology"], rows: [
            ["Frontend", "React 18, Vite, Tailwind CSS, Framer Motion, Wouter"],
            ["Backend", "Express 5, TypeScript, ESBuild"],
            ["Database", "SQLite via better-sqlite3 and Drizzle ORM"],
            ["AI", "Ollama at localhost:11434"],
            ["API contracts", "OpenAPI 3.1 spec with Orval codegen for React Query hooks and Zod schemas"],
            ["Monorepo", "pnpm workspaces, Node.js 24"],
          ]},
          { t: "visual", id: "tech-stack" },
          { t: "note", kind: "info", v: "LocalOS is local-first by design. It runs entirely offline once models are downloaded. The LLM runtime connection is optional. If it is not running, LocalOS enters Demo Mode and simulates a response." },
        ],
      },
      {
        id: "how-it-works",
        title: "How LocalOS works",
        subtitle: "Architecture overview from boot to chat.",
        blocks: [
          { t: "h2", v: "Boot sequence" },
          { t: "p", v: "When you open the app at /app, a boot sequence runs before you enter the workspace. It checks four services in order:" },
          { t: "list", items: [
            "Backend: verifies the Express API server is reachable at /api/healthz",
            "Database: confirms the SQLite file is initialized and tables are present",
            "LLM runtime: pings localhost:11434 to check if the runtime is active",
            "Storage: verifies the projects root directory is readable",
          ]},
          { t: "visual", id: "boot-sequence" },
          { t: "p", v: "If all four pass, you enter the workspace. If the LLM runtime is not running, LocalOS proceeds in Demo Mode." },
          { t: "h2", v: "Three-panel workspace" },
          { t: "p", v: "The main workspace is a resizable three-panel layout:" },
          { t: "list", items: [
            "Left panel: project selector and chat history, resizable from 200px to 400px",
            "Center panel: switches between Chat view, Code Editor view, and Web Preview",
            "Right panel: project info, file tree, model selector, and knowledge base",
          ]},
          { t: "visual", id: "three-panel" },
          { t: "h2", v: "Chat and streaming" },
          { t: "p", v: "When you send a message, the frontend posts to POST /api/chat/stream. The server opens a connection to the LLM runtime and forwards the response as Server-Sent Events. Each event is a raw token. The frontend accumulates tokens and renders them as they arrive." },
          { t: "h2", v: "Database" },
          { t: "p", v: "All data is stored in a SQLite file at ./localos.db by default. Tables are created automatically on first boot with CREATE TABLE IF NOT EXISTS and no migration runner is needed." },
          { t: "code", lang: "text", v: "Tables:\n  projects       name, description, color, timestamps\n  chats          title, model, project FK, timestamps\n  messages       role, content, chat FK, timestamp\n  files          name, path, content, language, project FK\n  knowledge_docs name, content, type, size, project FK" },
        ],
      },
      {
        id: "requirements",
        title: "System requirements",
        subtitle: "Hardware and software needed to run LocalOS.",
        blocks: [
          { t: "h2", v: "Software" },
          { t: "table", headers: ["Requirement", "Minimum", "Notes"], rows: [
            ["Node.js", "24.x", "Required. pnpm is used for package management."],
            ["pnpm", "9.x", "Install via npm install -g pnpm"],
            ["Git", "Any recent version", "For cloning the repository"],
            ["LLM runtime", "Latest Ollama", "Optional. Required for real AI responses. Not needed for Demo Mode."],
          ]},
          { t: "h2", v: "Hardware" },
          { t: "p", v: "Hardware requirements depend on which model you want to run:" },
          { t: "table", headers: ["Model size", "RAM needed", "Example models"], rows: [
            ["1B to 3B", "4 GB RAM", "Phi-3 Mini, Gemma 2B, Qwen2.5 3B"],
            ["7B to 8B", "8 GB RAM", "Llama 3.1 8B, Mistral 7B, Qwen2 7B"],
            ["13B to 14B", "16 GB RAM", "Llama 2 13B, Phi-3 Medium"],
            ["70B", "40 GB RAM or GPU VRAM", "Llama 3.1 70B"],
          ]},
          { t: "note", kind: "tip", v: "If you have an Apple Silicon Mac, Ollama uses Metal acceleration automatically. Models run faster and require less RAM than on CPU-only machines." },
          { t: "h2", v: "Operating systems" },
          { t: "list", items: [
            "macOS 13 or later (Intel and Apple Silicon)",
            "Linux: Ubuntu 22.04 or later, Fedora 38 or later",
            "Windows via WSL2 with Ubuntu 22.04 inside WSL2",
          ]},
        ],
      },
      {
        id: "installation",
        title: "Install and first run",
        subtitle: "Open a browser tab, download a model, disconnect. That is the entire setup.",
        blocks: [
          { t: "note", kind: "info", v: "There is nothing to install. LocalOS runs entirely in your browser. No terminal, no package manager, no account. Internet is only needed once: to download a model the first time." },
          { t: "visual", id: "install-flow" },
          { t: "h2", v: "Step 1. Open the app" },
          { t: "p", v: "Navigate to localos.xyz/app in your browser. The app loads instantly and runs entirely on your device. No installation, no terminal, no package manager needed." },
          { t: "p", v: "Works on any modern browser on Mac, Windows, or Linux." },
          { t: "h2", v: "Step 2. Download a model" },
          { t: "p", v: "While you still have internet access, open the Models page and pick a model to download. The download goes directly to your browser storage. This is the only step that needs a connection." },
          { t: "p", v: "Llama, Mistral, Gemma, Qwen, and more are all available. A 7B model takes a few minutes on a typical connection." },
          { t: "note", kind: "tip", v: "If you are unsure which model to pick, start with Llama 3.2 3B. It is about 2 GB, runs on any computer with 4 GB of RAM, and gives high quality responses for everyday tasks." },
          { t: "h2", v: "Step 3. Set up your workspace" },
          { t: "p", v: "Create a project, name it, and optionally add files or knowledge documents. Projects are stored locally in your browser. Nothing is sent anywhere." },
          { t: "p", v: "You can create as many projects as you like. Each gets its own chat history, file tree, and context." },
          { t: "h2", v: "Step 4. Turn off your internet" },
          { t: "p", v: "Once your model is downloaded, disconnect from the internet. Everything continues to work. Inference, chat, file access, and the full workspace run with zero network dependency." },
          { t: "p", v: "Air-gap compatible. Works in fully disconnected environments. No telemetry, no cloud calls." },
          { t: "h2", v: "For developers" },
          { t: "p", v: "If you want to run LocalOS from source or contribute to the codebase, see the Contributing section for full developer setup instructions." },
        ],
      },
      {
        id: "workspace",
        title: "Navigating the workspace",
        subtitle: "A tour of the three-panel layout.",
        blocks: [
          { t: "h2", v: "Left panel" },
          { t: "p", v: "The left panel shows your projects. Click a project to expand its chat history. Click any chat to open it in the center panel. Use the plus button to create a new project or start a new chat." },
          { t: "p", v: "The panel is resizable. Drag the right edge to adjust its width between 200px and 400px." },
          { t: "h2", v: "Center panel" },
          { t: "p", v: "The center panel has three views selectable via tabs at the top:" },
          { t: "list", items: [
            "Chat: conversation interface with streaming LLM responses",
            "Code Editor: Monaco editor with syntax highlighting for 20 languages",
            "Preview: live web preview for HTML and web projects",
          ]},
          { t: "h2", v: "Right panel" },
          { t: "p", v: "The right panel shows context for the current project:" },
          { t: "list", items: [
            "Project info: name, description, color tag",
            "File tree: all files in the project, click to open in the code editor",
            "Models: select which model to use for the current chat",
            "Knowledge base: documents you have attached to this project",
          ]},
          { t: "h2", v: "Keyboard shortcuts" },
          { t: "table", headers: ["Shortcut", "Action"], rows: [
            ["Enter", "Send message in chat"],
            ["Shift plus Enter", "New line in chat input"],
            ["Escape", "Close overlays and modals"],
          ]},
        ],
      },
      {
        id: "chat-basics",
        title: "Chat interface basics",
        subtitle: "How to have a conversation with a model.",
        blocks: [
          { t: "h2", v: "Starting a conversation" },
          { t: "p", v: "Select a project in the left panel, then click the plus button next to Chats to start a new chat. Type your first message in the text area at the bottom of the center panel and press Enter to send." },
          { t: "h2", v: "Selecting a model" },
          { t: "p", v: "Open the right panel and find the Models section. The dropdown shows all models you have downloaded from the LLM runtime. Select any model and it will be used for the next message you send." },
          { t: "p", v: "The selected model is saved with the chat. When you reopen a chat, the same model is pre-selected." },
          { t: "h2", v: "Reading streaming responses" },
          { t: "p", v: "Responses from the model stream in token by token. You can read as the model writes. The streaming comes from a Server-Sent Events connection to the backend which forwards tokens directly from the LLM runtime." },
          { t: "h2", v: "Chat history" },
          { t: "p", v: "All messages are saved to the SQLite database immediately. Your chat history persists across sessions. Click any past chat in the left panel to reopen it." },
          { t: "h2", v: "Demo Mode" },
          { t: "p", v: "If the LLM runtime is not running, LocalOS enters Demo Mode. A banner appears at the top of the chat view. Responses are simulated by the backend and clearly labeled as demo responses. No real model inference happens in Demo Mode." },
          { t: "note", kind: "info", v: "In the LocalOS environment, the LLM runtime is not available. Demo Mode is always active there. This is expected and lets you explore the full interface without running Ollama." },
        ],
      },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    pages: [
      {
        id: "env-vars",
        title: "Environment variables",
        subtitle: "All configuration is through environment variables.",
        blocks: [
          { t: "p", v: "LocalOS reads configuration from environment variables at startup. There are no config files to edit." },
          { t: "table", headers: ["Variable", "Default", "Description"], rows: [
            ["SESSION_SECRET", "(required)", "Secret for signing sessions. Set to a long random string. Required."],
            ["LOCALOS_DB_PATH", "./localos.db", "Path to the SQLite database file."],
            ["LOCALOS_PROJECTS_ROOT", "./projects", "Root directory for project files on disk."],
            ["PORT", "(assigned)", "Server port. Assigned automatically by LocalOS workflows."],
          ]},
          { t: "h2", v: "Setting variables in development" },
          { t: "code", lang: "bash", v: "export SESSION_SECRET=your-long-random-string\nexport LOCALOS_DB_PATH=/home/user/.localos/data.db" },
          { t: "note", kind: "warn", v: "Never commit SESSION_SECRET to version control. Add it to your environment secrets manager or a .env file listed in .gitignore." },
        ],
      },
      {
        id: "database",
        title: "Database location and path override",
        subtitle: "SQLite configuration and backup.",
        blocks: [
          { t: "p", v: "LocalOS uses SQLite via better-sqlite3 and Drizzle ORM. The database is a single file on disk." },
          { t: "h2", v: "Default path" },
          { t: "p", v: "By default, the database is created at ./localos.db relative to where the API server is started." },
          { t: "h2", v: "Override with LOCALOS_DB_PATH" },
          { t: "code", lang: "bash", v: "export LOCALOS_DB_PATH=/home/user/.localos/localos.db" },
          { t: "p", v: "The directory must exist before LocalOS starts. LocalOS creates the file but not the directory." },
          { t: "h2", v: "WAL mode" },
          { t: "p", v: "LocalOS enables WAL (Write-Ahead Logging) mode automatically. WAL allows concurrent reads while a write is in progress and makes most read operations faster." },
          { t: "h2", v: "Backup" },
          { t: "p", v: "To back up your data, stop the API server and copy both the .db file and the .db-wal file. Both files together form the complete database state." },
          { t: "code", lang: "bash", v: "# Stop the API server first, then:\ncp localos.db localos.db.bak\ncp localos.db-wal localos.db-wal.bak" },
        ],
      },
      {
        id: "projects-root",
        title: "Projects root directory",
        subtitle: "Where LocalOS stores project files on disk.",
        blocks: [
          { t: "p", v: "When you create or edit files inside a project, LocalOS writes them to a directory on disk under the projects root." },
          { t: "h2", v: "Default path" },
          { t: "p", v: "The default projects root is ./projects relative to the project root. This directory is created automatically if it does not exist." },
          { t: "h2", v: "Override" },
          { t: "code", lang: "bash", v: "export LOCALOS_PROJECTS_ROOT=/home/user/my-projects" },
          { t: "h2", v: "Directory structure" },
          { t: "code", lang: "text", v: "projects/\n  12/          project with id=12\n    main.py\n    README.md\n  34/          project with id=34\n    index.html\n    style.css" },
        ],
      },
      {
        id: "llm-runtime",
        title: "LLM runtime connection",
        subtitle: "Connecting LocalOS to Ollama.",
        blocks: [
          { t: "p", v: "LocalOS uses Ollama as its LLM runtime. Ollama must be running at http://localhost:11434 before LocalOS can use real models." },
          { t: "h2", v: "Installing Ollama" },
          { t: "code", lang: "bash", v: "# macOS\nbrew install ollama\n\n# Linux\ncurl -fsSL https://ollama.com/install.sh | sh\n\n# Start the server\nollama serve" },
          { t: "h2", v: "Downloading a model" },
          { t: "code", lang: "bash", v: "ollama pull llama3.2:3b" },
          { t: "p", v: "You can also download models directly from the Models page inside LocalOS once Ollama is connected." },
          { t: "h2", v: "Demo mode" },
          { t: "p", v: "If Ollama is not running when LocalOS starts, the status screen shows LLM runtime as not connected and LocalOS enters Demo Mode with simulated AI responses." },
          { t: "note", kind: "info", v: "In the LocalOS environment, Ollama is not available. The boot screen will always show the LLM runtime as not connected. This is expected." },
        ],
      },
      {
        id: "session-secret",
        title: "Session secret",
        subtitle: "Securing your LocalOS session.",
        blocks: [
          { t: "p", v: "SESSION_SECRET is used to sign and verify session cookies. It should be a long, random string kept private." },
          { t: "h2", v: "Generating a secret" },
          { t: "code", lang: "bash", v: "# Option 1: openssl\nopenssl rand -hex 32\n\n# Option 2: Node.js\nnode -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" },
          { t: "h2", v: "Setting the secret" },
          { t: "code", lang: "bash", v: "export SESSION_SECRET=a1b2c3d4e5f6...  # paste your generated value here" },
          { t: "note", kind: "warn", v: "If SESSION_SECRET is not set, the API server fails to start. This is intentional. Running without a session secret is insecure." },
          { t: "h2", v: "Rotating the secret" },
          { t: "p", v: "If you rotate SESSION_SECRET, all existing sessions are invalidated. Simply restart the API server with the new value." },
        ],
      },
    ],
  },
  {
    id: "models",
    label: "Models",
    pages: [
      {
        id: "models-overview",
        title: "Overview",
        subtitle: "How models work in LocalOS.",
        blocks: [
          { t: "p", v: "LocalOS uses Ollama to manage and run language models locally. All models run on your hardware. No data is sent to any server." },
          { t: "h2", v: "Model catalog" },
          { t: "p", v: "LocalOS includes a curated catalog of supported models. The catalog shows the model name, size, context window, and a short description. You can download and delete models directly from the Models page." },
          { t: "h2", v: "Selecting a model for a chat" },
          { t: "p", v: "Each chat remembers which model was selected. Open the right panel and select a different model from the dropdown. The next message will use the new model." },
          { t: "h2", v: "Storage" },
          { t: "p", v: "Models are stored by Ollama in ~/.ollama/models on macOS and Linux. A 7B model takes 4 to 5 GB of disk space. A 70B model takes 40 GB or more." },
          { t: "table", headers: ["Model family", "Strengths", "Context window"], rows: [
            ["Llama by Meta", "General purpose, reasoning, code", "8K to 128K tokens"],
            ["Mistral AI", "Fast inference, strong multilingual", "8K to 32K tokens"],
            ["Gemma by Google", "Lightweight, efficient on low RAM", "8K tokens"],
            ["Phi by Microsoft", "Tiny but capable, great for low RAM", "4K to 128K tokens"],
            ["Qwen by Alibaba", "Strong multilingual and code", "32K to 128K tokens"],
            ["Hermes by NousResearch", "Agent and tool-use workflows", "8K to 128K tokens"],
          ]},
          { t: "visual", id: "model-grid" },
        ],
      },
      {
        id: "llama",
        title: "Llama by Meta",
        subtitle: "Meta's open-weight language model family.",
        blocks: [
          { t: "p", v: "Llama is Meta's family of open-weight language models. Llama 3.1 and 3.2 are the most capable versions with context windows up to 128K tokens." },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Best for"], rows: [
            ["llama3.2:1b", "1.3 GB", "4 GB", "Fast responses on low RAM machines"],
            ["llama3.2:3b", "2.0 GB", "4 GB", "Best balance of speed and quality for most tasks"],
            ["llama3.1:8b", "4.7 GB", "8 GB", "High quality general purpose and coding"],
            ["llama3.1:70b", "40 GB", "40 GB RAM or GPU", "Maximum quality, requires powerful hardware"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull llama3.2:3b" },
          { t: "note", kind: "tip", v: "Llama 3.2 3B is the recommended starting model for most machines. It is fast, small, and produces high quality responses for everyday tasks." },
        ],
      },
      {
        id: "mistral",
        title: "Mistral AI",
        subtitle: "Fast European models with strong multilingual support.",
        blocks: [
          { t: "p", v: "Mistral AI models are known for fast inference and strong performance relative to their size. They excel at instruction following and European languages." },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Notes"], rows: [
            ["mistral:7b", "4.1 GB", "8 GB", "Excellent general purpose performance"],
            ["mistral-nemo:12b", "7.1 GB", "16 GB", "Updated architecture, stronger coding"],
            ["mixtral:8x7b", "26 GB", "32 GB", "Mixture-of-experts, very high quality"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull mistral:7b" },
        ],
      },
      {
        id: "gemma",
        title: "Gemma by Google",
        subtitle: "Lightweight models from Google DeepMind.",
        blocks: [
          { t: "p", v: "Gemma models are designed to be efficient and run well on machines with limited RAM. Gemma 2 is significantly better than Gemma 1." },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Notes"], rows: [
            ["gemma2:2b", "1.6 GB", "4 GB", "Extremely fast, good for simple tasks"],
            ["gemma2:9b", "5.5 GB", "8 GB", "Strong all-around performance"],
            ["gemma2:27b", "16 GB", "24 GB", "High quality, closest to frontier models"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull gemma2:9b" },
        ],
      },
      {
        id: "qwen",
        title: "Qwen",
        subtitle: "Strong multilingual and code models from Alibaba.",
        blocks: [
          { t: "p", v: "Qwen2 and Qwen2.5 are strong general-purpose models with excellent multilingual capabilities and very long context windows." },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Notes"], rows: [
            ["qwen2.5:3b", "1.9 GB", "4 GB", "Fast and capable for everyday tasks"],
            ["qwen2.5:7b", "4.7 GB", "8 GB", "Strong code and reasoning"],
            ["qwen2.5:14b", "9.0 GB", "16 GB", "High quality, long context"],
            ["qwen2.5-coder:7b", "4.7 GB", "8 GB", "Specialized for code generation"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull qwen2.5:7b" },
        ],
      },
      {
        id: "phi",
        title: "Phi by Microsoft",
        subtitle: "Small models that punch above their weight.",
        blocks: [
          { t: "p", v: "Microsoft's Phi series focuses on training efficiency. Phi-3 and Phi-4 achieve quality comparable to much larger models, ideal for low-RAM machines." },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Notes"], rows: [
            ["phi4:14b", "8.9 GB", "16 GB", "Latest and most capable Phi model"],
            ["phi3.5:3.8b", "2.2 GB", "4 GB", "Great for coding tasks on limited hardware"],
            ["phi3:mini", "2.2 GB", "4 GB", "Optimized for speed, 128K context"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull phi4" },
        ],
      },
      {
        id: "hermes",
        title: "Hermes Agent",
        subtitle: "NousResearch models built for agent and tool-use workflows.",
        blocks: [
          { t: "p", v: "Hermes models from NousResearch are fine-tuned specifically for agentic tasks including structured output, tool calling, and multi-step reasoning. They follow instructions precisely and produce consistent JSON output." },
          { t: "h2", v: "Recommended variants" },
          { t: "table", headers: ["Model ID", "Size", "RAM needed", "Best for"], rows: [
            ["hermes3:8b", "4.7 GB", "8 GB", "General agent tasks and structured output"],
            ["hermes3:70b", "40 GB", "40 GB RAM or GPU", "Complex multi-step reasoning and tool use"],
          ]},
          { t: "code", lang: "bash", v: "ollama pull hermes3:8b" },
          { t: "h2", v: "When to use Hermes" },
          { t: "list", items: [
            "When you need the model to call tools or functions by name",
            "When you need strict JSON schema compliance in the response",
            "For multi-step tasks where the model needs to plan and execute",
            "For agentic workflows where the model must reason about state",
          ]},
          { t: "note", kind: "tip", v: "Hermes 3 8B is a strong starting point for agent work on machines with 8 GB RAM. It outperforms many larger models on structured output tasks." },
        ],
      },
      {
        id: "custom-models",
        title: "Using custom models",
        subtitle: "Run any model supported by the LLM runtime.",
        blocks: [
          { t: "p", v: "LocalOS supports any model that Ollama can run. If a model is not in the LocalOS catalog, you can still pull and use it directly through Ollama." },
          { t: "h2", v: "Pulling a model not in the catalog" },
          { t: "code", lang: "bash", v: "# Find models at https://ollama.com/library\nollama pull <model-name>\n\n# Examples:\nollama pull deepseek-r1:8b\nollama pull codellama:13b\nollama pull solar:10.7b" },
          { t: "p", v: "After pulling, the model will appear in the model selector inside the LocalOS workspace. Refresh the Models page if it does not appear immediately." },
          { t: "h2", v: "GGUF models" },
          { t: "p", v: "You can import any GGUF quantized model file directly into Ollama using a Modelfile:" },
          { t: "code", lang: "bash", v: "# Create a Modelfile\ncat > Modelfile << 'EOF'\nFROM /path/to/model.gguf\nEOF\n\n# Import it\nollama create my-custom-model -f Modelfile\n\n# Use it in LocalOS\nollama pull my-custom-model" },
          { t: "h2", v: "Adding a model to the LocalOS catalog" },
          { t: "p", v: "To add a model to the built-in catalog with a description and metadata, see Adding a new model in the Contributing section." },
        ],
      },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    pages: [
      {
        id: "api-overview",
        title: "Overview and base URL",
        subtitle: "Base URL, conventions, and error format.",
        blocks: [
          { t: "p", v: "All API routes are served under /api. The API is defined in lib/api-spec/openapi.yaml. React Query hooks and Zod validation schemas are generated from this spec using Orval." },
          { t: "h2", v: "Base URL" },
          { t: "code", lang: "text", v: "http://localhost:<PORT>/api" },
          { t: "visual", id: "api-flow" },
          { t: "h2", v: "Authentication" },
          { t: "p", v: "The current version of LocalOS does not require authentication. All routes are open." },
          { t: "h2", v: "Error format" },
          { t: "code", lang: "json", v: "{\n  \"error\": \"Project not found\"\n}" },
          { t: "h2", v: "Status codes" },
          { t: "table", headers: ["Code", "Meaning"], rows: [
            ["200", "Success"],
            ["201", "Created"],
            ["400", "Bad request: validation failed"],
            ["404", "Resource not found"],
            ["500", "Internal server error"],
          ]},
          { t: "h2", v: "Regenerating API hooks" },
          { t: "code", lang: "bash", v: "pnpm --filter @workspace/api-spec run codegen" },
        ],
      },
      {
        id: "api-health",
        title: "Health and status",
        subtitle: "Check if the backend and services are running.",
        blocks: [
          { t: "endpoint", method: "GET", path: "/api/healthz", desc: "Returns the health status of the backend, SQLite database, and LLM runtime.", response: "{\n  \"status\": \"ok\",\n  \"db\": true,\n  \"ollama\": false,\n  \"timestamp\": \"2025-01-01T00:00:00.000Z\"\n}" },
          { t: "p", v: "The ollama field is true only if the LLM runtime is reachable at localhost:11434. If it is false, LocalOS runs in Demo Mode." },
        ],
      },
      {
        id: "api-chat",
        title: "Chat and streaming",
        subtitle: "Send messages and receive streaming responses.",
        blocks: [
          { t: "endpoint", method: "POST", path: "/api/chat/stream", desc: "Streams a chat response as Server-Sent Events. Each event contains one token from the model.", body: "{\n  \"chatId\": 12,\n  \"message\": \"Explain recursion in simple terms\",\n  \"model\": \"llama3.2:3b\"\n}", response: "data: {\"token\": \"Recursion\"}\ndata: {\"token\": \" is\"}\n...\ndata: {\"done\": true}" },
          { t: "h2", v: "Reading the stream in TypeScript" },
          { t: "code", lang: "typescript", v: "const res = await fetch('/api/chat/stream', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ chatId, message, model }),\n});\n\nconst reader = res.body!.getReader();\nconst decoder = new TextDecoder();\n\nwhile (true) {\n  const { done, value } = await reader.read();\n  if (done) break;\n  const text = decoder.decode(value);\n  // parse SSE events and accumulate tokens\n}" },
          { t: "note", kind: "warn", v: "This endpoint does not use the Orval-generated hooks. SSE streaming requires a ReadableStream reader that React Query does not support." },
        ],
      },
      {
        id: "api-projects",
        title: "Projects",
        subtitle: "Create, read, update, and delete projects.",
        blocks: [
          { t: "endpoint", method: "GET", path: "/api/projects", desc: "List all projects with file and chat counts.", response: "[\n  {\n    \"id\": 1,\n    \"name\": \"My Project\",\n    \"description\": \"A short description\",\n    \"color\": \"#0052FF\",\n    \"createdAt\": \"2025-01-01T00:00:00.000Z\",\n    \"fileCount\": 3,\n    \"chatCount\": 2\n  }\n]" },
          { t: "endpoint", method: "POST", path: "/api/projects", desc: "Create a new project.", body: "{\n  \"name\": \"New Project\",\n  \"description\": \"Optional description\",\n  \"color\": \"#0052FF\"\n}" },
          { t: "endpoint", method: "GET", path: "/api/projects/:id", desc: "Get a single project by ID." },
          { t: "endpoint", method: "PATCH", path: "/api/projects/:id", desc: "Update a project's name, description, or color.", body: "{ \"name\": \"Renamed Project\" }" },
          { t: "endpoint", method: "DELETE", path: "/api/projects/:id", desc: "Delete a project and all its chats, messages, and files (cascade)." },
        ],
      },
      {
        id: "api-files",
        title: "Files",
        subtitle: "Manage project files.",
        blocks: [
          { t: "endpoint", method: "GET", path: "/api/projects/:id/files", desc: "List all files in a project." },
          { t: "endpoint", method: "POST", path: "/api/projects/:id/files", desc: "Create a new file in the project.", body: "{\n  \"name\": \"main.py\",\n  \"content\": \"print('hello')\",\n  \"language\": \"python\"\n}" },
          { t: "endpoint", method: "GET", path: "/api/projects/:id/files/:fileId", desc: "Get a file's full content." },
          { t: "endpoint", method: "PATCH", path: "/api/projects/:id/files/:fileId", desc: "Update a file's name or content.", body: "{ \"content\": \"print('updated')\" }" },
          { t: "endpoint", method: "DELETE", path: "/api/projects/:id/files/:fileId", desc: "Delete a file." },
        ],
      },
      {
        id: "api-models",
        title: "Models",
        subtitle: "List, pull, and delete LLM runtime models.",
        blocks: [
          { t: "endpoint", method: "GET", path: "/api/models", desc: "List all models from the LLM runtime catalog with download status." },
          { t: "endpoint", method: "POST", path: "/api/models/pull", desc: "Start downloading a model. Returns an SSE stream of progress events.", body: "{ \"model\": \"llama3.2:3b\" }" },
          { t: "endpoint", method: "DELETE", path: "/api/models/:name", desc: "Delete a downloaded model from the LLM runtime." },
        ],
      },
    ],
  },
  {
    id: "self-hosting",
    label: "Self-Hosting",
    pages: [
      {
        id: "local-network",
        title: "Running on a local network",
        subtitle: "Make LocalOS accessible to other devices on your network.",
        blocks: [
          { t: "p", v: "By default, LocalOS binds to localhost and is only accessible from the same machine. To expose it on your local network, bind the server to 0.0.0.0." },
          { t: "h2", v: "Bind to all interfaces" },
          { t: "code", lang: "typescript", v: "app.listen(port, '0.0.0.0', (err) => {\n  if (err) process.exit(1);\n  logger.info({ port }, 'LocalOS listening on all interfaces');\n});" },
          { t: "h2", v: "Finding your local IP" },
          { t: "code", lang: "bash", v: "# macOS\nipconfig getifaddr en0\n\n# Linux\nhostname -I | awk '{print $1}'" },
          { t: "note", kind: "warn", v: "Running LocalOS on a local network without authentication exposes your files to anyone on that network. Only do this on a trusted private network." },
        ],
      },
      {
        id: "nginx",
        title: "Reverse proxy with Nginx",
        subtitle: "Put Nginx in front of LocalOS for clean URLs and SSL.",
        blocks: [
          { t: "h2", v: "Basic Nginx config" },
          { t: "code", lang: "nginx", v: "server {\n    listen 80;\n    server_name localos.local;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_set_header Host $host;\n    }\n\n    location /api/ {\n        proxy_pass http://localhost:8080;\n        proxy_set_header Host $host;\n\n        # Required for SSE streaming\n        proxy_buffering off;\n        proxy_cache off;\n        proxy_set_header Connection '';\n        proxy_http_version 1.1;\n    }\n}" },
          { t: "note", kind: "warn", v: "The proxy_buffering off directive is required for SSE streaming. Without it, Nginx buffers the response and chat tokens do not appear until the buffer fills." },
        ],
      },
      {
        id: "https",
        title: "HTTPS setup",
        subtitle: "Enable encrypted connections to LocalOS.",
        blocks: [
          { t: "h2", v: "Local CA with mkcert" },
          { t: "code", lang: "bash", v: "# Install mkcert\nbrew install mkcert\n\n# Install the local CA\nmkcert -install\n\n# Generate a certificate\nmkcert localos.local 192.168.1.100" },
          { t: "h2", v: "Let's Encrypt for public access" },
          { t: "code", lang: "bash", v: "sudo certbot --nginx -d localos.example.com" },
        ],
      },
      {
        id: "updating",
        title: "Keeping LocalOS updated",
        subtitle: "Pull the latest changes and restart.",
        blocks: [
          { t: "code", lang: "bash", v: "git pull\npnpm install\npnpm --filter @workspace/api-server run dev\npnpm --filter @workspace/local-os run dev" },
          { t: "h2", v: "Database migrations" },
          { t: "p", v: "LocalOS uses CREATE TABLE IF NOT EXISTS for all tables, so new tables are created automatically on boot. Existing data is never dropped. No migration commands are needed." },
        ],
      },
    ],
  },
  {
    id: "contributing",
    label: "Contributing",
    pages: [
      {
        id: "project-structure",
        title: "Project structure",
        subtitle: "How the monorepo is organized.",
        blocks: [
          { t: "code", lang: "text", v: "localos/\n  \n    api-server/       Express 5 API server (esbuild CJS bundle)\n    local-os/         React + Vite frontend\n  lib/\n    api-spec/         OpenAPI spec (source of truth)\n    api-client-react/ Generated React Query hooks\n    api-zod/          Generated Zod validation schemas\n    db/               Drizzle ORM schema + SQLite init\n  scripts/            Shared utility scripts\n  pnpm-workspace.yaml\n  tsconfig.json       Solution file for composite libs only" },
          { t: "h2", v: "Key files" },
          { t: "table", headers: ["File", "Purpose"], rows: [
            ["lib/api-spec/openapi.yaml", "Source of truth for all API contracts. Edit this, then run codegen."],
            ["lib/db/src/schema/index.ts", "Drizzle ORM table definitions."],
            ["api-server/src/lib/localos-db.ts", "DB initialization, table creation, and seed data."],
            ["api-server/src/routes/", "Express route handlers, one file per resource."],
            ["app/src/pages/AppPage.tsx", "Boot sequence and three-panel workspace layout."],
            ["app/src/stores/appStore.ts", "Global UI state via Zustand."],
          ]},
        ],
      },
      {
        id: "dev-setup",
        title: "Development setup",
        subtitle: "Fork, clone, and start contributing.",
        blocks: [
          { t: "code", lang: "bash", v: "git clone https://github.com/localos-dev\ncd localos\npnpm install\npnpm --filter @workspace/api-server run dev\npnpm --filter @workspace/local-os run dev" },
          { t: "h2", v: "Type checking" },
          { t: "code", lang: "bash", v: "# Full check across all packages\npnpm run typecheck\n\n# Rebuild lib declarations after changing lib packages\npnpm run typecheck:libs" },
          { t: "h2", v: "After changing the OpenAPI spec" },
          { t: "code", lang: "bash", v: "pnpm --filter @workspace/api-spec run codegen" },
        ],
      },
      {
        id: "conventions",
        title: "Code conventions",
        subtitle: "Standards and rules for the LocalOS codebase.",
        blocks: [
          { t: "h2", v: "Logging" },
          { t: "p", v: "Never use console.log in server code. Use the pino logger:" },
          { t: "code", lang: "typescript", v: "// In route handlers\nreq.log.info({ projectId }, 'Created project');\n\n// Outside request context\nimport { logger } from '../lib/logger';\nlogger.info('Server started');" },
          { t: "h2", v: "No symbols in UI text" },
          { t: "p", v: "All user-facing text must be plain English with no emoji, arrows, checkmarks, em-dashes, or other non-alphanumeric decorative characters. Use words instead: Done not a checkmark, Connected not an arrow." },
          { t: "h2", v: "Never say Ollama in UI text" },
          { t: "p", v: "Use \"LLM runtime\" or \"LLM\" instead of \"Ollama\" in all user-facing strings." },
          { t: "h2", v: "Database" },
          { t: "list", items: [
            "SQLite only. LocalOS is local-first and does not use Postgres.",
            "All schema changes go in lib/db/src/schema/index.ts",
            "Tables are created with CREATE TABLE IF NOT EXISTS in localos-db.ts",
          ]},
        ],
      },
      {
        id: "pull-requests",
        title: "Submitting a pull request",
        subtitle: "How to get your changes merged.",
        blocks: [
          { t: "h2", v: "Branch naming" },
          { t: "code", lang: "text", v: "feat/add-knowledge-search\nfix/sidebar-scroll-bug\ndocs/update-api-reference" },
          { t: "h2", v: "Before opening a PR" },
          { t: "list", items: [
            "Run pnpm run typecheck and fix all errors",
            "Test the feature manually in the running app",
            "Ensure no console.log calls are left in server code",
            "Check that all new UI strings are in English with no symbols",
          ]},
          { t: "p", v: "Submit pull requests to the main branch at https://github.com/localos-dev." },
        ],
      },
      {
        id: "adding-model",
        title: "Adding a new model",
        subtitle: "How to add a model to the LocalOS catalog.",
        blocks: [
          { t: "p", v: "The model catalog is defined in the API server at api-server/src/lib/ollama.ts." },
          { t: "h2", v: "Adding an entry" },
          { t: "code", lang: "typescript", v: "{\n  id: 'qwen2.5-coder:7b',\n  name: 'Qwen 2.5 Coder 7B',\n  family: 'Qwen',\n  description: 'Specialized for code generation and debugging.',\n  size: '4.7 GB',\n  contextWindow: 32768,\n  capabilities: ['code', 'chat'],\n  ram: '8 GB',\n}" },
          { t: "h2", v: "Testing" },
          { t: "list", items: [
            "Add the entry to the catalog array in ollama.ts",
            "Restart the API server",
            "Open the Models page and confirm the new model appears",
            "If Ollama is running, test the download flow",
          ]},
        ],
      },
    ],
  },
];

// User-facing vs developer sections
const USER_SECTION_IDS = new Set(["get-started", "models"]);
const USER_DOCS = DOCS.filter((s) => USER_SECTION_IDS.has(s.id));
const DEV_DOCS  = DOCS.filter((s) => !USER_SECTION_IDS.has(s.id));
const ALL_DOCS  = DOCS; // used for search across both modes

// ── Search index ───────────────────────────────────────────────────────────

interface SearchResult {
  sectionId: string;
  sectionLabel: string;
  pageId: string;
  pageTitle: string;
  pageSubtitle: string;
  matchIn: string;
}

function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];
  for (const section of DOCS) {
    for (const page of section.pages) {
      // collect all text from blocks
      const textParts: string[] = [page.title, page.subtitle];
      for (const b of page.blocks) {
        if (b.t === "p" || b.t === "h2" || b.t === "h3") textParts.push(b.v);
        if (b.t === "list") textParts.push(...b.items);
        if (b.t === "note") textParts.push(b.v);
        if (b.t === "endpoint") textParts.push(b.desc, b.path);
      }
      index.push({
        sectionId: section.id,
        sectionLabel: section.label,
        pageId: page.id,
        pageTitle: page.title,
        pageSubtitle: page.subtitle,
        matchIn: textParts.join(" ").toLowerCase(),
      });
    }
  }
  return index;
}

const SEARCH_INDEX = buildSearchIndex();

// ── Search overlay ─────────────────────────────────────────────────────────

function SearchOverlay({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (sectionId: string, pageId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter((r) => r.matchIn.includes(q));
  }, [query]);

  // Group results by section
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; results: SearchResult[] }>();
    for (const r of results) {
      if (!map.has(r.sectionId)) map.set(r.sectionId, { label: r.sectionLabel, results: [] });
      map.get(r.sectionId)!.results.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mx-4 rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "var(--docs-surface)", border: "1px solid var(--docs-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--docs-border)" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "var(--docs-muted)" }}>
            <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs..."
            className="flex-1 outline-none bg-transparent text-sm"
            style={{ color: "var(--docs-text)", caretColor: "#0052FF" }}
          />
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--docs-subtle)", color: "var(--docs-muted)", border: "1px solid var(--docs-border)", fontFamily: "monospace" }}>Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query && grouped.length === 0 && (
            <p className="px-4 py-8 text-sm text-center" style={{ color: "var(--docs-muted)" }}>
              No results for "{query}"
            </p>
          )}
          {!query && (
            <p className="px-4 py-8 text-sm text-center" style={{ color: "var(--docs-muted)" }}>
              Type to search all documentation pages.
            </p>
          )}
          {grouped.map(([sectionId, { label, results: sectionResults }]) => (
            <div key={sectionId}>
              <div className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--docs-muted)", letterSpacing: "0.08em" }}>
                {label}
              </div>
              {sectionResults.map((r) => (
                <button
                  key={r.pageId}
                  onClick={() => { onNavigate(r.sectionId, r.pageId); onClose(); }}
                  className="w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors"
                  style={{ color: "var(--docs-text)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--docs-subtle)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span className="text-sm font-medium">{r.pageTitle}</span>
                  <span className="text-xs" style={{ color: "var(--docs-muted)" }}>{r.pageSubtitle}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Visual components ──────────────────────────────────────────────────────

function TechStackVisual() {
  const layers = [
    { color: "#0052FF", label: "Frontend",  items: ["React 18", "Vite 6", "Tailwind CSS", "Framer Motion", "Wouter"] },
    { color: "#7C3AED", label: "API",       items: ["Express 5", "TypeScript 5.9", "Zod validation", "Pino logging"] },
    { color: "#0891B2", label: "Database",  items: ["SQLite", "Drizzle ORM", "WAL mode", "Auto-init tables"] },
    { color: "#D97706", label: "AI",        items: ["Ollama runtime", "WebLLM", "SSE streaming", "Demo fallback"] },
  ];
  return (
    <div className="my-8 rounded-xl overflow-hidden" style={{ border: "1px solid var(--docs-border)" }}>
      {layers.map((layer, i) => (
        <div key={i} className="flex items-center gap-5 px-5 py-4" style={{ borderTop: i > 0 ? "1px solid var(--docs-border)" : undefined, background: i % 2 === 0 ? "transparent" : "var(--docs-subtle)" }}>
          <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: layer.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{layer.label}</span>
          <div className="w-px self-stretch flex-shrink-0" style={{ background: "var(--docs-border)" }} />
          <div className="flex flex-wrap gap-2 flex-1">
            {layer.items.map((item) => (
              <span key={item} className="text-xs px-2.5 py-1 rounded-md font-mono font-medium" style={{ background: `${layer.color}12`, color: "var(--docs-heading)", border: `1px solid ${layer.color}25` }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BootSequenceVisual() {
  const steps = [
    { num: 1, label: "Backend",     desc: "API server reachable" },
    { num: 2, label: "Database",    desc: "SQLite tables ready" },
    { num: 3, label: "LLM Runtime", desc: "Ollama responding" },
    { num: 4, label: "Storage",     desc: "Projects dir readable" },
  ];
  return (
    <div className="my-8 overflow-x-auto">
      <div className="flex items-start min-w-max py-2">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-start">
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#0052FF" }}>
                {step.num}
              </div>
              <div className="text-center px-2">
                <div className="text-xs font-semibold" style={{ color: "var(--docs-heading)" }}>{step.label}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--docs-muted)" }}>{step.desc}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-shrink-0 w-12 mt-5">
                <div className="h-px w-full" style={{ borderTop: "2px dashed var(--docs-border)" }} />
              </div>
            )}
          </div>
        ))}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 mt-5">
            <div className="h-px w-full" style={{ borderTop: "2px solid #10B981" }} />
          </div>
          <div className="flex flex-col items-center gap-3 w-36">
            <div className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: "#10B981" }}>Workspace</div>
            <div className="text-[11px]" style={{ color: "var(--docs-muted)" }}>Ready to use</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreePanelVisual() {
  return (
    <div className="my-8 rounded-xl overflow-hidden" style={{ border: "1px solid var(--docs-border)", height: 180 }}>
      <div className="flex h-full text-[11px]">
        <div className="w-44 flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid var(--docs-border)", background: "var(--docs-subtle)" }}>
          <div className="px-3 py-2 font-bold" style={{ color: "#0052FF", borderBottom: "1px solid var(--docs-border)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Left Panel</div>
          <div className="p-3 space-y-1.5 flex-1">
            {["Project A", "Project B", "Project C"].map((p) => (
              <div key={p} className="px-2 py-1 rounded text-[10px]" style={{ background: "var(--docs-bg)", color: "var(--docs-body)", border: "1px solid var(--docs-border)" }}>{p}</div>
            ))}
            <div className="text-[10px] pt-1" style={{ color: "var(--docs-muted)" }}>Projects and chat history</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-3 py-2 font-bold" style={{ color: "#0052FF", borderBottom: "1px solid var(--docs-border)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Center Panel</div>
          <div className="flex" style={{ borderBottom: "1px solid var(--docs-border)" }}>
            {["Chat", "Code Editor", "Preview"].map((tab, i) => (
              <div key={tab} className="px-3 py-1.5 font-medium text-[10px]" style={{ color: i === 0 ? "#0052FF" : "var(--docs-muted)", borderBottom: i === 0 ? "2px solid #0052FF" : "2px solid transparent" }}>{tab}</div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center" style={{ color: "var(--docs-muted)" }}>
            Chat, code, and web preview
          </div>
        </div>
        <div className="w-40 flex-shrink-0 flex flex-col" style={{ borderLeft: "1px solid var(--docs-border)", background: "var(--docs-subtle)" }}>
          <div className="px-3 py-2 font-bold" style={{ color: "#0052FF", borderBottom: "1px solid var(--docs-border)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Right Panel</div>
          <div className="p-3 space-y-1.5 flex-1">
            {["File tree", "Models", "Knowledge"].map((item) => (
              <div key={item} className="px-2 py-1 rounded text-[10px]" style={{ background: "var(--docs-bg)", color: "var(--docs-body)", border: "1px solid var(--docs-border)" }}>{item}</div>
            ))}
            <div className="text-[10px] pt-1" style={{ color: "var(--docs-muted)" }}>Context and tools</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstallFlowVisual() {
  const steps = [
    { num: "1", label: "Open the app",       desc: "Navigate to localos.xyz/app in any modern browser. No download, no install.", color: "#0052FF" },
    { num: "2", label: "Download a model",   desc: "Pick from the Models page. Downloads directly to browser storage.", color: "#7C3AED" },
    { num: "3", label: "Create a project",   desc: "Name it, add files or documents. Stored locally. Nothing sent anywhere.", color: "#0891B2" },
    { num: "4", label: "Go offline",         desc: "Disconnect. Inference, chat, and file access all run with zero network.", color: "#10B981" },
  ];
  return (
    <div className="my-8 grid grid-cols-2 gap-4">
      {steps.map((step) => (
        <div key={step.num} className="rounded-xl p-5" style={{ border: `1px solid ${step.color}30`, background: `${step.color}08` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3 flex-shrink-0" style={{ background: step.color }}>{step.num}</div>
          <div className="text-sm font-semibold mb-1" style={{ color: "var(--docs-heading)" }}>{step.label}</div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--docs-body)" }}>{step.desc}</div>
        </div>
      ))}
    </div>
  );
}

function ModelGridVisual() {
  const models = [
    { name: "Llama",   maker: "Meta",          sizes: "1B to 70B",   strength: "General purpose, code, reasoning",  color: "#0052FF" },
    { name: "Mistral", maker: "Mistral AI",     sizes: "7B to 8x7B",  strength: "Fast inference, strong multilingual", color: "#7C3AED" },
    { name: "Gemma",   maker: "Google",         sizes: "2B to 27B",   strength: "Efficient on low RAM hardware",      color: "#0891B2" },
    { name: "Qwen",    maker: "Alibaba",        sizes: "3B to 72B",   strength: "Strong code and multilingual",       color: "#D97706" },
    { name: "Phi",     maker: "Microsoft",      sizes: "3.8B to 14B", strength: "Tiny but capable, minimal RAM",      color: "#059669" },
    { name: "Hermes",  maker: "NousResearch",   sizes: "8B to 70B",   strength: "Agent workflows and tool use",       color: "#DC2626" },
  ];
  return (
    <div className="my-8 grid grid-cols-3 gap-3">
      {models.map((m) => (
        <div key={m.name} className="rounded-xl p-4" style={{ border: "1px solid var(--docs-border)", background: "var(--docs-subtle)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
            <span className="text-sm font-bold" style={{ color: "var(--docs-heading)" }}>{m.name}</span>
          </div>
          <div className="text-[11px] mb-1" style={{ color: "var(--docs-muted)" }}>by {m.maker}</div>
          <div className="text-xs mb-2 font-mono font-medium" style={{ color: m.color }}>{m.sizes}</div>
          <div className="text-[11px] leading-relaxed" style={{ color: "var(--docs-body)" }}>{m.strength}</div>
        </div>
      ))}
    </div>
  );
}

function ApiFlowVisual() {
  const nodes = [
    { label: "Browser",      desc: "POST /api/chat/stream",     color: "#0052FF" },
    { label: "Express API",  desc: "Validates and forwards",    color: "#7C3AED" },
    { label: "LLM Runtime",  desc: "Model inference, tokens",   color: "#D97706" },
  ];
  return (
    <div className="my-8 rounded-xl overflow-hidden" style={{ border: "1px solid var(--docs-border)" }}>
      <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ background: "var(--docs-subtle)", borderBottom: "1px solid var(--docs-border)", color: "var(--docs-muted)", letterSpacing: "0.12em" }}>Request flow</div>
      <div className="flex items-center gap-0 px-6 py-6 overflow-x-auto">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center">
            <div className="rounded-xl px-5 py-4 text-center w-44 flex-shrink-0" style={{ background: `${node.color}10`, border: `1px solid ${node.color}30` }}>
              <div className="text-xs font-bold mb-1" style={{ color: node.color }}>{node.label}</div>
              <div className="text-[10px]" style={{ color: "var(--docs-muted)" }}>{node.desc}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center w-14 flex-shrink-0 gap-1">
                <div className="h-px w-full" style={{ borderTop: "1px dashed var(--docs-border)" }} />
                <div className="text-[9px]" style={{ color: "var(--docs-muted)" }}>tokens</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ background: "var(--docs-subtle)", borderTop: "1px solid var(--docs-border)", borderBottom: "1px solid var(--docs-border)", color: "var(--docs-muted)", letterSpacing: "0.12em" }}>Response (SSE stream, token by token)</div>
      <div className="px-6 py-4 font-mono text-xs flex flex-wrap gap-2 items-center" style={{ color: "var(--docs-muted)" }}>
        <span style={{ color: "#10B981" }}>data:</span>
        <span style={{ color: "var(--docs-code-text)" }}>{`{"token":"Hello"}`}</span>
        <span>...</span>
        <span style={{ color: "#10B981" }}>data:</span>
        <span style={{ color: "var(--docs-code-text)" }}>{`{"token":" world"}`}</span>
        <span>...</span>
        <span style={{ color: "#10B981" }}>data:</span>
        <span style={{ color: "var(--docs-code-text)" }}>{`{"done":true}`}</span>
      </div>
    </div>
  );
}

const VISUALS: Record<string, React.FC> = {
  "tech-stack":    TechStackVisual,
  "boot-sequence": BootSequenceVisual,
  "three-panel":   ThreePanelVisual,
  "install-flow":  InstallFlowVisual,
  "model-grid":    ModelGridVisual,
  "api-flow":      ApiFlowVisual,
};

// ── Block renderers ────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="text-xs transition-colors px-2 py-0.5 rounded"
      style={{ color: copied ? "#0052FF" : "var(--docs-muted)", background: copied ? "rgba(0,82,255,0.08)" : "transparent" }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const MC: Record<string, { bg: string; fg: string }> = {
  GET:    { bg: "rgba(59,130,246,0.1)",  fg: "#3B82F6" },
  POST:   { bg: "rgba(34,197,94,0.1)",   fg: "#22C55E" },
  PATCH:  { bg: "rgba(234,179,8,0.1)",   fg: "#CA8A04" },
  DELETE: { bg: "rgba(239,68,68,0.1)",   fg: "#EF4444" },
};

function BlockRenderer({ block }: { block: Block }) {
  switch (block.t) {
    case "h2":
      return <h2 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--docs-heading)" }}>{block.v}</h2>;
    case "h3":
      return <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--docs-heading)" }}>{block.v}</h3>;
    case "p":
      return <p className="text-[15px] leading-7 mb-4" style={{ color: "var(--docs-body)" }}>{block.v}</p>;
    case "list":
      return (
        <ul className="mb-4 space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-7" style={{ color: "var(--docs-body)" }}>
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0052FF" }} />
              {item}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="rounded-lg overflow-hidden mb-5" style={{ background: "var(--docs-code-bg)", border: "1px solid var(--docs-border)" }}>
          <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--docs-border)" }}>
            <span className="text-xs font-mono" style={{ color: "var(--docs-muted)" }}>{block.lang}</span>
            <CopyBtn text={block.v} />
          </div>
          <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed m-0 font-mono" style={{ color: "var(--docs-code-text)" }}>{block.v}</pre>
        </div>
      );
    case "note": {
      const s = {
        info: { left: "#3B82F6", bg: "rgba(59,130,246,0.06)", label: "Note",    lc: "#3B82F6" },
        warn: { left: "#F59E0B", bg: "rgba(245,158,11,0.06)", label: "Warning", lc: "#F59E0B" },
        tip:  { left: "#10B981", bg: "rgba(16,185,129,0.06)", label: "Tip",     lc: "#10B981" },
      }[block.kind];
      return (
        <div className="rounded-lg px-4 py-3 mb-4 text-[14px] leading-6 border-l-4"
          style={{ background: s.bg, borderLeftColor: s.left, borderColor: "transparent" }}>
          <span className="font-semibold mr-1.5" style={{ color: s.lc }}>{s.label}:</span>
          <span style={{ color: "var(--docs-body)" }}>{block.v}</span>
        </div>
      );
    }
    case "table":
      return (
        <div className="rounded-lg overflow-hidden mb-5" style={{ border: "1px solid var(--docs-border)" }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "var(--docs-subtle)" }}>
                {block.headers.map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "var(--docs-muted)", borderBottom: "1px solid var(--docs-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? "1px solid var(--docs-border)" : undefined }}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 text-[13px]" style={{ color: j === 0 ? "var(--docs-heading)" : "var(--docs-body)", fontFamily: j === 0 ? "monospace" : undefined }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "endpoint": {
      const m = MC[block.method];
      return (
        <div className="rounded-lg overflow-hidden mb-5" style={{ border: "1px solid var(--docs-border)" }}>
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "var(--docs-subtle)", borderBottom: block.body || block.response ? "1px solid var(--docs-border)" : undefined }}>
            <span className="text-xs font-bold px-2 py-0.5 rounded font-mono" style={{ background: m.bg, color: m.fg }}>{block.method}</span>
            <code className="text-[13px] font-mono font-medium" style={{ color: "var(--docs-heading)" }}>{block.path}</code>
          </div>
          {(block.desc || block.body || block.response) && (
            <div className="px-4 py-3">
              {block.desc && <p className="text-sm mb-0" style={{ color: "var(--docs-body)" }}>{block.desc}</p>}
              {block.body && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: "var(--docs-muted)", letterSpacing: "0.08em" }}>Request body</p>
                  <pre className="text-xs font-mono leading-relaxed rounded-lg p-3 m-0 overflow-x-auto" style={{ background: "var(--docs-code-bg)", color: "var(--docs-code-text)", border: "1px solid var(--docs-border)" }}>{block.body}</pre>
                </>
              )}
              {block.response && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: "var(--docs-muted)", letterSpacing: "0.08em" }}>Response</p>
                  <pre className="text-xs font-mono leading-relaxed rounded-lg p-3 m-0 overflow-x-auto" style={{ background: "var(--docs-code-bg)", color: "var(--docs-code-text)", border: "1px solid var(--docs-border)" }}>{block.response}</pre>
                </>
              )}
            </div>
          )}
        </div>
      );
    }
    case "visual": {
      const V = VISUALS[block.id];
      return V ? <V /> : null;
    }
    default:
      return null;
  }
}

// ── Main layout ────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { dark, toggle } = useDarkMode();
  const [mode, setMode]                       = useState<"user" | "dev">("user");
  const [activeSectionId, setActiveSectionId] = useState(USER_DOCS[0].id);
  const [activePageId, setActivePageId]       = useState(USER_DOCS[0].pages[0].id);
  const [searchOpen, setSearchOpen]           = useState(false);
  const contentRef                            = useRef<HTMLDivElement>(null);

  const currentDocs   = mode === "user" ? USER_DOCS : DEV_DOCS;
  const activeSection = currentDocs.find((s) => s.id === activeSectionId) ?? currentDocs[0];
  const activePage    = activeSection.pages.find((p) => p.id === activePageId) ?? activeSection.pages[0];

  function switchMode(next: "user" | "dev") {
    const docs = next === "user" ? USER_DOCS : DEV_DOCS;
    setMode(next);
    setActiveSectionId(docs[0].id);
    setActivePageId(docs[0].pages[0].id);
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll content to top on page change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activePageId]);

  function goTo(sectionId: string, pageId: string) {
    setActiveSectionId(sectionId);
    setActivePageId(pageId);
  }

  function goToSection(sectionId: string) {
    const section = ALL_DOCS.find((s) => s.id === sectionId)!;
    setActiveSectionId(sectionId);
    setActivePageId(section.pages[0].id);
  }

  function navigateFromSearch(sectionId: string, pageId: string) {
    const inUser = USER_SECTION_IDS.has(sectionId);
    setMode(inUser ? "user" : "dev");
    setActiveSectionId(sectionId);
    setActivePageId(pageId);
  }

  // Prev / Next within the same section
  const sectionPages  = activeSection.pages;
  const currentIndex  = sectionPages.findIndex((p) => p.id === activePageId);
  const prevPage      = sectionPages[currentIndex - 1];
  const nextPage      = sectionPages[currentIndex + 1];

  // CSS vars applied inline on the root element so they cascade to all children
  const cssVars = dark ? {
    "--docs-bg":        "#0B0B0D",
    "--docs-surface":   "#141417",
    "--docs-subtle":    "rgba(255,255,255,0.04)",
    "--docs-border":    "rgba(255,255,255,0.08)",
    "--docs-heading":   "rgba(255,255,255,0.93)",
    "--docs-body":      "rgba(255,255,255,0.6)",
    "--docs-muted":     "rgba(255,255,255,0.35)",
    "--docs-text":      "rgba(255,255,255,0.85)",
    "--docs-code-bg":   "#0F1117",
    "--docs-code-text": "rgba(255,255,255,0.75)",
    "--docs-active-bg": "rgba(0,82,255,0.1)",
    "--docs-active-fg": "#6BA5FF",
    "--docs-tab-active":"#6BA5FF",
    "--docs-tab-underline": "#0052FF",
  } : {
    "--docs-bg":        "#FFFFFF",
    "--docs-surface":   "#FFFFFF",
    "--docs-subtle":    "#F8FAFC",
    "--docs-border":    "#E2E8F0",
    "--docs-heading":   "#0F172A",
    "--docs-body":      "#475569",
    "--docs-muted":     "#94A3B8",
    "--docs-text":      "#1E293B",
    "--docs-code-bg":   "#F8FAFC",
    "--docs-code-text": "#1E293B",
    "--docs-active-bg": "#EFF6FF",
    "--docs-active-fg": "#2563EB",
    "--docs-tab-active":"#2563EB",
    "--docs-tab-underline": "#2563EB",
  } as React.CSSProperties;

  return (
    <div className="flex flex-col" style={{ height: "100dvh", ...cssVars, background: "var(--docs-bg)", color: "var(--docs-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-4 px-4 h-14 flex-shrink-0" style={{ borderBottom: "1px solid var(--docs-border)", background: "var(--docs-bg)" }}>
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 mr-4 flex-shrink-0" style={{ textDecoration: "none" }}>
          <img src="/logo.png" alt="LocalOS" className="w-7 h-7 object-contain flex-shrink-0" />
          <span className="text-sm font-bold" style={{ color: "var(--docs-heading)" }}>LocalOS docs</span>
        </a>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm flex-1 max-w-sm transition-colors"
          style={{ background: "var(--docs-subtle)", border: "1px solid var(--docs-border)", color: "var(--docs-muted)" }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="flex-1 text-left text-[13px]">Search docs...</span>
          <kbd className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "var(--docs-subtle)", border: "1px solid var(--docs-border)", fontFamily: "monospace" }}>Ctrl K</kbd>
        </button>

        <div className="flex-1" />

        {/* GitHub */}
        <a
          href="https://github.com/localos-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: "var(--docs-muted)", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--docs-heading)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--docs-muted)")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: "var(--docs-muted)", border: "1px solid var(--docs-border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--docs-heading)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--docs-muted)")}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={12} cy={12} r={5} /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </header>

      {/* ── Mode tabs ─────────────────────────────────────────────────────── */}
      <nav className="flex items-stretch gap-0 px-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--docs-border)", background: "var(--docs-bg)" }}>
        {([ ["user", "User Guide"], ["dev", "Developer"] ] as const).map(([m, label]) => {
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="relative flex-shrink-0 flex items-center px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color:        isActive ? "var(--docs-tab-active)" : "var(--docs-muted)",
                borderBottom: isActive ? "2px solid var(--docs-tab-underline)" : "2px solid transparent",
                marginBottom: "-1px",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--docs-heading)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--docs-muted)"; }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Body: sidebar + content ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden md:block w-60 flex-shrink-0 overflow-y-auto py-6 px-3" style={{ borderRight: "1px solid var(--docs-border)", background: "var(--docs-bg)" }}>
          {currentDocs.map((section) => (
            <div key={section.id} className="mb-5">
              {/* Section group label */}
              <div
                className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: section.id === activeSectionId ? "var(--docs-tab-active)" : "var(--docs-muted)", letterSpacing: "0.08em", paddingTop: "2px", paddingBottom: "6px" }}
                onClick={() => goToSection(section.id)}
              >
                {section.label}
              </div>
              {/* Pages */}
              {section.pages.map((page) => {
                const isActive = page.id === activePageId && section.id === activeSectionId;
                return (
                  <button
                    key={page.id}
                    onClick={() => goTo(section.id, page.id)}
                    className="w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors block"
                    style={{
                      background: isActive ? "var(--docs-active-bg)" : "transparent",
                      color:      isActive ? "var(--docs-active-fg)" : "var(--docs-body)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--docs-subtle)"; e.currentTarget.style.color = "var(--docs-heading)"; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--docs-body)"; } }}
                  >
                    {page.title}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="px-8 md:px-14 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: "var(--docs-tab-active)" }}>
              <span className="font-medium">{activeSection.label}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--docs-heading)", letterSpacing: "-0.02em" }}>
              {activePage.title}
            </h1>
            <p className="text-base mb-8 pb-8" style={{ color: "var(--docs-body)", borderBottom: "1px solid var(--docs-border)" }}>
              {activePage.subtitle}
            </p>

            {/* Content blocks */}
            <div>
              {activePage.blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>

            {/* Prev / Next */}
            {(prevPage || nextPage) && (
              <div className="flex gap-4 mt-12 pt-8" style={{ borderTop: "1px solid var(--docs-border)" }}>
                {prevPage ? (
                  <button
                    onClick={() => setActivePageId(prevPage.id)}
                    className="flex-1 text-left px-4 py-3 rounded-lg transition-colors"
                    style={{ border: "1px solid var(--docs-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--docs-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="text-xs mb-1" style={{ color: "var(--docs-muted)" }}>Previous</div>
                    <div className="text-sm font-medium" style={{ color: "var(--docs-heading)" }}>{prevPage.title}</div>
                  </button>
                ) : <div className="flex-1" />}
                {nextPage ? (
                  <button
                    onClick={() => setActivePageId(nextPage.id)}
                    className="flex-1 text-right px-4 py-3 rounded-lg transition-colors"
                    style={{ border: "1px solid var(--docs-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--docs-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="text-xs mb-1" style={{ color: "var(--docs-muted)" }}>Next</div>
                    <div className="text-sm font-medium" style={{ color: "var(--docs-heading)" }}>{nextPage.title}</div>
                  </button>
                ) : <div className="flex-1" />}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onNavigate={navigateFromSearch}
        />
      )}
    </div>
  );
}
