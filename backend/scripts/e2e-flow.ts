import "dotenv/config";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.ts";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";

const API = process.env.API_BASE || "http://127.0.0.1:5000/api";
const RPC = process.env.SOLANA_RPC_URL || "http://127.0.0.1:8899";
const MINT = new PublicKey(process.env.PAYMENT_MINT);
const connection = new Connection(RPC, "confirmed");

const adminSecret = Uint8Array.from(JSON.parse(process.env.ADMIN_SECRET_KEY));
const payer = Keypair.fromSecretKey(adminSecret);
const riderWallet = Keypair.generate();
const driverWallet = Keypair.generate();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function api(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

async function airdrop(pubkey, sol = 5) {
  const sig = await connection.requestAirdrop(pubkey, sol * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");
}

async function ensureAta(owner) {
  const ata = await getAssociatedTokenAddress(MINT, owner.publicKey);
  const info = await connection.getAccountInfo(ata);
  if (!info) {
    const tx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey,
        ata,
        owner.publicKey,
        MINT,
      ),
    );
    await sendAndConfirmTransaction(connection, tx, [payer]);
  }
  return ata;
}

async function mintTokens(ata, amount) {
  const mintInfo = await getMint(connection, MINT);
  const raw = BigInt(amount) * 10n ** BigInt(mintInfo.decimals);
  const tx = new Transaction().add(
    createMintToInstruction(MINT, ata, payer.publicKey, raw),
  );
  await sendAndConfirmTransaction(connection, tx, [payer]);
}

async function signAndSend(base64, signers) {
  const tx = Transaction.from(Buffer.from(base64, "base64"));
  tx.partialSign(...signers);
  const sig = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: false,
  });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

async function registerUser(role, name, email, phone) {
  return api("/auth/register", {
    method: "POST",
    body: { name, email, phone, password: "secret12", role },
  });
}

