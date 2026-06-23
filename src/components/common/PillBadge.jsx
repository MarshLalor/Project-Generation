import React from "react";
 
export default function PillBadge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700 ring-slate-200",
    blue: "bg-sky-100 text-sky-700 ring-sky-200",
    softBlue: "bg-blue-50 text-blue-700 ring-blue-200",
    orange: "bg-orange-100 text-orange-700 ring-orange-200",
    teal: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  };
 
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}