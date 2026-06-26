import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildValidationSummaryText,
  getValidationReadiness,
} from "../../utils/validationHelpers";

function StatusBadge({ ready, severity }) {
  const classes = ready
    ? "bg-sky-100 text-sky-700"
    : severity === "required"
    ? "bg-orange-100 text-orange-700"
    : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
      {ready ? "Ready" : severity === "required" ? "Required gap" : "Recommended"}
    </span>
  );
}

export default function ValidationReadinessPanel({ projectData }) {
  const [copyStatus, setCopyStatus] = useState("No recent copy action.");

  const readiness = useMemo(
    () => getValidationReadiness(projectData),
    [projectData]
  );

  const summaryText = useMemo(
    () => buildValidationSummaryText(projectData),
    [projectData]
  );

  const groupedChecks = useMemo(() => {
    return readiness.checks.reduce((acc, check) => {
      if (!acc[check.section]) acc[check.section] = [];
      acc[check.section].push(check);
      return acc;
    }, {});
  }, [readiness.checks]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyStatus("Validation summary copied.");
      window.setTimeout(() => setCopyStatus("No recent copy action."), 1800);
    } catch (error) {
      setCopyStatus("Copy failed.");
      window.setTimeout(() => setCopyStatus("No recent copy action."), 2200);
    }
  };

  return (
    <SectionCard
      title="Executive Review Readiness"
      subtitle="Use this validation panel to identify gaps before sponsor review, executive summary generation, or export."
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OutputSummaryCard
            title="Overall Readiness"
            value={`${readiness.percent}%`}
            accent={readiness.executiveReady ? "sky" : "orange"}
          />
          <OutputSummaryCard
            title="Required Readiness"
            value={`${readiness.requiredPercent}%`}
            accent={readiness.missingRequired.length ? "orange" : "sky"}
          />
          <OutputSummaryCard
            title="Required Gaps"
            value={String(readiness.missingRequired.length)}
            accent={readiness.missingRequired.length ? "orange" : "sky"}
          />
          <OutputSummaryCard
            title="Executive Ready"
            value={readiness.executiveReady ? "Yes" : "No"}
            accent={readiness.executiveReady ? "sky" : "orange"}
          />
        </div>

        <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Validation summary
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Copy this summary to review gaps or include it in working notes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Copy Validation Summary
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-700">{copyStatus}</p>
        </div>

        {readiness.missingRequired.length > 0 ? (
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
            <h3 className="text-base font-semibold text-orange-700">
              Required gaps to resolve
            </h3>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {readiness.missingRequired.map((item) => (
                <li key={item.id}>
                  • <span className="font-semibold">{item.section}:</span>{" "}
                  {item.recommendation}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-4">
            <h3 className="text-base font-semibold text-sky-700">
              Required checks complete
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              All required checks are complete. Review recommended improvements
              before final executive export.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedChecks).map(([section, checks]) => (
            <div
              key={section}
              className="rounded-3xl border border-sky-100 bg-white p-4"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {section}
              </h3>

              <div className="mt-3 space-y-3">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex flex-col gap-2 rounded-2xl border border-sky-100 bg-sky-50/40 p-3 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {check.label}
                      </p>
                      {!check.ready ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {check.recommendation}
                        </p>
                      ) : null}
                    </div>

                    <StatusBadge
                      ready={check.ready}
                      severity={check.severity}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}