import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

export default function WalletButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 rounded-lg text-sm font-mono transition-all"
        style={{
          background: "rgba(0,82,255,0.12)",
          color: "#6699ff",
          border: "1px solid rgba(0,82,255,0.25)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(200,40,40,0.12)";
          (e.currentTarget as HTMLElement).style.color = "#ff6666";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,40,40,0.25)";
          (e.currentTarget as HTMLElement).textContent = "Disconnect";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.12)";
          (e.currentTarget as HTMLElement).style.color = "#6699ff";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,82,255,0.25)";
          (e.currentTarget as HTMLElement).textContent = short;
        }}
      >
        {short}
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{
        background: "rgba(0,82,255,0.15)",
        color: "#fff",
        border: "1px solid rgba(0,82,255,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.28)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(0,82,255,0.15)";
      }}
    >
      Connect Wallet
    </button>
  );
}
