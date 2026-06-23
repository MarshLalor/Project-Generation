import React from "react";
 
export default function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}) {

  return (
    <section
      className={[
        "rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6",
        className,
      ].join(" ")}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
          )}
        </div>
      )}
 
      {children}
    </section>
  );
}