export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-[#333] dark:bg-[#171717]">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518]/20">
          <Icon size={26} />
        </div>
      )}
      <h2 className="text-xl font-bold">{title}</h2>
      {text && (
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {text}
        </p>
      )}
      {action}
    </div>
  );
}
