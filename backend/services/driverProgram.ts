import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { program, getPaymentMint } from "../config/solana.ts";
import {
  getAdminPda,
  getDriverPda,
  getDriverVaultPda,
  getRidePda,
  getVaultAuthorityPda,
  toPublicKey,
  toRideIdBn,
} from "./pdas.ts";
import { buildUnsignedTransaction } from "./tx.ts";

export async function buildRegisterDriverTx({
  authority,
  driverTokenAccount,
  stakeAmount,
  vehicleHash,
  mint,
}) {
  const authorityKey = toPublicKey(authority);
  const mintKey = mint ? toPublicKey(mint) : getPaymentMint();
  const driverPda = getDriverPda(authorityKey);
  const vaultAuthority = getVaultAuthorityPda(authorityKey);
  const vault = getDriverVaultPda(authorityKey);

  const ix = await program.methods
    .registerDriver(new BN(stakeAmount), vehicleHash)
    .accounts({
      driver: driverPda,
      authority: authorityKey,
      driverTokenAccount: toPublicKey(driverTokenAccount),
      mint: mintKey,
      vaultAuthority,
      vault,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authorityKey,
    instructions: [ix],
  });

  return {
    ...payload,
    driverPda: driverPda.toBase58(),
    vaultPda: vault.toBase58(),
    vaultAuthorityPda: vaultAuthority.toBase58(),
    mint: mintKey.toBase58(),
  };
}

export async function buildVerifyDriverTx({ driverAuthority, adminAuthority }) {
  const driverPda = getDriverPda(driverAuthority);
  const adminPda = getAdminPda();
  const authority = toPublicKey(adminAuthority);

  const ix = await program.methods
    .verifyDriver()
    .accounts({
      driver: driverPda,
      authority,
      admin: adminPda,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authority,
    instructions: [ix],
  });

  return {
    ...payload,
    driverPda: driverPda.toBase58(),
    adminPda: adminPda.toBase58(),
  };
}

export async function buildSlashDriverTx({
  driverAuthority,
  adminAuthority,
  treasuryTokenAccount,
  slashAmount,
}) {
  const authority = toPublicKey(adminAuthority);
  const driverPda = getDriverPda(driverAuthority);
  const vaultAuthority = getVaultAuthorityPda(driverAuthority);
  const vault = getDriverVaultPda(driverAuthority);
  const adminPda = getAdminPda();

  const ix = await program.methods
    .slashDriver(new BN(slashAmount))
    .accounts({
      driver: driverPda,
      authority,
      admin: adminPda,
      vaultAuthority,
      vault,
      treasuryTokenAccount: toPublicKey(treasuryTokenAccount),
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authority,
    instructions: [ix],
  });

  return {
    ...payload,
    driverPda: driverPda.toBase58(),
    vaultPda: vault.toBase58(),
  };
}

export async function buildInitializeAdminTx(adminAuthority) {
  const authority = toPublicKey(adminAuthority);
  const adminPda = getAdminPda();

  const ix = await program.methods
    .initialize()
    .accounts({
      admin: adminPda,
      adminAuthority: authority,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const payload = await buildUnsignedTransaction({
    feePayer: authority,
    instructions: [ix],
  });

  return {
    ...payload,
    adminPda: adminPda.toBase58(),
  };
}

export async function fetchDriverAccount(authority) {
  const driverPda = getDriverPda(authority);
  try {
    const account = await program.account.driver.fetch(driverPda);
    return { driverPda, account };
  } catch (_error) {
    return { driverPda, account: null };
  }
}

export function serializeDriverAccount(account) {
  if (!account) return null;
  return {
    authority: account.authority.toBase58(),
    vehicleHash: Buffer.from(account.vehicleHash).toString("hex"),
    stakeAmount: account.stakeAmount.toString(),
    ratings: account.ratings,
    totalRatings: account.totalRatings.toString(),
    totalRides: account.totalRides.toString(),
    isVerified: account.isVerified,
    civicIdHash: Buffer.from(account.civicIdHash).toString("hex"),
    civicIdVerified: account.civicIdVerified,
    bump: account.bump,
    verifiedAt: account.verifiedAt.toString(),
  };
}

export { PublicKey, toRideIdBn };
