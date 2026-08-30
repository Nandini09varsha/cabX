function Input({ label, error, className = "", ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#0B0B0B] outline-none transition focus:border-[#F5C518] dark:border-[#333333] dark:bg-[#171717] dark:text-white ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
