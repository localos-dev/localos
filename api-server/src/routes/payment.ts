import { Router } from "express";
import { ethers } from "ethers";
import { randomUUID } from "crypto";
import { db, paymentSessions, modelAccess, eq, and } from "../lib/localos-db.js";
import { encryptPk } from "../lib/payment-crypto.js";
import { getModelPrice } from "../lib/model-pricing.js";

const router = Router();

// POST /api/payment/init
// Generates a fresh deposit wallet for a payment session.
// User sends USDC to freshAddress; background worker completes the relay.
router.post("/payment/init", async (req, res) => {
  try {
    const { modelId, userWallet } = req.body as { modelId?: string; userWallet?: string };

    if (!modelId || typeof modelId !== "string") {
      res.status(400).json({ error: "modelId required" });
      return;
    }
    if (!userWallet || typeof userWallet !== "string" || !userWallet.startsWith("0x")) {
      res.status(400).json({ error: "userWallet required (0x address)" });
      return;
    }

    const wallet = userWallet.toLowerCase();
    const priceUsdc = getModelPrice(modelId);

    if (priceUsdc === 0) {
      res.status(400).json({ error: "Model is free, no payment needed" });
      return;
    }

    // Check if user already has access
    const existing = db.select().from(modelAccess)
      .where(and(eq(modelAccess.userWallet, wallet), eq(modelAccess.modelId, modelId)))
      .get();

    if (existing) {
      res.json({ alreadyPaid: true });
      return;
    }

    // Check for existing pending session for this wallet+model
    const pendingSession = db.select().from(paymentSessions)
      .where(and(
        eq(paymentSessions.userWallet, wallet),
        eq(paymentSessions.modelId, modelId),
        eq(paymentSessions.status, "pending"),
      ))
      .get();

    if (pendingSession) {
      const expiresAt = new Date(pendingSession.expiresAt + "Z");
      if (expiresAt > new Date()) {
        res.json({
          sessionId: pendingSession.id,
          freshAddress: pendingSession.freshAddress,
          amountUsdc: pendingSession.amountUsdc,
          expiresAt: pendingSession.expiresAt,
        });
        return;
      }
    }

    // Generate fresh wallet
    const freshWallet = ethers.Wallet.createRandom();
    const encryptedPk = encryptPk(freshWallet.privateKey);

    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);

    db.insert(paymentSessions).values({
      id: sessionId,
      userWallet: wallet,
      modelId,
      amountUsdc: priceUsdc,
      freshAddress: freshWallet.address.toLowerCase(),
      freshPkEncrypted: encryptedPk,
      status: "pending",
      expiresAt,
    }).run();

    res.json({
      sessionId,
      freshAddress: freshWallet.address,
      amountUsdc: priceUsdc,
      expiresAt,
    });
  } catch (err) {
    req.log.error(err, "payment/init error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/payment/status/:sessionId
router.get("/payment/status/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = db.select({
      status: paymentSessions.status,
      completedAt: paymentSessions.completedAt,
      errorMessage: paymentSessions.errorMessage,
      freshAddress: paymentSessions.freshAddress,
      amountUsdc: paymentSessions.amountUsdc,
      expiresAt: paymentSessions.expiresAt,
    }).from(paymentSessions).where(eq(paymentSessions.id, sessionId)).get();

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json(session);
  } catch (err) {
    req.log.error(err, "payment/status error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/payment/access?userWallet=0x...&modelId=...
router.get("/payment/access", (req, res) => {
  try {
    const userWallet = (req.query.userWallet as string | undefined)?.toLowerCase();
    const modelId = req.query.modelId as string | undefined;

    if (!userWallet || !modelId) {
      res.status(400).json({ error: "userWallet and modelId required" });
      return;
    }

    const access = db.select().from(modelAccess)
      .where(and(eq(modelAccess.userWallet, userWallet), eq(modelAccess.modelId, modelId)))
      .get();

    res.json({ hasAccess: !!access });
  } catch (err) {
    req.log.error(err, "payment/access error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
