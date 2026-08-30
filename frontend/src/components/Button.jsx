function Button({ children, loading, className = "", ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-full bg-[#0B0B0B] px-6 py-3 font-semibold text-white transition hover:bg-[#F5C518] hover:text-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#F5C518] dark:text-black dark:hover:bg-white ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
