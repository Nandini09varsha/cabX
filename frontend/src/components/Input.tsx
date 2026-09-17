import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({
  label,
  error,
  className = "",
  showToggle = false,
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);
  const inputType = showToggle
    ? visible
      ? "text"
      : "password"
    : props.type;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 ${
            showToggle ? "pr-12" : ""
          } ${className}`}
          {...props}
          type={inputType}
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
