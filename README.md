# LocalOS

A self-hosted local AI operating system. Chat with language models, manage projects, write code, and build a knowledge base, all running on your own hardware with no cloud dependency, no account, and no telemetry.

Website: https://localos.xyz
Docs: https://localos.xyz/docs
GitHub: https://github.com/localos-dev
X: https://x.com/localos_xyz

---

## How to use LocalOS

There is nothing to install. LocalOS runs entirely in the browser.

Open https://localos.xyz/app in any modern browser on Mac, Windows, or Linux.

Go to the Models page and pick a model. Free models (under 2 GB) download immediately. Larger models require a one-time USDC payment via your crypto wallet. The download goes directly to your browser storage. This is the only time you need an internet connection.

Once the model is downloaded, disconnect from the internet. LocalOS runs fully offline from that point. Inference, chat, file access, and project management all work with no network connection.

Create a project and start chatting.

---

## What you can do

Chat with local language models running entirely in your browser. Responses stream token by token from the model on your device. Nothing is sent to a server.

Manage multiple projects. Each project has its own chat history, file tree, and knowledge base. Projects are isolated from each other.

Write and edit code in a built-in Monaco editor with syntax highlighting for over 20 programming languages.

Upload documents and files to a per-project knowledge base. The AI reads from your documents during conversations.

Build web apps and tools with the built-in web builder. Preview generated output directly in the workspace.

Switch between Chat, Code Editor, and Web Preview panels from the center of the workspace.

Everything runs offline and air-gap compatible after the first model download. No telemetry. No cloud calls. No data leaves your device.

---

## Model catalog

20 models across 6 families. Models under 2 GB are free. Larger models require a one-time payment.

### Llama (Meta)

| Model | Size | Price | Context |
|---|---|---|---|
| Llama 3.2 1B | 879 MB | Free | 8K tokens |
| Llama 3.2 3B | 2.2 GB | 15 USDC | 8K tokens |
| Llama 3.1 8B | 4.9 GB | 25 USDC | 16K tokens |

### Qwen (Alibaba)

| Model | Size | Price | Context |
|---|---|---|---|
| Qwen 2.5 1.5B | 1.6 GB | Free | 4K tokens |
| Qwen 2.5 Coder 1.5B | 1.6 GB | Free | 4K tokens |
| Qwen 2.5 3B | 2.5 GB | 15 USDC | 8K tokens |
| Qwen 2.5 Coder 3B | 2.5 GB | 15 USDC | 8K tokens |
| Qwen 2.5 7B | 5.0 GB | 25 USDC | 8K tokens |
| Qwen 2.5 Coder 7B | 5.0 GB | 25 USDC | 8K tokens |

### Gemma (Google)

| Model | Size | Price | Context |
|---|---|---|---|
| Gemma 2 2B | 1.9 GB | Free | 8K tokens |
| Gemma 2 9B | 6.3 GB | 25 USDC | 8K tokens |

### Phi (Microsoft)

| Model | Size | Price | Context |
|---|---|---|---|
| Phi 4 Mini | 3.4 GB | 20 USDC | 16K tokens |
| Phi 3.5 Mini | 3.6 GB | 20 USDC | 16K tokens |

### Mistral

| Model | Size | Price | Context |
|---|---|---|---|
| Ministral 3B | 2.8 GB | 15 USDC | 32K tokens |
| Mistral 7B v0.3 | 4.5 GB | 25 USDC | 32K tokens |

### Hermes (Nous Research)

| Model | Size | Price | Context |
|---|---|---|---|
| Hermes 3 Llama 3.2 3B | 2.2 GB | 15 USDC | 8K tokens |
| Hermes 2 Pro Mistral 7B | 3.9 GB | 20 USDC | 32K tokens |
| OpenHermes 2.5 Mistral 7B | 4.5 GB | 25 USDC | 32K tokens |
| NeuralHermes 2.5 Mistral 7B | 4.5 GB | 25 USDC | 32K tokens |
| Hermes 3 Llama 3.1 8B | 4.8 GB | 25 USDC | 16K tokens |

Pricing tiers: free under 2 GB, 15 USDC for 2 to 3 GB, 20 USDC for 3 to 4 GB, 25 USDC for 4 GB and above. Payment is one-time per wallet per model via smart contract on Base.

---

## System requirements

Browser: Chrome 112 or later, Firefox 115 or later, Safari 16.4 or later, Edge 112 or later. Chrome is recommended for best WebLLM performance.

