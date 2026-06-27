import React, { useMemo, useState } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildPlanSectionPrompt,
  getPlanStudioProgress,
  parsePlanStudioResponse,
  planSectionConfigs,
} from "../../utils/planStudioHelpers";

const emptySectionState = {
  promptText: "",
  aiResponse: "",
  draftContent: "",
  missingInformation: "",
  questionsForUser: "",
  suggestedNextSteps: "",
  keyAssumptions: "",
};

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

function SectionStatusCard({ config, isActive, isComplete, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-3xl border p-4 text-left transition",
        isActive
          ? "border-sky-300 bg-white shadow-sm"
          : "border-sky-100 bg-sky-50/50 hover:border-sky-200 hover:bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {config.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {config.purpose}
          </p>
        </div>

        <span
          className={[
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
            isComplete
              ? "bg-sky-100 text-sky-700"
              : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          {isComplete ? "Drafted" : "Not started"}
        </span>
      </div>
    </button>
  );
}

export default function PlanStudioWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToCharter,
  onContinueToValue,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const planStudio = projectData?.planStudio || {};
  const sections = planStudio.sections || {};
  const activeSectionId = planStudio.activeSection || "scope";

  const activeSectionConfig =
    planSectionConfigs.find((item) => item.id === activeSectionId) ||
    planSectionConfigs[0];

  const activeSectionState =
    sections[activeSectionId] || sections.scope || emptySectionState;

  const progress = useMemo(() => {
    return getPlanStudioProgress(planStudio);
  }, [planStudio]);

  const livePrompt = useMemo(() => {
    if (activeSectionState.promptText?.trim()) {
      return activeSectionState.promptText;
    }

    return buildPlanSectionPrompt(projectData, activeSectionId);
  }, [projectData, activeSectionId, activeSectionState.promptText]);

  const updateSectionState = (sectionId, updates) => {
    setProjectData((prev) => {
      const previousPlanStudio = prev.planStudio || {};
      const previousSections = previousPlanStudio.sections || {};
      const previousSection =
        previousSections[sectionId] || emptySectionState;

      return {
        ...prev,
        planStudio: {
          ...previousPlanStudio,
          sections: {
            ...previousSections,
            [sectionId]: {
              ...previousSection,
              ...updates,
            },
          },
        },
      };
    });
  };

  const updateActiveSection = (field, value) => {
    updateSectionState(activeSectionId, {
      [field]: value,
    });
  };

  const setActiveSection = (sectionId) => {
    setProjectData((prev) => ({
      ...prev,
      planStudio: {
        ...prev.planStudio,
        activeSection: sectionId,
      },
    }));
  };

  const handleGeneratePrompt = () => {
    const promptText = buildPlanSectionPrompt(projectData, activeSectionId);

    updateSectionState(activeSectionId, {
      promptText,
    });
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(livePrompt);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  const handleParseResponse = () => {
    const parsed = parsePlanStudioResponse(activeSectionState.aiResponse);
    updateSectionState(activeSectionId, parsed);
  };

  const handleApplyDraftToSection = () => {
    const parsed = parsePlanStudioResponse(activeSectionState.aiResponse);

    updateSectionState(activeSectionId, {
      ...parsed,
      draftContent:
        parsed.draftContent || activeSectionState.draftContent || "",
    });
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Plan Studio", tone: "blue" },
        { label: "PMBOK-Aligned", tone: "softBlue" },
        { label: "AI Section Builder", tone: "orange" },
      ]}
      title="Plan Studio Workspace"
      description="Build the project plan section by section using Project Basics and the Charter as source context."
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
            onClick={onBackToCharter}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
          >
            Back to Charter
          </button>

          <button
            type="button"
            onClick={onContinueToValue}
            className="w-full 500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Go to Value Estimate
          </button>
        </>
      }
      progress={{
        percent: progress.percent,
        completed: progress.completed,
        total: progress.total,
        metricLabel: "Plan Studio completeness",
        detail: `${progress.completed} of ${progress.total} sections drafted`,
        secondaryLabel: "Current focus",
        secondaryText: `${activeSectionConfig.title}: ${activeSectionConfig.outputHint}`,
      }}
      left={
        <>
          <SectionCard
            title="Planning section navigator"
            subtitle="Choose a section to build and iterate with your AI partner."
          >
            <div className="space-y-3">
              {planSectionConfigs.map((config) => {
                const state = sections[config.id];
                const isComplete =
                  state?.draftContent && String(state.draftContent).trim();

                return (
                  <SectionStatusCard
                    key={config.id}
                    config={config}
                    isActive={config.id === activeSectionId}
                    isComplete={!!isComplete}
                    onClick={() => setActiveSection(config.id)}
                  />
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Editable section draft"
            subtitle="This becomes the reusable project plan content for the selected section."
          >
            <div>
              <FieldLabel
                label={`${activeSectionConfig.title} Draft`}
                helper="You can write directly here or apply parsed AI output into this section."
              />
              <TextArea
                value={activeSectionState.draftContent}
                onChange={(e) =>
                  updateActiveSection("draftContent", e.target.value)
                }
                placeholder={`Draft the ${activeSectionConfig.title} section here...`}
                rows={14}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Parsed section outputs"
            subtitle="Once the AI response is parsed, these supporting blocks become reusable planning inputs."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Missing Information"
                value={activeSectionState.missingInformation}
              />
              <OutputSummaryCard
                title="Questions for the User"
                value={activeSectionState.questionsForUser}
                accent="orange"
              />
              <OutputSummaryCard
                title="Suggested Next Steps"
                value={activeSectionState.suggestedNextSteps}
              />
              <OutputSummaryCard
                title="Key Assumptions"
                value={activeSectionState.keyAssumptions}
                accent="orange"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Current section summary"
            subtitle="A quick explanation of what this selected planning section is meant to produce."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Section Goal"
                value={activeSectionConfig.purpose}
              />
              <OutputSummaryCard
                title="Expected Output"
                value={activeSectionConfig.outputHint}
                accent="orange"
              />
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="AI prompt preview"
          promptSubtitle="Generate the section prompt, then copy it into your AI tool."
          promptText={livePrompt}
          onRefreshPrompt={handleGeneratePrompt}
          onCopyPrompt={handleCopyPrompt}
          copyStatus={copyStatus}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI output here using the exact headings from the prompt."
          responseValue={activeSectionState.aiResponse}
          onResponseChange={(e) =>
            updateActiveSection("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

Required structure:
A. Draft Section Content
B. Missing Information
C. Questions for the User
D. Suggested Next Steps
E. Key Assumptions`}
          responseRows={16}
          onParseResponse={handleParseResponse}
          onApplyResponse={handleApplyDraftToSection}
          parseLabel="Parse AI Response"
          applyLabel="Apply to Section"
          helperTitle="How to use Plan Studio"
          helperSteps={[
            {
              title: "Step 1",
              body: "Select a planning section and refresh the prompt.",
            },
            {
              title: "Step 2",
              body: "Copy the prompt into your AI tool.",
            },
            {
              title: "Step 3",
              body: "Paste the response back and parse it.",
            },
            {
              title: "Step 4",
              body: "Apply the parsed result to the section draft.",
            },
          ]}
        />
      }
    />
  );
}