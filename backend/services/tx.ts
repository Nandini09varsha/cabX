import { Transaction } from "@solana/web3.js";
import { connection } from "../config/solana.ts";

export async function buildUnsignedTransaction({
  feePayer,
  instructions,
  extraSigners = [],
}) {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("finalized");
  const tx = new Transaction({
    feePayer,
    blockhash,
    lastValidBlockHeight,
  });
  tx.add(...instructions);
  if (extraSigners.length) {
    tx.partialSign(...extraSigners);
  }
  return {
    transaction: tx
      .serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      })
      .toString("base64"),
    blockhash,
    lastValidBlockHeight,
  };
}

export function chainStatusToLocal(status) {
  const key = Object.keys(status || {})[0];
  const map = {
    requested: "requested",
    accepted: "accepted",
    inProgress: "in_progress",
    completed: "completed",
    canceled: "canceled",
  };
  return map[key] || null;
}