RAM: 8 GB or more recommended. Models under 2 GB work on 4 GB RAM.

Storage: varies by model. Free models use under 2 GB. The largest model (Gemma 2 9B) uses 6.3 GB. Storage is in browser OPFS (Origin Private File System), not on your hard drive.

GPU: not required. CPU-only inference is supported. A GPU (via WebGPU) significantly improves token generation speed when available.

Wallet: MetaMask or any injected browser wallet, or Coinbase Wallet, connected to the Base network with USDC for paid models. Free models do not require a wallet.

---

## Architecture

LocalOS has two main components: a browser app and an optional API server.

The browser app handles everything related to AI. Language models are downloaded to browser storage (OPFS) and run entirely inside the browser using WebLLM (MLC-AI). No server processes tokens. Chat responses stream token by token from WebLLM to the React UI via an async iterator.

The API server handles persistent storage: projects, chats, messages, files, and knowledge documents. It is an Express 5 app connected to a local SQLite database. It runs on your machine and never contacts external servers.

The payment system uses a smart contract deployed on Base. Users send USDC to a backend-generated fresh address. The backend relay worker detects the payment and forwards the USDC to the LocalOSTreasury contract. Access is granted in the local database after the relay confirms.

```
Browser (LocalOS App)
    WebLLM engine          in-browser AI inference, no server
    React UI               workspace, chat, code editor, web builder
    wagmi + viem           wallet connection and address identity

API Server (Express 5, self-hosted)
    Routes                 REST API under /api
    SQLite (Drizzle ORM)   projects, chats, messages, files, knowledge docs
    Payment worker         polls Base for USDC, relays to treasury, grants access

Smart Contract (Base network)
    LocalOSTreasury.sol    non-upgradable USDC treasury, owner-only withdrawal
```

---

## Full stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Build tool | Vite | 7 |
| CSS | Tailwind CSS | 4 |
| Animation | Framer Motion | latest |
| Routing | Wouter | latest |
| In-browser AI | WebLLM (MLC-AI) | latest |
| State management | Zustand | latest |
| API server | Express | 5 |
| Runtime | Node.js | 24 |
| Language | TypeScript | 5.9 |
| Database | SQLite via better-sqlite3 | latest |
| ORM | Drizzle ORM | latest |
| API contract | OpenAPI 3.1 with Orval codegen | latest |
| API client | React Query (TanStack Query) | v5 |
| Package manager | pnpm workspaces (monorepo) | 9+ |
| Wallet integration | wagmi + viem | v3 / v2 |
| Smart contract | Solidity | 0.8.22 |
| Payment network | Base (L2 on Ethereum) | |
| Payment token | USDC | 6 decimals |

---

## Database schema

Five tables, all auto-created on first boot with CREATE TABLE IF NOT EXISTS. No migration runner needed.

### projects

| Column | Type | Notes |
|---|---|---|
| id | integer | primary key, auto increment |
| name | text | required |
| description | text | default empty string |
| color | text | hex color, default #0052FF |
| created_at | text | ISO datetime |
| updated_at | text | ISO datetime |

### chats

| Column | Type | Notes |
|---|---|---|
| id | integer | primary key, auto increment |
| project_id | integer | foreign key to projects, cascade delete |
| title | text | required |
| model | text | MLC model ID used in this chat |
| created_at | text | ISO datetime |
| updated_at | text | ISO datetime |

### messages

| Column | Type | Notes |
|---|---|---|
| id | integer | primary key, auto increment |
| chat_id | integer | foreign key to chats, cascade delete |
| role | text | enum: user, assistant, system |
| content | text | full message text |
| created_at | text | ISO datetime |

### files

| Column | Type | Notes |
|---|---|---|
| id | integer | primary key, auto increment |
| project_id | integer | foreign key to projects, cascade delete |
| name | text | filename |
| path | text | relative path within project |
| content | text | full file content |
| language | text | syntax language identifier |
| created_at | text | ISO datetime |
| updated_at | text | ISO datetime |

### knowledge_docs

| Column | Type | Notes |
|---|---|---|
| id | integer | primary key, auto increment |
| project_id | integer | foreign key to projects, cascade delete |
| name | text | document display name |
| content | text | full extracted text |
| type | text | mime type or "text" |
| size | integer | file size in bytes |
| created_at | text | ISO datetime |

---

## API endpoints

All routes under /api. Defined in lib/api-spec/openapi.yaml (source of truth). Client hooks are generated by Orval.

