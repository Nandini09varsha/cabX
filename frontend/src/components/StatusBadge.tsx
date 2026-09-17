const styles = {
  requested: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  in_progress: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  canceled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

export default function StatusBadge({ status }) {
  const label = String(status || "unknown").replace("_", " ");
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600 dark:bg-[#222] dark:text-gray-300"
      }`}
    >
      {label}
    </span>
  );
}
