export function PuckSpinner({
  label = "Loading",
  className = "",
  size = "md",
}: {
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span aria-hidden className={`puck-spinner relative rounded-full bg-[#05070a] shadow-[inset_0_2px_3px_rgba(255,255,255,.2),0_4px_10px_rgba(0,0,0,.5)] ${size === "sm" ? "h-4 w-4" : "h-7 w-7"}`}>
        <span className="absolute inset-1 rounded-full border border-white/15" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7dd3fc]" />
      </span>
      <span className={size === "sm" ? "sr-only" : "text-[10px] font-black uppercase tracking-[.2em] text-[#7dd3fc]"}>{label}</span>
    </span>
  );
}