| Method | Path | Description |
|---|---|---|
| GET | /api/healthz | Health check, returns ok status |
| GET | /api/status | System status: DB, filesystem, LLM runtime |
| GET | /api/projects | List all projects |
| POST | /api/projects | Create a project |
| GET | /api/projects/:id | Get a single project |
| PUT | /api/projects/:id | Update project name, description, or color |
| DELETE | /api/projects/:id | Delete project and all its data |
| GET | /api/projects/:id/chats | List chats in a project |
| POST | /api/projects/:id/chats | Create a chat |
| GET | /api/projects/:id/chats/:chatId | Get a single chat |
| PUT | /api/projects/:id/chats/:chatId | Update chat title or model |
| DELETE | /api/projects/:id/chats/:chatId | Delete a chat and its messages |
| GET | /api/projects/:id/chats/:chatId/messages | List messages in a chat |
| GET | /api/projects/:id/files | List files in a project |
| POST | /api/projects/:id/files | Create a file |
| GET | /api/projects/:id/files/:fileId | Get file content |
| PUT | /api/projects/:id/files/:fileId | Update file content or name |
| DELETE | /api/projects/:id/files/:fileId | Delete a file |
| GET | /api/projects/:id/knowledge | List knowledge documents |
| POST | /api/projects/:id/knowledge | Upload a knowledge document |
| GET | /api/projects/:id/knowledge/:docId | Get a knowledge document |
| DELETE | /api/projects/:id/knowledge/:docId | Delete a knowledge document |
| GET | /api/models | List available LLM runtime models |
| POST | /api/models/pull | Pull a model in the LLM runtime |
| DELETE | /api/models/:name | Delete a model from the LLM runtime |
| GET | /api/filesystem | List filesystem entries |
| GET | /api/filesystem/read | Read a file from the project filesystem |
| POST | /api/filesystem/write | Write a file to the project filesystem |

Chat inference does not go through the API server. The browser talks directly to WebLLM.

---

## Smart contract

Contract: contracts/LocalOSTreasury.sol
Network: Base mainnet
Pattern: non-upgradable (no proxy)
Payment token: USDC at 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

### Payment flow

1. User connects a wallet on the Models page.
2. Frontend asks the API server for a fresh payment address.
3. User sends the required USDC amount to that address.
4. The backend payment worker polls Base every 15 seconds for incoming USDC.
5. When USDC is detected, the worker sends a small gas buffer to the fresh address, then relays the USDC to LocalOSTreasury.
6. Access is recorded in the local SQLite database and the model unlocks immediately.

### Functions

| Function | Access | Description |
|---|---|---|
| withdrawToken(address token, address to, uint256 amount) | owner | Withdraw a specific amount of any ERC20 token to a recipient. |
| withdrawAllToken(address token, address to) | owner | Withdraw the full balance of any ERC20 token to a recipient. |
| withdrawETH(address to, uint256 amount) | owner | Withdraw a specific amount of ETH to a recipient. |
| transferOwnership(address newOwner) | owner | Transfer contract ownership to a new address. |

### Events

| Event | Description |
|---|---|
| TokenWithdrawn(address token, address to, uint256 amount) | Emitted on ERC20 withdrawal. |
| ETHWithdrawn(address to, uint256 amount) | Emitted on ETH withdrawal. |
| OwnershipTransferred(address previousOwner, address newOwner) | Emitted on ownership transfer. |

---

## Monorepo layout

```
localos/
  api-server/                Express 5 API server
    src/routes/              Route handlers: health, status, projects, chats,
                             messages, files, knowledge, models, filesystem, payment
    src/lib/localos-db.ts    DB helpers, table auto-create, seed data
    src/lib/payment-worker.ts  USDC relay worker, polls Base every 15s
  app/                       React browser app
    src/pages/               LandingPage, AppPage, ModelsPage, ProjectsPage,
                             SettingsPage, and 20+ marketing pages
    src/components/          UI components: Sidebar, ChatView, CodeEditorView,
                             RightPanel, WalletButton, PaymentModal, and more
    src/contexts/            LLMContext (WebLLM engine state)
    src/stores/              appStore (Zustand global UI state)
    src/lib/
      models.ts              Model catalog, 20 entries, free and paid tiers
      contract.ts            wagmi config, Reown AppKit wallet identity
      localstore.ts          localStorage wrapper for persistent UI state
  lib/
    api-spec/
      openapi.yaml           OpenAPI 3.1 spec, source of truth for all API contracts
    api-client-react/
      src/generated/api.ts   Generated React Query hooks (do not edit)
    api-zod/                 Generated Zod validation schemas (do not edit)
    db/
      src/schema/index.ts    Drizzle ORM table definitions (7 tables)
      src/index.ts           SQLite init, WAL mode, foreign key enforcement
  contracts/
    contracts/
      LocalOSTreasury.sol    Non-upgradable USDC treasury contract
      MockUSDC.sol           Mock ERC20 for local testing
    test/
      LocalOSTreasury.test.ts  Hardhat tests
    hardhat.config.ts        Hardhat build and deploy config
  scripts/
    src/push-to-github.ts    Push source to all 6 GitHub repos via GitHub App API
```

