import React, { useMemo } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  charterSectionsToText,
  generateCharterPayload,
} from "../../utils/charterHelpers";
import { getCharterCompletion } from "../../utils/workspaceHelpers";

function FieldLabel({ label, helper }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  );
}

function CharterSectionEditor({ label, value, onChange, rows = 5, helper }) {
  return (
    <div>
      <FieldLabel label={label} helper={helper} />
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
  const basics = projectData.projectBasics || {};
  const charter = projectData.charter || {};

  const completion = useMemo(
    () => getCharterCompletion(projectData),
    [projectData]
  );

  const previewPayload = useMemo(() => {
    return generateCharterPayload(projectData);
  }, [projectData]);

  const mergedSections = useMemo(() => {
    return {
      backgroundBusinessNeed:
        charter.backgroundBusinessNeed || previewPayload.backgroundBusinessNeed,
      problemStatement:
        charter.problemStatement || previewPayload.problemStatement,
      projectObjectives:
        charter.projectObjectives || previewPayload.projectObjectives,
      scopeSummary: charter.scopeSummary || previewPayload.scopeSummary,
      keyStakeholders:
        charter.keyStakeholders || previewPayload.keyStakeholders,
      timelineMilestones:
        charter.timelineMilestones || previewPayload.timelineMilestones,
      assumptions: charter.assumptions || previewPayload.assumptions,
      constraints: charter.constraints || previewPayload.constraints,
      risksDependencies:
        charter.risksDependencies || previewPayload.risksDependencies,
      successCriteria:
        charter.successCriteria || previewPayload.successCriteria,
      initialValueHypothesis:
        charter.initialValueHypothesis ||
        previewPayload.initialValueHypothesis,
      recommendedNextSteps:
        charter.recommendedNextSteps || previewPayload.recommendedNextSteps,
    };
  }, [charter, previewPayload]);

  const effectiveCharterText = useMemo(() => {
    if (charter.charterText && charter.charterText.trim()) {
      return charter.charterText;
    }

    return charterSectionsToText(mergedSections, basics.title || "");
  }, [charter.charterText, mergedSections, basics.title]);

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
    const refreshedText = charterSectionsToText(
      mergedSections,
      basics.title || ""
    );

    setProjectData((prev) => ({
      ...prev,
      charter: {
        ...prev.charter,
        charterText: refreshedText,
      },
    }));
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Charter Workspace", tone: "blue" },
        { label: "Editable Draft", tone: "softBlue" },
        { label: "AI Refinement Ready", tone: "orange" },
      ]}
      title="Project Charter Workspace"
      description="Generate a structured charter from Project Basics and Ideation content, refine the sections, and prepare a copy-ready charter."
      actions={
        <>
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
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Charter completeness",
        detail: `${completion.completed} of ${completion.total} tracked charter fields completed`,
        secondaryLabel: "Why this matters",
        secondaryText:
          "The project charter becomes the source-of-truth document for planning prompts, value story, cost story, and final outputs.",
      }}
      left={
        <>
          <SectionCard
            title="Generated charter sections"
            subtitle="Use project information as your baseline, then refine each section."
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
                value={mergedSections.backgroundBusinessNeed}
                onChange={(e) =>
                  handleCharterChange(
                    "backgroundBusinessNeed",
                    e.target.value
                  )
                }
                rows={5}
              />

              <CharterSectionEditor
                label="Problem Statement"
                value={mergedSections.problemStatement}
                onChange={(e) =>
                  handleCharterChange("problemStatement", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Project Objectives"
                value={mergedSections.projectObjectives}
                onChange={(e) =>
                  handleCharterChange("projectObjectives", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Scope Summary"
                value={mergedSections.scopeSummary}
                onChange={(e) =>
                  handleCharterChange("scopeSummary", e.target.value)
                }
                rows={7}
              />

              <CharterSectionEditor
                label="Key Stakeholders"
                value={mergedSections.keyStakeholders}
                onChange={(e) =>
                  handleCharterChange("keyStakeholders", e.target.value)
                }
                rows={5}
              />

              <CharterSectionEditor
                label="Timeline / Milestones"
                value={mergedSections.timelineMilestones}
                onChange={(e) =>
                  handleCharterChange("timelineMilestones", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Assumptions"
                value={mergedSections.assumptions}
                onChange={(e) =>
                  handleCharterChange("assumptions", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Constraints"
                value={mergedSections.constraints}
                onChange={(e) =>
                  handleCharterChange("constraints", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Risks / Dependencies"
                value={mergedSections.risksDependencies}
                onChange={(e) =>
                  handleCharterChange("risksDependencies", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Success Criteria"
                value={mergedSections.successCriteria}
                onChange={(e) =>
                  handleCharterChange("successCriteria", e.target.value)
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Initial Value Hypothesis"
                value={mergedSections.initialValueHypothesis}
                onChange={(e) =>
                  handleCharterChange(
                    "initialValueHypothesis",
                    e.target.value
                  )
                }
                rows={4}
              />

              <CharterSectionEditor
                label="Recommended Next Steps"
                value={mergedSections.recommendedNextSteps}
                onChange={(e) =>
                  handleCharterChange("recommendedNextSteps", e.target.value)
                }
                rows={4}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Charter source snapshot"
            subtitle="These basics continue to feed the charter."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard title="Project Title" value={basics.title} />
              <OutputSummaryCard
                title="Project Objective"
                value={basics.projectObjective}
              />
              <OutputSummaryCard
                title="Expected Business Outcome"
                value={basics.expectedBusinessOutcome}
                accent="orange"
              />
              <OutputSummaryCard
                title="Delivery Approach"
                value={basics.deliveryApproach}
              />
              <OutputSummaryCard title="In Scope" value={basics.scopeIn} />
              <OutputSummaryCard title="Out of Scope" value={basics.scopeOut} />
              <OutputSummaryCard
                title="Success Criteria"
                value={basics.successCriteria}
                accent="orange"
              />
              <OutputSummaryCard
                title="Initial Value Hypothesis"
                value={basics.initialValueHypothesis}
                accent="orange"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Current charter text"
            subtitle="This is the compiled charter text used by Outputs."
          >
            <div className="max-h-[520px] overflow-auto rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {effectiveCharterText}
              </pre>
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="Charter AI prompt builder"
          promptSubtitle="Generate a charter refinement prompt that uses prior context and asks follow-up questions before producing final output."
          promptSectionName="Project Charter"
          promptText={effectiveAiPrompt}
          onRefreshPrompt={handleGenerateFromProject}
          responseTitle="Paste AI refinement response"
          responseSubtitle="Store the refined charter response or notes here."
          responseValue={charter.aiResponse}
          onResponseChange={(e) =>
            handleCharterChange("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste any refined charter response or notes here.

First response may contain:
A. Context Review
B. Missing or Unclear Information
C. Follow-Up Questions
D. Recommended Assumptions if the User Wants to Proceed
E. Next Step Instruction

After answering the questions, paste the final structured charter response or notes here.

Suggested final structure:
A. Refined Charter
B. Open Questions
C. Areas that still need confirmation
D. Suggested next actions`}
          responseRows={12}
          onParseResponse={handleRefreshTextFromSections}
          onApplyResponse={handleRefreshTextFromSections}
          parseLabel="Refresh Charter Text"
          applyLabel="Apply Current Draft"
          helperTitle="How to use Charter"
          helperSteps={[
            {
              title: "Step 1",
              body: "Generate the charter from Project Basics and Ideation.",
            },
            {
              title: "Step 2",
              body: "Edit the individual charter sections until they are practical and sponsor-ready.",
            },
            {
              title: "Step 3",
              body: "Use the AI refinement prompt if you want to improve clarity. The prompt will ask the AI for follow-up details before generating a final output.",
            },
            {
              title: "Step 4",
              body: "Refresh and review the charter text once ready.",
            },
          ]}
        />
      }
    />
  );
}
