import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  ACCOUNT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeAccountInstruction,
} from "@solana/spl-token";
import { connection, getPaymentMint, program } from "../config/solana.ts";
import { getDriverPda, getRidePda, toPublicKey } from "./pdas.ts";
import { buildUnsignedTransaction } from "./tx.ts";

export async function buildRequestRideTx({
  rider,
  riderTokenAccount,
  rideId,
  sourceHash,
  destinationHash,
  amount,
  mint,
}) {
  const riderKey = toPublicKey(rider);
  const mintKey = mint ? toPublicKey(mint) : getPaymentMint();
  const ridePda = getRidePda(riderKey, rideId);
  const vaultKeypair = Keypair.generate();
  const lamports = await connection.getMinimumBalanceForRentExemption(
    ACCOUNT_SIZE,
  );

  const createVaultIx = SystemProgram.createAccount({
    fromPubkey: riderKey,
    newAccountPubkey: vaultKeypair.publicKey,
    space: ACCOUNT_SIZE,
    lamports,
    programId: TOKEN_PROGRAM_ID,
  });

  const initVaultIx = createInitializeAccountInstruction(
    vaultKeypair.publicKey,
    mintKey,
    ridePda,
  );

  const requestIx = await program.methods
    .requestRide(
      new BN(rideId),
      sourceHash,
      destinationHash,
      new BN(amount),
    )
    .accounts({
      ride: ridePda,
      rider: riderKey,
      riderTokenAccount: toPublicKey(riderTokenAccount),
      vaultB: vaultKeypair.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: riderKey,
    instructions: [createVaultIx, initVaultIx, requestIx],
    extraSigners: [vaultKeypair],
  });

  return {
    ...payload,
    ridePda: ridePda.toBase58(),
    vaultB: vaultKeypair.publicKey.toBase58(),
    mint: mintKey.toBase58(),
  };
}

export async function buildAcceptRideTx({
  riderWallet,
  rideId,
  driverAuthority,
}) {
  const authority = toPublicKey(driverAuthority);
  const ridePda = getRidePda(riderWallet, rideId);
  const driverPda = getDriverPda(authority);

  const ix = await program.methods
    .acceptRide(new BN(rideId))
    .accounts({
      ride: ridePda,
      driver: driverPda,
      authority,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authority,
    instructions: [ix],
  });

  return { ...payload, ridePda: ridePda.toBase58(), driverPda: driverPda.toBase58() };
}

export async function buildStartRideTx({ riderWallet, rideId, driverAuthority }) {
  const authority = toPublicKey(driverAuthority);
  const ridePda = getRidePda(riderWallet, rideId);
  const driverPda = getDriverPda(authority);

  const ix = await program.methods
    .startRide(new BN(rideId))
    .accounts({
      rideAccount: ridePda,
      authority,
      driver: driverPda,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authority,
    instructions: [ix],
  });

  return { ...payload, ridePda: ridePda.toBase58() };
}

export async function buildCancelRideTx({
  riderWallet,
  rideId,
  vaultB,
  riderTokenAccount,
}) {
  const rider = toPublicKey(riderWallet);
  const ridePda = getRidePda(rider, rideId);

  const ix = await program.methods
    .cancelRide(new BN(rideId))
    .accounts({
      ride: ridePda,
      rider,
      vaultB: toPublicKey(vaultB),
      riderTokenAccount: toPublicKey(riderTokenAccount),
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: rider,
    instructions: [ix],
  });

  return { ...payload, ridePda: ridePda.toBase58() };
}

export async function buildCompleteRideTx({
  riderWallet,
  rideId,
  driverAuthority,
  vaultB,
  driverTokenAccount,
}) {
  const driver = toPublicKey(driverAuthority);
  const ridePda = getRidePda(riderWallet, rideId);

  const ix = await program.methods
    .completeRide(new BN(rideId))
    .accounts({
      ride: ridePda,
      driver,
      vaultB: toPublicKey(vaultB),
      driverTokenAccount: toPublicKey(driverTokenAccount),
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: driver,
    instructions: [ix],
  });

  return { ...payload, ridePda: ridePda.toBase58() };
}

export async function fetchRideAccount(riderWallet, rideId) {
  const ridePda = getRidePda(riderWallet, rideId);
  try {
    const account = await program.account.ride.fetch(ridePda);
    return { ridePda, account };
  } catch (_error) {
    return { ridePda, account: null };
  }
}

export function serializeRideAccount(account) {
  if (!account) return null;
  return {
    rider: account.rider.toBase58(),
    driver: account.driver.toBase58(),
    amount: account.amount.toString(),
    status: Object.keys(account.status)[0],
    sourceHash: Buffer.from(account.sourceHash).toString("hex"),
    destinationHash: Buffer.from(account.destinationHash).toString("hex"),
    timestamp: account.timestamp.toString(),
    bump: account.bump,
  };
}

export { PublicKey };
