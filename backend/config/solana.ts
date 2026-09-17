import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.ts";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { PROGRAM_ID } from "./constants.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const idl = JSON.parse(
  readFileSync(join(__dirname, "../idl/ride_hailing.json"), "utf8"),
);

export const connection = new Connection(
  process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed",
);

export const programId = new PublicKey(PROGRAM_ID);

function loadAdminKeypair() {
  const raw = process.env.ADMIN_SECRET_KEY;
  if (!raw) {
    return Keypair.generate();
  }
  const secret = Uint8Array.from(JSON.parse(raw));
  return Keypair.fromSecretKey(secret);
}

export const adminKeypair = loadAdminKeypair();

export const hasAdminSigner = Boolean(process.env.ADMIN_SECRET_KEY);

const wallet = new Wallet(adminKeypair);
export const provider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

export const program = new Program(idl, provider);

export function getPaymentMint() {
  const mint = process.env.PAYMENT_MINT;
  if (!mint) {
    throw Object.assign(new Error("PAYMENT_MINT is not configured"), {
      status: 500,
    });
  }
  return new PublicKey(mint);
}
