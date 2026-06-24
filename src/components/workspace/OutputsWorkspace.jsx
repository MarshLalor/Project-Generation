import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import {
  buildOutputsPayload,
  getOutputsReadiness,
} from "../../utils/outputsHelpers";

function OutputPreviewCard({ title, value, onCopy, copyLabel, accent = "sky" }) {
  const borderClasses =
    accent === "orange"
      ? "border-orange-200 bg-orange-50"
      : "border-sky-100 bg-sky-50/60";

  return (
    <div className={`rounded-3xl border p-5 ${borderClasses}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            Preview of the compiled output text.
          </p>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-sky-200 transition hover:bg-sky-50"
        >
          {copyLabel}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/70 bg-white p-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {value}
        </pre>
      </div>
    </div>
  );
}

function StatusPill({ ready }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-medium",
        ready ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {ready ? "Ready" : "In progress"}
    </span>
  );
}

export default function OutputsWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToCost,
}) {
  const [copyState, setCopyState] = useState("idle");

  const outputs = useMemo(() => buildOutputsPayload(projectData), [projectData]);
  const readiness = useMemo(() => getOutputsReadiness(projectData), [projectData]);

  const copyText = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(label);
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch (error) {
      setCopyState("Copy Failed");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  };

  const handleRefreshOutputs = () => {
    setProjectData((prev) => ({ ...prev }));
  };

  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Outputs Studio</PillBadge>
              <PillBadge tone="softBlue">Compiled Deliverables</PillBadge>
              <PillBadge tone="orange">Export-Ready Shell</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Outputs Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              This tab compiles the project charter, plan summary, value summary,
              cost summary, and open questions into reusable outputs that are ready
              for future export.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onGoHome}
              className="w-full rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 sm:w-auto"
            >
              Back to Home
            </button>

            <button
              type="button"
              onClick={onBackToCost}
              className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
            >
              Back to Cost Estimate
            </button>

            <button
              type="button"
              onClick={handleRefreshOutputs}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Refresh Outputs
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Output readiness"
            subtitle="This shows how complete the current deliverables are based on the work completed across the tool."
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                Deliverable completeness
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {readiness.percent}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {readiness.completed} of {readiness.total} core outputs ready
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {readiness.checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3"
                >
                  <span className="text-sm text-slate-700">{check.label}</span>
                  <StatusPill ready={check.ready} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Quick copy actions"
            subtitle="Use these to copy the compiled outputs without scrolling through each preview."
          >
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => copyText(outputs.charterText, "Charter Copied")}
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Charter
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.projectPlanSummary, "Plan Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Project Plan Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.valueSummary, "Value Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Value Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.costSummary, "Cost Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Cost Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    outputs.openQuestionsAndAssumptions,
                    "Open Questions Copied"
                  )
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Open Questions & Assumptions
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.fullOutputPack, "Full Output Pack Copied")
                }
                className="rounded-2xl bg-orange-500 px-5 py-3 text-left text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Copy Full Output Pack
              </button>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Copy status</p>
                <p className="mt-2 text-sm text-slate-700">
                  {copyState === "idle" ? "No recent copy action." : copyState}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Planned export actions"
            subtitle="These are placeholders for the future document download feature."
          >
            <div className="space-y-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Download Charter
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Planned DOCX / PDF export of the project charter.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Download Value Summary
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Planned DOCX / PDF export of the value estimate summary.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Download Project Plan
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Planned DOCX / PDF export of the plan summary.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
                <p className="text-sm font-semibold text-orange-700">
                  Next build step
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Wire these outputs into actual DOCX / PDF generation and connect
                  them to the 3 save slots.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <OutputPreviewCard
            title="Project Charter"
            value={outputs.charterText}
            onCopy={() => copyText(outputs.charterText, "Charter Copied")}
            copyLabel="Copy Charter"
          />

          <OutputPreviewCard
            title="Project Plan Summary"
            value={outputs.projectPlanSummary}
            onCopy={() =>
              copyText(outputs.projectPlanSummary, "Plan Summary Copied")
            }
            copyLabel="Copy Plan"
          />

          <OutputPreviewCard
            title="Value Summary"
            value={outputs.valueSummary}
            onCopy={() => copyText(outputs.valueSummary, "Value Summary Copied")}
            copyLabel="Copy Value"
            accent="orange"
          />

          <OutputPreviewCard
            title="Cost Summary"
            value={outputs.costSummary}
            onCopy={() => copyText(outputs.costSummary, "Cost Summary Copied")}
            copyLabel="Copy Cost"
          />

          <OutputPreviewCard
            title="Open Questions & Assumptions"
            value={outputs.openQuestionsAndAssumptions}
            onCopy={() =>
              copyText(
                outputs.openQuestionsAndAssumptions,
                "Open Questions Copied"
              )
            }
            copyLabel="Copy Open Questions"
          />

          <OutputPreviewCard
            title="Full Output Pack"
            value={outputs.fullOutputPack}
            onCopy={() =>
              copyText(outputs.fullOutputPack, "Full Output Pack Copied")
            }
            copyLabel="Copy Full Pack"
            accent="orange"
          />
        </div>
      </div>
    </div>
  );
}