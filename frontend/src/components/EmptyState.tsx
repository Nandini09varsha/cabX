export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <Icon size={26} />
        </div>
      )}
      <h2 className="text-xl font-bold">{title}</h2>
      {text && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {text}
        </p>
      )}
      {action}
    </div>
  );
}
