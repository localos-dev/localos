import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";

// ── Reown AppKit setup ────────────────────────────────────────────────────────
// Used only for wallet identity (getting user address). Users do not sign
// any contract calls here: payments go through the backend relay flow.

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID ?? "";

const networks = [base] as [typeof base, ...typeof base[]];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: "LocalOS",
    description: "Self-hosted local AI OS",
    url: "https://localos.xyz",
    icons: ["https://localos.xyz/favicon.ico"],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#0052FF",
    "--w3m-border-radius-master": "12px",
  },
  features: {
    analytics: false,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
  },
});

// ── Price helpers ─────────────────────────────────────────────────────────────

// Returns USD price as a number, or "free"
export function getModelPrice(vramMB: number): number | "free" {
  const gb = vramMB / 1024;
  if (gb < 2.0) return "free";
  if (gb < 3.0) return 15;
  if (gb < 4.0) return 20;
  return 25;
}
