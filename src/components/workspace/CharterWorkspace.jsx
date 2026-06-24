import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import { generateCharterPayload } from "../../utils/charterHelpers";

function FieldLabel({ label, helper }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-slate-900">{label}</label>
      {helper && <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  );
}

function CharterSectionEditor({ label, value, onChange, rows = 5 }) {
  return (
    <div>
      <FieldLabel label={label} />
      <TextArea value={value} onChange={onChange} rows={rows} />
    </div>
  );
}

export default function CharterWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToBasics,
  onContinueToPlan,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const basics = projectData.projectBasics;
  const charter = projectData.charter;

  const previewPayload = useMemo(() => {
    return generateCharterPayload(projectData);
  }, [projectData]);

  const effectiveCharterText =
    charter.charterText && charter.charterText.trim()
      ? charter.charterText
      : previewPayload.charterText;

  const effectiveAiPrompt =
    charter.aiPrompt && charter.aiPrompt.trim()
      ? charter.aiPrompt
      : previewPayload.aiPrompt;

  const handleCharterChange = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      charter: {
        ...prev.charter,
        [field]: value,
      },
    }));
  };

  const handleGenerateFromProject = () => {
    const payload = generateCharterPayload(projectData);

    setProjectData((prev) => ({
      ...prev,
      charter: {
        ...prev.charter,
        ...payload,
      },
    }));
  };

  const handleRefreshTextFromSections = () => {
    const liveData = {
      ...charter,
      charterText: previewPayload.charterText,
    };

    setProjectData((prev) => ({
      ...prev,
      charter: {
        ...prev.charter,
        ...liveData,
      },
    }));
  };

  const handleCopyCharter = async () => {
    try {
      await navigator.clipboard.writeText(effectiveCharterText);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Charter Workspace</PillBadge>
              <PillBadge tone="softBlue">Editable Draft</PillBadge>
              <PillBadge tone="orange">AI Refinement Ready</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Project Charter Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              Generate a structured charter from the Project Basics and Ideation
              content, refine the sections, and prepare a copy-ready charter that
              can later be exported.
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
              onClick={onBackToBasics}
              className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
            >
              Back to Project Basics
            </button>

            <button
              type="button"
              onClick={onContinueToPlan}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Go to Plan Studio
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard
            title="Generated charter sections"
            subtitle="Use the project basics as your source of truth, then refine the section content below."
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleGenerateFromProject}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Generate Charter from Project
              </button>

              <button
                type="button"
                onClick={handleRefreshTextFromSections}
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Refresh Charter Text
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <CharterSectionEditor
                label="Background / Business Need"
                value={
                  charter.backgroundBusinessNeed || previewPayload.backgroundBusinessNeed
                }
                onChange={(e) =>
                  handleCharterChange("backgroundBusinessNeed", e.target.value)
                }
                rows={5}
              />

              <CharterSectionEditor
                label="Problem Statement"
                value={charter.problemStatement || previewPayload.problemStatement}
                onChange={(e) =>
                  handleCharterChange("problemStatement", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Project Objectives"
                value={charter.projectObjectives || previewPayload.projectObjectives}
                onChange={(e) =>
                  handleCharterChange("projectObjectives", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Scope Summary"
                value={charter.scopeSummary || previewPayload.scopeSummary}
                onChange={(e) => handleCharterChange("scopeSummary", e.target.value)}
                rows={7}
              />

              <CharterSectionEditor
                label="Key Stakeholders"
                value={charter.keyStakeholders || previewPayload.keyStakeholders}
                onChange={(e) =>
                  handleCharterChange("keyStakeholders", e.target.value)
                }
                rows={5}
              />

              <CharterSectionEditor
                label="Timeline / Milestones"
                value={charter.timelineMilestones || previewPayload.timelineMilestones}
                onChange={(e) =>
                  handleCharterChange("timelineMilestones", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Assumptions"
                value={charter.assumptions || previewPayload.assumptions}
                onChange={(e) => handleCharterChange("assumptions", e.target.value)}
                rows={4}
              />

              <CharterSectionEditor
                label="Constraints"
                value={charter.constraints || previewPayload.constraints}
                onChange={(e) => handleCharterChange("constraints", e.target.value)}
                rows={4}
              />

              <CharterSectionEditor
                label="Risks / Dependencies"
                value={charter.risksDependencies || previewPayload.risksDependencies}
                onChange={(e) =>
                  handleCharterChange("risksDependencies", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Success Criteria"
                value={charter.successCriteria || previewPayload.successCriteria}
                onChange={(e) =>
                  handleCharterChange("successCriteria", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Initial Value Hypothesis"
                value={
                  charter.initialValueHypothesis ||
                  previewPayload.initialValueHypothesis
                }
                onChange={(e) =>
                  handleCharterChange("initialValueHypothesis", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Recommended Next Steps"
                value={
                  charter.recommendedNextSteps ||
                  previewPayload.recommendedNextSteps
                }
                onChange={(e) =>
                  handleCharterChange("recommendedNextSteps", e.target.value)
                }
                rows={4}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Charter text preview"
            subtitle="This is the full copy-ready charter text built from your current content."
          >
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
              <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {effectiveCharterText}
              </pre>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleRefreshTextFromSections}
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Refresh Text
              </button>

              <button
                type="button"
                onClick={handleCopyCharter}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {copyStatus === "copied"
                  ? "Charter Copied"
                  : copyStatus === "failed"
                  ? "Copy Failed"
                  : "Copy Charter"}
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="AI refinement prompt"
            subtitle="Use this if you want an AI partner to improve the charter while preserving the known project facts."
          >
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
              <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {effectiveAiPrompt}
              </pre>
            </div>
          </SectionCard>

          <SectionCard
            title="Paste AI refinement response"
            subtitle="You can store the AI feedback or refined charter notes here until you decide how to apply them."
          >
            <TextArea
              value={charter.aiResponse}
              onChange={(e) => handleCharterChange("aiResponse", e.target.value)}
              placeholder={`Paste any refined charter response or notes here.

Suggested structure:
A. Refined Charter
B. Open Questions
C. Areas that still need confirmation
D. Suggested next actions`}
              rows={12}
            />
          </SectionCard>

          <SectionCard
            title="Charter source snapshot"
            subtitle="These basics are what currently feed the charter."
          >
            <div className="space-y-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Project Title
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {basics.title || "Not yet provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Objective + Outcome
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {[
                    basics.projectObjective || "Objective not yet provided",
                    "",
                    basics.expectedBusinessOutcome ||
                      "Expected business outcome not yet provided",
                  ].join("\n")}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Delivery Approach
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {basics.deliveryApproach || "hybrid"}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}