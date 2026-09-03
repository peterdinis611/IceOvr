import { PuckSpinner } from "@/components/PuckSpinner";

export default function PlayerLoading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b14] px-6">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.05)_1px,transparent_1px)] [background-size:38px_38px]"
      />
      <div className="relative w-full max-w-md text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#7dd3fc]">
          IceOVR scouting department
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[.1em] text-white sm:text-5xl">
          BUILDING REPORT
        </h1>
        <p className="mt-3 text-sm text-[#94a3b8]">
          Reviewing public GitHub activity, form, and project impact.
        </p>
        <div className="relative mx-auto mt-6 h-40 max-w-sm overflow-hidden rounded-2xl border border-[#7dd3fc]/20 bg-[#071b2d]">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(90deg,transparent_49.5%,rgba(225,29,46,.65)_49.5%_50.5%,transparent_50.5%),radial-gradient(circle_at_50%_50%,transparent_0_28%,rgba(125,211,252,.3)_28.5%_29%,transparent_29.5%)]" />
          <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M274 138V42c0-12 10-22 22-22h38c12 0 22 10 22 22v96M274 62h60M274 88h60M274 114h60" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity=".55" />
            <path d="M28 134c54-2 93-25 126-68M39 132l47 3c10 0 18-6 23-16l10-22" fill="none" stroke="#d8f5ff" strokeWidth="7" strokeLinecap="round" opacity=".72" />
            <circle className="preload-puck" cx="82" cy="118" r="7" fill="#050505" stroke="rgba(255,255,255,.48)" strokeWidth="1.5" />
            <circle className="preload-ripple" cx="304" cy="76" r="8" fill="none" stroke="#e11d2e" strokeWidth="2" />
          </svg>
          <span className="absolute left-4 top-3 text-[9px] font-black uppercase tracking-[.22em] text-[#7dd3fc]">Scout replay</span>
          <span className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[.16em] text-white/55">Loading the player file</span>
        </div>
        <div className="mt-5">
          <PuckSpinner label="Preloading player data" />
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full border border-white/10 bg-white/5 p-px">
          <div className="scout-loader h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#e11d2e,#7dd3fc)] shadow-[0_0_18px_rgba(125,211,252,.7)]" />
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {["PROFILE", "ACTIVITY", "RATING"].map((step, index) => (
            <span
              key={step}
              className="rounded border border-white/10 bg-white/[.03] px-2 py-1 text-[9px] font-bold tracking-[.14em] text-[#94a3b8]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
