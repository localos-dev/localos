import { ethers } from "ethers";
import { db, paymentSessions, modelAccess, eq, and, sql } from "./localos-db.js";
import { decryptPk } from "./payment-crypto.js";
import { logger } from "./logger.js";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const GAS_BUFFER = ethers.parseEther("0.0002"); // 0.0002 ETH covers 2 txs on Base
const POLL_INTERVAL_MS = 15_000;

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

function getRpc(): string {
  return process.env.BASE_RPC_URL ?? "https://mainnet.base.org";
}

function getContractAddress(): string {
  const addr = process.env.CONTRACT_ADDRESS ?? "";
  if (!addr) {
    logger.warn("CONTRACT_ADDRESS not set: relay worker cannot forward USDC to treasury");
  }
  return addr;
}

function getDeployerWallet(): ethers.Wallet | null {
  const pk = process.env.DEPLOYER_PRIVATE_KEY ?? "";
  if (!pk) {
    logger.warn("DEPLOYER_PRIVATE_KEY not set: relay worker will not send gas");
    return null;
  }
  const provider = new ethers.JsonRpcProvider(getRpc());
  return new ethers.Wallet(pk, provider);
}

async function checkAndRelay(): Promise<void> {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  // Expire old sessions
  db.update(paymentSessions)
    .set({ status: "expired" })
    .where(and(
      eq(paymentSessions.status, "pending"),
      sql`expires_at < ${now}`,
    ))
    .run();

  // Find pending sessions not yet expired
  const pending = db.select().from(paymentSessions)
    .where(eq(paymentSessions.status, "pending"))
    .all();

  if (pending.length === 0) return;

  const provider = new ethers.JsonRpcProvider(getRpc());
  const usdc = new ethers.Contract(USDC_BASE, ERC20_ABI, provider);
  const deployerWallet = getDeployerWallet();
  const contractAddress = getContractAddress();

  for (const session of pending) {
    try {
      const balance: bigint = await usdc.balanceOf(session.freshAddress);

      if (balance < BigInt(session.amountUsdc)) continue;

      logger.info({ sessionId: session.id, balance: balance.toString() }, "USDC received, starting relay");

      db.update(paymentSessions)
        .set({ status: "received", usdcReceived: Number(balance) })
        .where(eq(paymentSessions.id, session.id))
        .run();

      if (!deployerWallet || !contractAddress) {
        logger.warn({ sessionId: session.id }, "Cannot relay: missing DEPLOYER_PRIVATE_KEY or CONTRACT_ADDRESS");
        continue;
      }

      db.update(paymentSessions)
        .set({ status: "relaying" })
        .where(eq(paymentSessions.id, session.id))
        .run();

      // Step 1: send gas ETH to fresh wallet
      const gasTx = await deployerWallet.sendTransaction({
        to: session.freshAddress,
        value: GAS_BUFFER,
      });
      await gasTx.wait(1);

      db.update(paymentSessions)
        .set({ gasTxHash: gasTx.hash })
        .where(eq(paymentSessions.id, session.id))
        .run();

      logger.info({ sessionId: session.id, gasTxHash: gasTx.hash }, "Gas funded");

      // Step 2: fresh wallet forwards USDC to treasury
      const freshPk = decryptPk(session.freshPkEncrypted);
      const freshWallet = new ethers.Wallet(freshPk, provider);
      const usdcWrite = new ethers.Contract(USDC_BASE, ERC20_ABI, freshWallet);

      const relayTx = await usdcWrite.transfer(contractAddress, balance);
      await relayTx.wait(1);

      logger.info({ sessionId: session.id, relayTxHash: relayTx.hash }, "USDC relayed to treasury");

      const completedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

      db.update(paymentSessions)
        .set({ status: "done", relayTxHash: relayTx.hash, completedAt })
        .where(eq(paymentSessions.id, session.id))
        .run();

      // Grant access
      try {
        db.insert(modelAccess).values({
          userWallet: session.userWallet,
          modelId: session.modelId,
          sessionId: session.id,
        }).run();
      } catch {
        // UNIQUE constraint: access already granted (idempotent)
      }

      logger.info({ sessionId: session.id, userWallet: session.userWallet, modelId: session.modelId }, "Access granted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error({ sessionId: session.id, error: msg }, "Relay failed");
      db.update(paymentSessions)
        .set({ status: "failed", errorMessage: msg })
        .where(eq(paymentSessions.id, session.id))
        .run();
    }
  }
}

export function startPaymentWorker(): void {
  logger.info("Payment worker started, polling every 15s");
  setInterval(() => {
    checkAndRelay().catch((err) => {
      logger.error(err, "Payment worker unhandled error");
    });
  }, POLL_INTERVAL_MS);
}
