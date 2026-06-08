# LocalOS

A self-hosted local AI operating system. Chat with language models, manage projects, write code, and build a knowledge base, all running on your own hardware with no cloud dependency, no account, and no telemetry.

Website: https://localos.xyz
Docs: https://localos.xyz/docs
X: https://x.com/localos_xyz

---

## How to use LocalOS

There is nothing to install. LocalOS runs in the browser.

Open https://localos.xyz/app in any modern browser on Mac, Windows, or Linux.

Go to the Models page and download a language model. The download goes directly to your browser storage. This is the only time you need an internet connection.

Once the model is downloaded, disconnect from the internet. LocalOS runs fully offline from that point. Inference, chat, file access, and project management all work with no network connection.

Create a project and start chatting.

---

## What you can do

Chat with local language models including Llama, Mistral, Gemma, Phi, Qwen, and Hermes. Responses stream token by token directly from the model running on your device.

Manage multiple projects, each with its own chat history, file tree, and knowledge base.

Write and edit code in a built-in Monaco editor with syntax highlighting for over 20 languages.

Upload documents and files to a per-project knowledge base and use them as context in your conversations.

Switch between Chat, Code Editor, and Web Preview from the center panel of the workspace.

Everything runs offline and air-gap compatible after the first model download. No telemetry. No cloud calls. No data leaves your device.

---

## System requirements

Browser: Chrome 112 or later, Firefox 115 or later, Safari 16.4 or later, Edge 112 or later.

RAM: 8 GB or more recommended. Smaller models (1B to 3B parameters) work on 4 GB.

Storage: varies by model. Small models use 1 to 3 GB. Larger models use 8 to 40 GB of browser storage.

GPU: not required. CPU-only inference is supported on all platforms.

---

## For developers

### Stack

Frontend: React 18, Vite 6, Tailwind CSS, Framer Motion, Wouter, next-themes

API: Express 5, TypeScript 5.9, Zod validation, Pino logging

Database: SQLite via better-sqlite3 and Drizzle ORM, WAL mode enabled, tables auto-created on first boot

AI runtime: Ollama at localhost:11434 for local LLM inference, SSE-based streaming for chat responses

Monorepo: pnpm workspaces, Node.js 24

API contracts: OpenAPI 3.1 spec with Orval code generation for React Query hooks and Zod schemas

### Project layout

```
lib/api-spec/openapi.yaml                    OpenAPI spec, source of truth for all contracts
lib/db/src/schema/index.ts                   SQLite schema: projects, chats, messages, files, knowledge_docs
lib/db/src/index.ts                          DB initialization, WAL mode, foreign key enforcement
lib/api-client-react/src/generated/api.ts   Generated React Query hooks (do not edit directly)

api-server/src/routes/                       Express route handlers
api-server/src/lib/localos-db.ts            DB helpers, table auto-create, seed data
api-server/src/lib/ollama.ts                Ollama client and model catalog

local-os/src/pages/AppPage.tsx              Boot sequence and three-panel workspace layout
local-os/src/components/app/               Sidebar, ChatView, CodeEditorView, RightPanel
local-os/src/stores/appStore.ts            Global UI state via Zustand
local-os/src/pages/DocsPage.tsx            Documentation page at /docs
```

### Running locally

Requirements: Node.js 24, pnpm 9 or later.

Install dependencies:

```
pnpm install
```

Start the API server:

```
pnpm --filter @workspace/api-server run dev
```

Start the frontend in a separate terminal:

```
pnpm --filter @workspace/local-os run dev
```

Open the browser at the port shown in the terminal output.

No database setup needed. A SQLite file is created automatically at ./localos.db on first boot.

### Environment variables

```
LOCALOS_DB_PATH        Override the default SQLite file path
LOCALOS_PROJECTS_ROOT  Override the default projects root directory
SESSION_SECRET         Secret for session signing
```

No DATABASE_URL is needed. SQLite is used throughout.

### Regenerate API hooks

After editing the OpenAPI spec, regenerate the React Query hooks and Zod schemas:

```
pnpm --filter @workspace/api-spec run codegen
```

### Type checking

Full type check across all packages:

```
pnpm run typecheck
```

Rebuild shared libraries first if you changed anything in lib/:

```
pnpm run typecheck:libs
```

### Architecture notes

SQLite instead of Postgres: LocalOS is local-first and self-hosted. SQLite requires zero setup and stores everything in a single file.

Tables auto-created on boot: initializeDatabase() runs CREATE TABLE IF NOT EXISTS on every startup. No migration runner is needed.

Chat streaming via SSE: the frontend posts to POST /api/chat/stream. The server forwards the LLM runtime response as Server-Sent Events. Each event carries one token. The frontend accumulates and renders tokens as they arrive.

LLM runtime optional: if Ollama is not running at startup, LocalOS enters Demo Mode and simulates a streaming response. All other features remain functional.

OpenAPI code generation: Orval reads lib/api-spec/openapi.yaml and generates typed React Query hooks and Zod schemas. The generated file at lib/api-client-react/src/generated/api.ts should not be edited by hand.

---

## Links

Website: https://localos.xyz
Docs: https://localos.xyz/docs
GitHub: https://github.com/localos-dev
X: https://x.com/localos_xyz
