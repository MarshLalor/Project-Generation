import React, { useMemo, useState } from "react";
import {
  getCurrentStepStatus,
  getNextRecommendedStep,
} from "../../utils/flowHelpers";

function StatusPill({ status }) {
  const classes =
    status === "completed"
      ? "bg-sky-100 text-sky-700"
      : status === "next"
      ? "bg-orange-100 text-orange-700"
      : status === "needs-work"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-slate-100 text-slate-600";

  const label =
    status === "completed"
      ? "Completed"
      : status === "next"
      ? "Next best step"
      : status === "needs-work"
      ? "Needs work"
      : "Not started";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

export default function NextStepBanner({ projectData, activeTab, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const nextStep = useMemo(
    () => getNextRecommendedStep(projectData),
    [projectData]
  );

  const currentStep = useMemo(
    () => getCurrentStepStatus(projectData, activeTab),
    [projectData, activeTab]
  );

  if (!nextStep || !currentStep) {
    return null;
  }

  const isOnNextStep = activeTab === nextStep.id;

  return (
    <section className="w-full overflow-hidden rounded-[1.5rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-sky-50 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
            Suggestion
          </span>

          <span className="shrink-0 text-sm font-semibold text-slate-400">
            &gt;
          </span>

          <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
            {nextStep.label}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden md:inline-flex">
            <StatusPill status={currentStep.status} />
          </span>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-sky-100">
            {isOpen ? "Hide" : "Show"}
          </span>
        </div>
      </button>

      <div className={`${isOpen ? "block" : "hidden lg:block"} px-4 pb-4 sm:px-5`}>
        <div className="border-t border-orange-100 pt-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={currentStep.status} />

                {!isOnNextStep ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-sky-100">
                    Suggested next: {nextStep.label}
                  </span>
                ) : (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                    You are on the recommended step
                  </span>
                )}
              </div>

              <h2 className="mt-3 break-words text-lg font-semibold text-slate-950">
                {isOnNextStep
                  ? `Focus here: ${nextStep.label}`
                  : `Next best step: ${nextStep.label}`}
              </h2>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-700">
                {nextStep.reason}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                No sections are locked. You can move freely through the tool at
                any time.
              </p>
            </div>

            {!isOnNextStep ? (
              <button
                type="button"
                onClick={() => onNavigate(nextStep.id)}
                className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 lg:w-auto"
              >
                Go to {nextStep.shortLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}