export function fromChainAmount(amount, decimals = 6) {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return 0;
  return value / 10 ** decimals;
}

export function toChainAmount(display, decimals = 6) {
  const value = Number(display || 0);
  if (!Number.isFinite(value) || value <= 0) return "0";
  return String(Math.round(value * 10 ** decimals));
}

export function formatToken(amount, decimals = 6) {
  return fromChainAmount(amount, decimals).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatFare(amount, decimals = 6) {
  return `₹${formatToken(amount, decimals)}`;
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function shortAddress(address) {
  if (!address) return "Not linked";
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function statusLabel(status) {
  const map = {
    requested: "Requested",
    accepted: "Accepted",
    in_progress: "In progress",
    completed: "Completed",
    canceled: "Canceled",
  };
  return map[status] || status || "Unknown";
}

export function initials(name) {
  return (name || "CX")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function apiError(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}
