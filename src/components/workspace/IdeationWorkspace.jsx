import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import BuilderLayout from "./BuilderLayout";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import { getIdeationCompletion } from "../../utils/workspaceHelpers";
import {
  applyIdeationToProject,
  buildIdeationPrompt,
  ideaTypeOptions,
  loadIdeationExample,
  parseIdeationResponse,
} from "../../utils/ideationHelpers";

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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  );
}

export default function IdeationWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onContinueToBasics,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const ideation = projectData.ideation;
  const basics = projectData.projectBasics;
  const parsedSections = ideation.parsedSections || {};

  const completion = useMemo(
    () => getIdeationCompletion(projectData),
    [projectData]
  );

  const promptPreview = useMemo(() => {
    return ideation.promptText?.trim()
      ? ideation.promptText
      : buildIdeationPrompt(projectData);
  }, [ideation.promptText, projectData]);

  const handleIdeationFieldChange = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      ideation: {
        ...prev.ideation,
        [field]: value,
      },
    }));
  };

  const handleGeneratePrompt = () => {
    const promptText = buildIdeationPrompt(projectData);

    setProjectData((prev) => ({
      ...prev,
      ideation: {
        ...prev.ideation,
        promptText,
      },
    }));
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptPreview);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  const handleParseResponse = () => {
    const parsed = parseIdeationResponse(ideation.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      ideation: {
        ...prev.ideation,
        parsedSections: parsed,
      },
    }));
  };

  const handleApplyToProject = () => {
    setProjectData((prev) => applyIdeationToProject(prev));
  };

  const handleLoadExample = () => {
    const example = loadIdeationExample();

    setProjectData((prev) => ({
      ...prev,
      ideation: {
        ...prev.ideation,
        ...example,
      },
    }));
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Ideation Studio", tone: "blue" },
        { label: "AI Prompt Workflow", tone: "orange" },
      ]}
      title="Ideation Workspace"
      description="Turn an early idea, pain point, or opportunity into a structured project concept that can feed Project Basics and Charter."
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
            onClick={onContinueToBasics}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Go to Project Basics
          </button>
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Ideation completeness",
        detail: `${completion.completed} of ${completion.total} tracked ideation items completed`,
        secondaryLabel: "Why this matters",
        secondaryText:
          "The stronger the ideation output, the stronger the downstream charter, plan, value estimate, and cost estimate prompts become.",
      }}
      left={
        <>
          <SectionCard
            title="Initial idea intake"
            subtitle="Start lightweight. This section works even when the project is still fuzzy."
          >
            <div className="space-y-5">
              <div>
                <FieldLabel label="Idea Type" />
                <div className="flex flex-wrap gap-2">
                  {ideaTypeOptions.map((type) => {
                    const active = ideation.ideaType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          handleIdeationFieldChange("ideaType", type)
                        }
                        className={[
                          "rounded-full px-4 py-2 text-sm font-medium transition",
                          active
                            ? "bg-sky-600 text-white"
                            : "border border-sky-200 bg-sky-50 text-slate-700 hover:bg-sky-100",
                        ].join(" ")}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel
                  label="What sparked this idea?"
                  helper="Describe the trigger, request, frustration, or opportunity."
                />
                <TextArea
                  value={ideation.spark}
                  onChange={(e) =>
                    handleIdeationFieldChange("spark", e.target.value)
                  }
                  placeholder="Example: Our team is spending too much time on manual QA before launch."
                  rows={4}
                />
              </div>

              <div>
                <FieldLabel label="Industry / business context" />
                <TextArea
                  value={ideation.businessContext}
                  onChange={(e) =>
                    handleIdeationFieldChange(
                      "businessContext",
                      e.target.value
                    )
                  }
                  placeholder="Example: Paid search campaign operations with multiple management review layers."
                  rows={4}
                />
              </div>

              <div>
                <FieldLabel label="Initial problem or frustration" />
                <TextArea
                  value={ideation.currentPain}
                  onChange={(e) =>
                    handleIdeationFieldChange("currentPain", e.target.value)
                  }
                  placeholder="Describe the current-state problem in plain language."
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel label="Known goal or desired outcome" />
                <TextArea
                  value={ideation.knownGoal}
                  onChange={(e) =>
                    handleIdeationFieldChange("knownGoal", e.target.value)
                  }
                  placeholder="Example: Reduce manual QA time, improve quality, and speed launch readiness."
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  Load Example
                </button>

                <button
                  type="button"
                  onClick={handleGeneratePrompt}
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Generate Ideation Prompt
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Parsed ideation output"
            subtitle="Once the AI response is parsed, these sections become reusable project inputs."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Problem Statement"
                value={parsedSections.problemStatement}
              />
              <OutputSummaryCard
                title="Project Objective"
                value={parsedSections.projectObjective}
              />
              <OutputSummaryCard
                title="Desired Outcomes"
                value={parsedSections.desiredOutcomes}
                accent="orange"
              />
              <OutputSummaryCard
                title="Potential Approaches"
                value={parsedSections.potentialApproaches}
              />
              <OutputSummaryCard
                title="Recommended Direction"
                value={parsedSections.recommendedDirection}
                accent="orange"
              />
              <OutputSummaryCard
                title="Scope In"
                value={parsedSections.scopeIn}
              />
              <OutputSummaryCard
                title="Scope Out"
                value={parsedSections.scopeOut}
              />
              <OutputSummaryCard
                title="Stakeholders"
                value={parsedSections.stakeholders}
              />
              <OutputSummaryCard
                title="Assumptions"
                value={parsedSections.assumptions}
              />
              <OutputSummaryCard
                title="Risks / Constraints"
                value={parsedSections.risksConstraints}
              />
              <OutputSummaryCard
                title="Value Drivers"
                value={parsedSections.valueDrivers}
                accent="orange"
              />
              <OutputSummaryCard
                title="Open Questions"
                value={parsedSections.openQuestions}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Project field preview"
            subtitle="These Project Basics fields can be populated from Ideation."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Business Problem"
                value={basics.businessProblem}
              />
              <OutputSummaryCard
                title="Project Objective"
                value={basics.projectObjective}
              />
              <OutputSummaryCard
                title="Expected Outcome"
                value={basics.expectedBusinessOutcome}
                accent="orange"
              />
              <OutputSummaryCard title="In Scope" value={basics.scopeIn} />
              <OutputSummaryCard title="Out of Scope" value={basics.scopeOut} />
              <OutputSummaryCard
                title="Stakeholders"
                value={basics.keyStakeholders}
              />
              <OutputSummaryCard
                title="Assumptions"
                value={basics.keyAssumptions}
              />
              <OutputSummaryCard
                title="Initial Value Hypothesis"
                value={basics.initialValueHypothesis}
                accent="orange"
              />
            </div>
          </SectionCard>
        </>
      }
      right={
        promptSectionName="Ideation"
          promptTitle="AI prompt preview"
          promptSubtitle="Generate the ideation prompt, then copy it into your AI partner tool."
          promptText={promptPreview}
          onRefreshPrompt={handleGeneratePrompt}
          onCopyPrompt={handleCopyPrompt}
          copyStatus={copyStatus}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI output here using the exact section headings requested in the prompt."
          responseValue={ideation.aiResponse}
          onResponseChange={(e) =>
            handleIdeationFieldChange("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

Recommended structure:
A. Problem Statement
B. Project Objective
C. Desired Outcomes
D. Potential Solution Approaches
E. Recommended Direction
F. High-Level Scope (In / Out)
G. Key Stakeholders
H. Initial Assumptions
I. Initial Risks / Constraints
J. Value Drivers
K. Open Questions`}
          responseRows={18}
          onParseResponse={handleParseResponse}
          onApplyResponse={handleApplyToProject}
          parseLabel="Parse AI Response"
          applyLabel="Apply to Project"
          helperTitle="How to use Ideation"
          helperSteps={[
            {
              title: "Step 1",
              body: "Enter lightweight details about the idea, pain point, or opportunity.",
            },
            {
              title: "Step 2",
              body: "Generate and copy the ideation prompt into your AI tool.",
            },
            {
              title: "Step 3",
              body: "Paste the response back and parse it into structured sections.",
            },
            {
              title: "Step 4",
              body: "Apply the parsed output to Project Basics.",
            },
          ]}
        />
      }
    />
  );
}