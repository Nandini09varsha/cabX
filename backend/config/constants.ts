export const PROGRAM_ID =
  process.env.PROGRAM_ID || "BJBT5B3gFzmvsdobjmD5HxZgNkovwic4gpsea6HwBZif";

export const MIN_STAKE = Number(process.env.MIN_STAKE || 1_000_000);

export const VERIFY_VOTE_THRESHOLD = Number(
  process.env.VERIFY_VOTE_THRESHOLD || 3,
);

export const RIDE_STATUSES = [
  "requested",
  "accepted",
  "in_progress",
  "completed",
  "canceled",
];

export const CHAIN_STATUS_MAP = {
  requested: "requested",
  accepted: "accepted",
  inProgress: "in_progress",
  completed: "completed",
  canceled: "canceled",
};
