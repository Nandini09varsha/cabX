import { PublicKey } from "@solana/web3.ts";
import { BN } from "@coral-xyz/anchor";
import { programId } from "../config/solana.ts";

export function toPublicKey(value) {
  return value instanceof PublicKey ? value : new PublicKey(value);
}

export function toRideIdBn(rideId) {
  return new BN(rideId);
}

export function rideIdToLeBytes(rideId) {
  return toRideIdBn(rideId).toArrayLike(Buffer, "le", 8);
}

export function getAdminPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("admin_state")],
    programId,
  )[0];
}

export function getDriverPda(authority) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("driver"), toPublicKey(authority).toBuffer()],
    programId,
  )[0];
}

export function getVaultAuthorityPda(authority) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_authority"), toPublicKey(authority).toBuffer()],
    programId,
  )[0];
}

export function getDriverVaultPda(authority) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), toPublicKey(authority).toBuffer()],
    programId,
  )[0];
}

export function getRidePda(rider, rideId) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("ride"),
      toPublicKey(rider).toBuffer(),
      rideIdToLeBytes(rideId),
    ],
    programId,
  )[0];
}
