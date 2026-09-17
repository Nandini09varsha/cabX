import {
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import api from "../api/axios";

let cachedConfig = null;

export async function getChainConfig() {
  if (cachedConfig) return cachedConfig;
  const { data } = await api.get("/config");
  cachedConfig = data;
  return data;
}

export async function getConnection() {
  const config = await getChainConfig();
  return new Connection(config.rpcUrl, "confirmed");
}

export function getPhantom() {
  const provider = window.solana;
  if (!provider?.isPhantom) {
    throw new Error("Phantom wallet is required. Install it and try again.");
  }
  return provider;
}

export async function getTokenAccountAddress(owner) {
  const config = await getChainConfig();
  if (!config.paymentMint) {
    throw new Error("Payment mint is not configured on the server");
  }
  return getAssociatedTokenAddress(
    new PublicKey(config.paymentMint),
    new PublicKey(owner),
  );
}

export async function ensureTokenAccount(owner) {
  const config = await getChainConfig();
  const connection = await getConnection();
  const mint = new PublicKey(config.paymentMint);
  const ownerKey = new PublicKey(owner);
  const ata = await getAssociatedTokenAddress(mint, ownerKey);

  try {
    await getAccount(connection, ata);
    return ata.toBase58();
  } catch {
    const phantom = getPhantom();
    const instruction = createAssociatedTokenAccountInstruction(
      ownerKey,
      ata,
      ownerKey,
      mint,
    );
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction({
      feePayer: ownerKey,
      blockhash,
      lastValidBlockHeight,
    }).add(instruction);
    const { signature } = await phantom.signAndSendTransaction(tx);
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed",
    );
    return ata.toBase58();
  }
}

export async function signAndSendBase64(transactionBase64) {
  const phantom = getPhantom();
  const connection = await getConnection();
  const tx = Transaction.from(Buffer.from(transactionBase64, "base64"));
  // Use signTransaction + sendRaw so backend co-signers (escrow vault) stay intact.
  const signed = await phantom.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
  });
  const latest = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction(
    {
      signature,
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
    },
    "confirmed",
  );
  return signature;
}
