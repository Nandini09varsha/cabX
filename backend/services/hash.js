import { createHash } from "crypto";

export function sha256Bytes(value) {
  return createHash("sha256").update(value).digest();
}

export function hashToBytes32(value) {
  const digest = sha256Bytes(typeof value === "string" ? value : JSON.stringify(value));
  return Array.from(digest);
}

export function bytesToHex(bytes) {
  return Buffer.from(bytes).toString("hex");
}

export function normalizePlace(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function hashPlace(value) {
  return hashToBytes32(normalizePlace(value));
}

export function hashVehicle(vehicle) {
  const payload = {
    type: String(vehicle.type || "").trim().toLowerCase(),
    model: String(vehicle.model || "").trim().toLowerCase(),
    number: String(vehicle.number || "").trim().toUpperCase(),
    color: String(vehicle.color || "").trim().toLowerCase(),
  };
  return hashToBytes32(payload);
}