async function main() {
  console.log("== CabX e2e: frontend API → backend → contracts ==");
  console.log("RPC", RPC);
  console.log("PROGRAM_ID", process.env.PROGRAM_ID);
  console.log("MINT", MINT.toBase58());

  await airdrop(payer.publicKey, 20);
  await airdrop(riderWallet.publicKey, 5);
  await airdrop(driverWallet.publicKey, 5);

  const riderAta = await ensureAta(riderWallet);
  const driverAta = await ensureAta(driverWallet);
  await mintTokens(riderAta, 500);
  await mintTokens(driverAta, 500);
  console.log("funded wallets");

  const stamp = Date.now();
  const riderAuth = await registerUser(
    "rider",
    "E2E Rider",
    `rider.${stamp}@cabx.test`,
    `91${String(stamp).slice(-8)}1`,
  );
  const driverAuth = await registerUser(
    "driver",
    "E2E Driver",
    `driver.${stamp}@cabx.test`,
    `91${String(stamp).slice(-8)}2`,
  );
  const adminAuth = await registerUser(
    "admin",
    "E2E Admin",
    `admin.${stamp}@cabx.test`,
    `91${String(stamp).slice(-8)}3`,
  );

  await api("/auth/wallet", {
    method: "PUT",
    token: riderAuth.token,
    body: {
      walletAddress: riderWallet.publicKey.toBase58(),
      tokenAccount: riderAta.toBase58(),
    },
  });
  await api("/auth/wallet", {
    method: "PUT",
    token: driverAuth.token,
    body: {
      walletAddress: driverWallet.publicKey.toBase58(),
      tokenAccount: driverAta.toBase58(),
    },
  });
  await api("/auth/wallet", {
    method: "PUT",
    token: adminAuth.token,
    body: {
      walletAddress: payer.publicKey.toBase58(),
      tokenAccount: (await ensureAta(payer)).toBase58(),
    },
  });
  console.log("users + wallets linked");

  const { PublicKey: PK } = await import("@solana/web3.ts");
  const adminPda = PK.findProgramAddressSync(
    [Buffer.from("admin_state")],
    new PK(process.env.PROGRAM_ID),
  )[0];
  const adminInfo = await connection.getAccountInfo(adminPda);
  if (!adminInfo) {
    const init = await api("/admin/initialize", {
      method: "POST",
      token: adminAuth.token,
    });
    const initSig = await signAndSend(init.transaction, [payer]);
    console.log("admin initialized", initSig);
  } else {
    console.log("admin already initialized");
  }

  const register = await api("/drivers/register", {
    method: "POST",
    token: driverAuth.token,
    body: {
      vehicle: {
        type: "Sedan",
        model: "Dzire",
        number: "UP14AB1234",
        color: "white",
      },
      stakeAmount: "1000000",
      driverTokenAccount: driverAta.toBase58(),
    },
  });
  const registerSig = await signAndSend(register.transaction, [driverWallet]);
  await api("/drivers/register/confirm", {
    method: "POST",
    token: driverAuth.token,
    body: { signature: registerSig },
  });
  console.log("driver staked", registerSig);

  const verify = await api(`/admin/drivers/${register.driver._id}/verify`, {
    method: "POST",
    token: adminAuth.token,
  });
  const verifySig = await signAndSend(verify.transaction, [payer]);
  await api(`/admin/drivers/${register.driver._id}/verify/confirm`, {
    method: "POST",
    token: adminAuth.token,
    body: { signature: verifySig },
  });
  console.log("driver verified", verifySig);

  const me = await api("/drivers/me", { token: driverAuth.token });
  assert(me.driver?.isVerified === true, "driver should be verified");

  await api("/drivers/availability", {
    method: "PUT",
    token: driverAuth.token,
    body: { online: true },
  });

  const request = await api("/rides", {
    method: "POST",
    token: riderAuth.token,
    body: {
      source: "Indirapuram Habitat Centre",
      destination: "Shipra Mall",
      amount: "142000000",
      riderTokenAccount: riderAta.toBase58(),
      rideType: "mini",
      distanceKm: 4.2,
      durationMin: 18,
    },
  });
  const requestSig = await signAndSend(request.transaction, [riderWallet]);
  const confirmedRequest = await api(`/rides/${request.ride._id}/confirm`, {
    method: "POST",
    token: riderAuth.token,
    body: { signature: requestSig },
  });
  assert(confirmedRequest.ride.status === "requested", "ride should be requested");
  console.log("ride escrow locked", requestSig);

  const open = await api("/rides/open", { token: driverAuth.token });
  assert(
    open.rides.some((ride) => ride._id === request.ride._id),
    "open rides should include new ride",
  );

  const accept = await api(`/rides/${request.ride._id}/accept`, {
    method: "POST",
    token: driverAuth.token,
  });
  const acceptSig = await signAndSend(accept.transaction, [driverWallet]);
  const accepted = await api(`/rides/${request.ride._id}/accept/confirm`, {
    method: "POST",
    token: driverAuth.token,
    body: { signature: acceptSig },
  });
  assert(accepted.ride.status === "accepted", "ride should be accepted");
  console.log("ride accepted", acceptSig);

  const start = await api(`/rides/${request.ride._id}/start`, {
    method: "POST",
    token: driverAuth.token,
  });
  const startSig = await signAndSend(start.transaction, [driverWallet]);
  const started = await api(`/rides/${request.ride._id}/start/confirm`, {
    method: "POST",
    token: driverAuth.token,
    body: { signature: startSig },
  });
  assert(started.ride.status === "in_progress", "ride should be in progress");
  console.log("ride started", startSig);

  const complete = await api(`/rides/${request.ride._id}/complete`, {
    method: "POST",
    token: driverAuth.token,
    body: { driverTokenAccount: driverAta.toBase58() },
  });
  const completeSig = await signAndSend(complete.transaction, [driverWallet]);
  const completed = await api(`/rides/${request.ride._id}/complete/confirm`, {
    method: "POST",
    token: driverAuth.token,
    body: { signature: completeSig },
  });
  assert(completed.ride.status === "completed", "ride should be completed");
  console.log("ride completed", completeSig);

  await api(`/rides/${request.ride._id}/rate`, {
    method: "POST",
    token: riderAuth.token,
    body: { score: 5 },
  });
  await api(`/rides/${request.ride._id}/rate`, {
    method: "POST",
    token: driverAuth.token,
    body: { score: 4 },
  });
  console.log("ratings submitted");

  const payments = await api("/payments", { token: riderAuth.token });
  const earnings = await api("/drivers/earnings", { token: driverAuth.token });
  const rideDetail = await api(`/rides/${request.ride._id}`, {
    token: riderAuth.token,
  });

  assert(payments.payments.length >= 2, "escrow lock + release expected");
  assert(Number(earnings.total) >= 142000000, "driver earnings should include fare");
  assert(rideDetail.onchain?.status === "completed", "on-chain status should be completed");

  console.log("\nPASS: full ride lifecycle settled on-chain");
  console.log(
    JSON.stringify(
      {
        rideId: request.ride._id,
        onchain: rideDetail.onchain,
        payments: payments.payments.map((p) => p.kind),
        earnings: earnings.total,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exit(1);
});