---

## For developers

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

Open the browser at the port shown in the terminal. No database setup needed. SQLite is created automatically at ./localos.db on first boot.

### Environment variables

```
LOCALOS_DB_PATH           Override the default SQLite file path (default: ./localos.db)
LOCALOS_PROJECTS_ROOT     Override the default projects root directory
SESSION_SECRET            Secret for session cookie signing
CONTRACT_ADDRESS          Deployed LocalOSTreasury address on Base (used by the relay worker)
DEPLOYER_PRIVATE_KEY      Private key of the wallet that funds gas and relays USDC to the treasury
BASE_RPC_URL              Base mainnet RPC endpoint (defaults to public endpoint if not set)
VITE_REOWN_PROJECT_ID     Reown AppKit project ID for wallet identity (get one at cloud.reown.com)
```

No DATABASE_URL needed. SQLite is used throughout.

### Regenerate API client

After editing lib/api-spec/openapi.yaml, regenerate React Query hooks and Zod schemas:

```
pnpm --filter @workspace/api-spec run codegen
```

### Type checking

Full type check across all packages:

```
pnpm run typecheck
```

After changing anything in lib/, rebuild shared libraries first:

```
pnpm run typecheck:libs
```

### Push to GitHub

Push source to all 6 public repos (localos, localos-site, localos-docs, localos-models, localos-contracts, localos-dev):

```
pnpm --filter @workspace/scripts run push-github
```

Requires secrets: GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_ID.

### Architecture decisions

SQLite over Postgres: LocalOS is local-first. SQLite requires zero setup, stores everything in one file, and supports WAL mode for concurrent reads during streaming.

Tables auto-created on boot: initializeDatabase() runs CREATE TABLE IF NOT EXISTS on every startup. No migration runner needed for local-first development.

WebLLM for inference: all AI processing runs inside the browser. The WebLLM engine (MLC-AI) compiles models to WebGPU and runs them client-side. No server receives user messages or model outputs.

Browser storage (OPFS): model weights are stored in the Origin Private File System, a browser-native sandboxed filesystem. This avoids IndexedDB size limits and performs better for large binary files.

localStorage over IndexedDB for app state: IndexedDB can hang indefinitely in PWA plus service worker context when offline. localStorage is synchronous, always available, and sufficient for app state.

Non-upgradable treasury: LocalOSTreasury.sol is intentionally not upgradeable. If payment logic needs changing, a new contract is deployed and the relay worker's CONTRACT_ADDRESS is updated. This keeps the contract simple and auditable.

Relay worker over on-chain access: access is tracked in the local SQLite database rather than read from the chain on every model load. This keeps the UI fast and avoids RPC calls during inference.

Orval code generation: the OpenAPI spec is the single source of truth. React Query hooks and Zod schemas are generated and should never be edited by hand. Run codegen after every spec change.

React Query v5 queryKey: when passing enabled to a generated hook, always pass queryKey inside the query option object. Use the getXxxQueryKey() helper functions.

---

## GitHub repositories

| Repo | URL | Contents |
|---|---|---|
| localos | https://github.com/localos-dev/localos | Core app: API server, browser UI, shared libraries |
| localos-site | https://github.com/localos-dev/localos-site | Marketing site source for localos.xyz |
| localos-docs | https://github.com/localos-dev/localos-docs | Documentation site source |
| localos-models | https://github.com/localos-dev/localos-models | Community model catalog (models.json, schema, types) |
| localos-contracts | https://github.com/localos-dev/localos-contracts | Smart contract source: LocalOSTreasury.sol on Base |
| localos-dev | https://github.com/localos-dev/localos-dev | Org profile README |

---

## Links

Website: https://localos.xyz
Docs: https://localos.xyz/docs
GitHub: https://github.com/localos-dev
X: https://x.com/localos_xyz
