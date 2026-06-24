import React from "react";

export default function OutputSummaryCard({
  title,
  value,
  accent = "sky",
  helper,
}) {
  const classes =
    accent === "orange"
      ? "border-orange-200 bg-orange-50"
      : "border-sky-100 bg-sky-50/60";

  return (
    <div className={`rounded-2xl border p-4 ${classes}`}>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>

      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value && value.trim() ? value : "No content yet."}
      </p>
    </div>
  );
}
``