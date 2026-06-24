import React from "react";
import PillBadge from "../common/PillBadge";
import SectionCard from "../common/SectionCard";

export default function BuilderLayout({
  badges = [],
  title,
  description,
  actions,
  progress,
  left,
  right,
}) {
  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {badges.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <PillBadge key={badge.label} tone={badge.tone || "default"}>
                    {badge.label}
                  </PillBadge>
                ))}
              </div>
            )}

            <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>

            {description && (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
                {description}
              </p>
            )}
          </div>

          {actions ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              {actions}
            </div>
          ) : null}
        </div>
      </SectionCard>

      {progress ? (
        <SectionCard
          title={progress.title || "Section progress"}
          subtitle={
            progress.subtitle ||
            "A quick view of how complete the current workspace is."
          }
        >
          <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                {progress.metricLabel || "Workspace completeness"}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {progress.percent}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {progress.detail ||
                  `${progress.completed} of ${progress.total} tracked items completed`}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <p className="text-sm font-semibold text-sky-700">
                {progress.secondaryLabel || "What this means"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {progress.secondaryText ||
                  "As more structured information is added, the prompt quality and downstream outputs improve."}
              </p>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">{left}</div>
        <div className="space-y-6">{right}</div>
      </div>
    </div>
  );
}