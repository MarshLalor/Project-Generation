import React from "react";

export default function PillBadge({ children, tone = "default" }) {
  const tones = {
    default: "bg-white/5 text-slate-300 ring-white/10",
    cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    violet: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}