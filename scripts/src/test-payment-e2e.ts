/**
 * E2E test script for the LocalOS payment system.
 *
 * Stages:
 *   Stage 1: API layer  — init session, status, access endpoints
 *   Stage 2: On-chain   — actual USDC send + relay (requires USDC in deployer wallet)
 *
 * Run: pnpm --filter @workspace/scripts run test-payment
 */

import { ethers } from "ethers";

const BASE_URL = "http://localhost:80";
const TEST_WALLET = "0x0000000000000000000000000000000000000001";
const TEST_MODEL_FREE = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC"; // free (700MB < 2GB)
const TEST_MODEL_PAID = "Llama-3.2-3B-Instruct-q4f16_1-MLC";     // 15 USDC (2140MB = 2.09GB)
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

let passed = 0;
let failed = 0;

function ok(label: string, detail?: string) {
  passed++;
  console.log(`  PASS  ${label}${detail ? "  (" + detail + ")" : ""}`);
}

function fail(label: string, detail?: string) {
  failed++;
  console.log(`  FAIL  ${label}${detail ? "  (" + detail + ")" : ""}`);
}

function skip(label: string, reason: string) {
  console.log(`  SKIP  ${label}  (${reason})`);
}

async function apiPost(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  return { status: res.status, body: await res.json() };
}

// ---------------------------------------------------------------------------
// Stage 1: API Layer
// ---------------------------------------------------------------------------
async function stageApiLayer() {
  console.log("\nStage 1: API layer\n");

  // 1a. Health check
  const health = await apiGet("/api/healthz");
  health.status === 200 && health.body.status === "ok"
    ? ok("GET /api/healthz returns 200 ok")
    : fail("GET /api/healthz", JSON.stringify(health.body));

  // 1b. init with free model should return error
  const free = await apiPost("/api/payment/init", { modelId: TEST_MODEL_FREE, userWallet: TEST_WALLET });
  free.status === 400 && free.body.error?.includes("free")
    ? ok("POST /api/payment/init rejects free model with 400")
    : fail("POST /api/payment/init free model", JSON.stringify(free.body));

  // 1c. init with missing params
  const missing = await apiPost("/api/payment/init", {});
  missing.status === 400
    ? ok("POST /api/payment/init rejects missing params with 400")
    : fail("POST /api/payment/init missing params", JSON.stringify(missing.body));

  // 1d. init with invalid wallet
  const badWallet = await apiPost("/api/payment/init", { modelId: TEST_MODEL_PAID, userWallet: "notanaddress" });
  badWallet.status === 400
    ? ok("POST /api/payment/init rejects invalid wallet with 400")
    : fail("POST /api/payment/init invalid wallet", JSON.stringify(badWallet.body));

  // 1e. init valid — creates session
  const init = await apiPost("/api/payment/init", { modelId: TEST_MODEL_PAID, userWallet: TEST_WALLET });
  if (init.status !== 200 || !init.body.sessionId || !init.body.freshAddress) {
    fail("POST /api/payment/init valid request", JSON.stringify(init.body));
    return null;
  }
  ok("POST /api/payment/init creates session", `freshAddress=${init.body.freshAddress.slice(0, 10)}... sessionId=${init.body.sessionId.slice(0, 8)}...`);

  const { sessionId, freshAddress, amountUsdc } = init.body as { sessionId: string; freshAddress: string; amountUsdc: number };

  // 1f. amount should be 15 USDC = 15_000_000 base units
  amountUsdc === 15_000_000
    ? ok("amountUsdc = 15000000 (15 USDC) for 2.09GB model")
    : fail("amountUsdc mismatch", `got ${amountUsdc}`);

  // 1g. freshAddress is valid hex
  ethers.isAddress(freshAddress)
    ? ok("freshAddress is valid Ethereum address")
    : fail("freshAddress invalid", freshAddress);

  // 1h. second init same wallet+model returns same session (idempotent)
  const init2 = await apiPost("/api/payment/init", { modelId: TEST_MODEL_PAID, userWallet: TEST_WALLET });
  init2.status === 200 && init2.body.sessionId === sessionId
    ? ok("POST /api/payment/init idempotent (same session returned)")
    : fail("POST /api/payment/init idempotent", JSON.stringify(init2.body));

  // 1i. status endpoint
  const status = await apiGet(`/api/payment/status/${sessionId}`);
  status.status === 200 && status.body.status === "pending"
    ? ok("GET /api/payment/status returns pending")
    : fail("GET /api/payment/status", JSON.stringify(status.body));

  // 1j. status 404 for unknown session
  const status404 = await apiGet("/api/payment/status/00000000-0000-0000-0000-000000000000");
  status404.status === 404
    ? ok("GET /api/payment/status returns 404 for unknown session")
    : fail("GET /api/payment/status 404", JSON.stringify(status404.body));

  // 1k. access check returns false (not paid yet)
  const access = await apiGet(`/api/payment/access?userWallet=${TEST_WALLET}&modelId=${TEST_MODEL_PAID}`);
  access.status === 200 && access.body.hasAccess === false
    ? ok("GET /api/payment/access returns hasAccess=false (not paid)")
    : fail("GET /api/payment/access", JSON.stringify(access.body));

  // 1l. access missing params
  const accessBad = await apiGet("/api/payment/access");
  accessBad.status === 400
    ? ok("GET /api/payment/access returns 400 for missing params")
    : fail("GET /api/payment/access missing params", JSON.stringify(accessBad.body));

  return { sessionId, freshAddress, amountUsdc };
}

