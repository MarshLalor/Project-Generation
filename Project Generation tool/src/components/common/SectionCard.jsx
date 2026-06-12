import React from "react";

export default function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={[
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_60px_-24px_rgba(0,0,0,0.8)]",
        className,
      ].join(" ")}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
      )}

      {children}
    </section>
  );
}