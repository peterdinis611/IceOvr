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