// ---------------------------------------------------------------------------
// Stage 2: On-chain relay
// ---------------------------------------------------------------------------
async function stageOnChain(freshAddress: string, amountUsdc: number, sessionId: string) {
  console.log("\nStage 2: On-chain relay\n");

  const rpc = process.env.BASE_RPC_URL ?? "https://mainnet.base.org";
  const pk = process.env.DEPLOYER_PRIVATE_KEY ?? "";
  if (!pk) { fail("DEPLOYER_PRIVATE_KEY not set"); return; }
  if (!process.env.TREASURY_ADDRESS) { fail("TREASURY_ADDRESS not set"); return; }

  const provider = new ethers.JsonRpcProvider(rpc);
  const deployer = new ethers.Wallet(pk, provider);
  const usdc = new ethers.Contract(USDC_BASE, ERC20_ABI, provider);

  const [ethBal, usdcBal] = await Promise.all([
    provider.getBalance(deployer.address),
    usdc.balanceOf(deployer.address) as Promise<bigint>,
  ]);

  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  ETH:  ${ethers.formatEther(ethBal)} ETH`);
  console.log(`  USDC: ${(Number(usdcBal) / 1e6).toFixed(2)} USDC  (need ${amountUsdc / 1e6})`);

  if (usdcBal < BigInt(amountUsdc)) {
    skip(
      "USDC transfer to fresh wallet",
      `deployer has ${(Number(usdcBal) / 1e6).toFixed(2)} USDC, need ${amountUsdc / 1e6} USDC. Send USDC to deployer: ${deployer.address}`,
    );
    skip("Worker detection + relay", "no USDC to send");
    skip("model_access granted after payment", "no USDC to send");
    return;
  }

  ok(`Deployer has sufficient USDC (${(Number(usdcBal) / 1e6).toFixed(2)} USDC)`);

  // Send USDC to fresh wallet
  console.log(`\n  Sending ${amountUsdc / 1e6} USDC to ${freshAddress}...`);
  const usdcWithSigner = usdc.connect(deployer) as ethers.Contract;
  const tx = await usdcWithSigner.transfer(freshAddress, BigInt(amountUsdc));
  await tx.wait();
  ok(`USDC sent to fresh wallet`, `tx: ${tx.hash}`);

  // Poll session status until done (max 2 min)
  console.log("\n  Polling session status (max 2 min)...");
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 8000));
    const s = await apiGet(`/api/payment/status/${sessionId}`);
    const status = s.body.status as string;
    console.log(`    status: ${status}`);
    if (status === "done") break;
    if (status === "failed") { fail("Worker relay failed", s.body.errorMessage); return; }
  }

  const finalStatus = await apiGet(`/api/payment/status/${sessionId}`);
  finalStatus.body.status === "done"
    ? ok("Session status = done after relay")
    : fail("Session never reached done", `last status: ${finalStatus.body.status}`);

  // Verify model_access was granted
  const accessAfter = await apiGet(`/api/payment/access?userWallet=${TEST_WALLET}&modelId=${TEST_MODEL_PAID}`);
  accessAfter.body.hasAccess === true
    ? ok("GET /api/payment/access returns hasAccess=true after payment")
    : fail("model_access not granted after payment", JSON.stringify(accessAfter.body));

  // Verify USDC landed in treasury
  const treasuryUsdc: bigint = await usdc.balanceOf(process.env.TREASURY_ADDRESS);
  Number(treasuryUsdc) >= amountUsdc
    ? ok(`Treasury received USDC (balance: ${(Number(treasuryUsdc) / 1e6).toFixed(2)} USDC)`)
    : fail("Treasury USDC balance too low", `${(Number(treasuryUsdc) / 1e6).toFixed(2)} USDC`);

  return { provider, deployer, usdcBal: treasuryUsdc };
}

// ---------------------------------------------------------------------------
// Stage 3: Withdraw from treasury
// ---------------------------------------------------------------------------
async function stageWithdraw(
  provider: ethers.JsonRpcProvider,
  deployer: ethers.Wallet,
) {
  console.log("\nStage 3: Withdraw from treasury\n");

  const treasuryAddr = process.env.TREASURY_ADDRESS ?? "";
  if (!treasuryAddr) { fail("TREASURY_ADDRESS not set"); return; }

  const TREASURY_ABI = [
    "function withdrawAllToken(address token, address to) external",
    "function withdrawToken(address token, address to, uint256 amount) external",
  ];
  const treasury = new ethers.Contract(treasuryAddr, TREASURY_ABI, deployer);
  const usdc = new ethers.Contract(USDC_BASE, ERC20_ABI, provider);

  const balBefore: bigint = await usdc.balanceOf(treasuryAddr);
  const deployerBefore: bigint = await usdc.balanceOf(deployer.address);

  console.log(`  Treasury USDC before:  ${(Number(balBefore) / 1e6).toFixed(2)}`);
  console.log(`  Deployer USDC before:  ${(Number(deployerBefore) / 1e6).toFixed(2)}`);

  if (balBefore === 0n) {
    skip("withdrawAllToken", "treasury has 0 USDC (relay may not have landed yet)");
    return;
  }

  console.log(`  Calling withdrawAllToken(USDC, deployer)...`);
  const tx = await treasury.withdrawAllToken(USDC_BASE, deployer.address);
  const receipt = await tx.wait();
  ok(`withdrawAllToken tx confirmed`, `block ${receipt.blockNumber}  tx ${tx.hash}`);

  const balAfter: bigint = await usdc.balanceOf(treasuryAddr);
  const deployerAfter: bigint = await usdc.balanceOf(deployer.address);

  console.log(`  Treasury USDC after:   ${(Number(balAfter) / 1e6).toFixed(2)}`);
  console.log(`  Deployer USDC after:   ${(Number(deployerAfter) / 1e6).toFixed(2)}`);

  balAfter === 0n
    ? ok("Treasury USDC balance = 0 after withdraw")
    : fail("Treasury still has USDC after withdraw", `${(Number(balAfter) / 1e6).toFixed(2)}`);

  deployerAfter > deployerBefore
    ? ok(`Deployer received USDC from treasury (+${((Number(deployerAfter) - Number(deployerBefore)) / 1e6).toFixed(2)} USDC)`)
    : fail("Deployer USDC did not increase after withdraw");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("LocalOS Payment E2E Test");
  console.log("========================");

  const session = await stageApiLayer();
  if (!session) {
    console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
    process.exit(1);
  }

  const onChainResult = await stageOnChain(session.freshAddress, session.amountUsdc, session.sessionId);

  if (onChainResult) {
    await stageWithdraw(onChainResult.provider, onChainResult.deployer);
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
