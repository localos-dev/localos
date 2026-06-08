import { useState, useEffect, useRef } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { type ModelInfo, formatSize } from "@/lib/models";
import { getModelPrice } from "@/lib/contract";

type Status = "connect" | "awaiting" | "done" | "error";

interface PaymentSession {
  sessionId: string;
  freshAddress: string;
  amountUsdc: number;
  expiresAt: string;
}

interface Props {
  model: ModelInfo;
  price: number;
  onClose: () => void;
  onPaid: () => void;
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function initSession(modelId: string, userWallet: string): Promise<PaymentSession> {
  const res = await fetch(`${BASE_URL}/api/payment/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, userWallet }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function pollStatus(sessionId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/payment/status/${sessionId}`);
  if (!res.ok) return "error";
  const data = await res.json();
  return data.status ?? "error";
}

export default function PaymentModal({ model, price, onClose, onPaid }: Props) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  const [step, setStep] = useState<Status>(isConnected ? "awaiting" : "connect");
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isConnected && step === "connect") setStep("awaiting");
  }, [isConnected, step]);

  // Initialise session when we have an address and step is awaiting
  useEffect(() => {
    if (step !== "awaiting" || !address || session) return;

    initSession(model.id, address)
      .then((s) => {
        if ("alreadyPaid" in s && (s as any).alreadyPaid) {
          setStep("done");
          onPaid();
          return;
        }
        setSession(s);
      })
      .catch((err) => {
        setErrorMsg(err.message ?? "Failed to initialise payment");
        setStep("error");
      });
  }, [step, address, model.id, session, onPaid]);

  // Countdown timer
  useEffect(() => {
    if (!session) return;
    function update() {
      if (!session) return;
      const ms = new Date(session.expiresAt + "Z").getTime() - Date.now();
      if (ms <= 0) { setTimeLeft("Expired"); return; }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }
    update();
    timerRef.current = setInterval(update, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session]);

  // Poll backend status
  useEffect(() => {
    if (!session || step !== "awaiting") return;

    pollRef.current = setInterval(async () => {
      const status = await pollStatus(session.sessionId);
      if (status === "done") {
        setStep("done");
        onPaid();
        if (pollRef.current) clearInterval(pollRef.current);
      } else if (status === "failed") {
        setStep("error");
        setErrorMsg("Payment relay failed. Contact support with your session ID.");
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 5000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [session, step, onPaid]);

  function copyAddress() {
    if (!session) return;
    navigator.clipboard.writeText(session.freshAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRetry() {
    setSession(null);
    setErrorMsg("");
    setStep(isConnected ? "awaiting" : "connect");
  }

  const usdcDisplay = price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{
          background: "rgba(4,9,24,0.98)",
          border: "1px solid rgba(0,82,255,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Unlock Model</h2>
            <p className="text-sm text-white/50 mt-0.5">{model.name} {formatSize(model.vramMB)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none"
          >
            x
          </button>
        </div>

        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ background: "rgba(0,82,255,0.07)", border: "1px solid rgba(0,82,255,0.15)" }}
        >
          <span className="text-sm text-white/60">One-time unlock price</span>
          <span className="text-2xl font-bold text-white">{usdcDisplay} USDC</span>
        </div>

        {step === "connect" && (
          <div className="space-y-4">
            <p className="text-sm text-white/50">
              Connect your wallet to get a payment address. You can send USDC from any wallet on Base.
            </p>
            <button
              onClick={() => open()}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={{ background: "#0052FF" }}
            >
              Connect Wallet
            </button>
          </div>
        )}

        {step === "awaiting" && !session && (
          <div className="py-4 text-center text-sm text-white/40">
            Generating payment address...
          </div>
        )}

        {step === "awaiting" && session && (
          <div className="space-y-4">
            <div className="space-y-1 text-sm text-white/50">
              <p>Send exactly <span className="text-white font-semibold">{usdcDisplay} USDC</span> on Base to this address.</p>
              <p>No wallet interaction needed beyond the transfer. No contract warnings.</p>
            </div>

            <div
              className="rounded-xl p-3 space-y-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs text-white/40 uppercase tracking-wider">Payment address</p>
              <p className="font-mono text-xs text-white break-all">{session.freshAddress}</p>
              <button
                onClick={copyAddress}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: copied ? "rgba(0,200,100,0.15)" : "rgba(0,82,255,0.15)",
                  color: copied ? "#4cff9f" : "#6699ff",
                  border: copied ? "1px solid rgba(0,200,100,0.3)" : "1px solid rgba(0,82,255,0.3)",
                }}
              >
                {copied ? "Copied" : "Copy address"}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-white/40">
              <span>Waiting for payment...</span>
              <span>Expires in {timeLeft}</span>
            </div>

            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-1 rounded-full animate-pulse"
                style={{ width: "100%", background: "rgba(0,82,255,0.5)" }}
              />
            </div>

            {session.sessionId && (
              <p className="text-xs text-white/20 break-all">Session: {session.sessionId}</p>
            )}
          </div>
        )}

        {step === "done" && (
          <div
            className="w-full py-4 rounded-xl text-center font-semibold"
            style={{ background: "rgba(0,200,100,0.12)", color: "#4cff9f", border: "1px solid rgba(0,200,100,0.25)" }}
          >
            Unlocked. Model is ready to download.
          </div>
        )}

        {step === "error" && (
          <div className="space-y-3">
            <div
              className="w-full py-3 rounded-xl text-center text-sm px-4"
              style={{ background: "rgba(200,40,40,0.12)", color: "#ff8080", border: "1px solid rgba(200,40,40,0.2)" }}
            >
              {errorMsg || "Something went wrong. Try again."}
            </div>
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: "#0052FF" }}
            >
              Try again
            </button>
          </div>
        )}

        <div className="text-xs text-white/30 leading-relaxed space-y-1">
          <p>Payment on Base network. One-time per wallet per model. Access is permanent.</p>
          <p>Your USDC goes directly to the LocalOS treasury. Relay happens automatically.</p>
        </div>
      </div>
    </div>
  );
}
