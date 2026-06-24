import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import {
  buildPlanSectionPrompt,
  getPlanStudioProgress,
  parsePlanStudioResponse,
  planSectionConfigs,
} from "../../utils/planStudioHelpers";

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

function FieldLabel({ label, helper }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-slate-900">{label}</label>
      {helper && <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>}
    </div>
  );
}

function OutputBlock({ title, value, accent = "sky" }) {
  const classes =
    accent === "orange"
      ? "border-orange-200 bg-orange-50"
      : "border-sky-100 bg-sky-50/60";

  return (
    <div className={`rounded-2xl border p-4 ${classes}`}>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value && value.trim() ? value : "No content yet."}
      </p>
    </div>
  );
}

function SectionStatusCard({ config, isActive, isComplete, onClick }) {
  const toneClasses = isActive
    ? "border-sky-300 bg-white shadow-sm"
    : "border-sky-100 bg-sky-50/50 hover:border-sky-200 hover:bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left transition ${toneClasses}`}
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
  const planStudio = projectData.planStudio;
  const activeSectionId = planStudio.activeSection || "scope";
  const activeSectionConfig =
    planSectionConfigs.find((item) => item.id === activeSectionId) ||
    planSectionConfigs[0];
  const activeSectionState = planStudio.sections[activeSectionId];

  const progress = useMemo(
    () => getPlanStudioProgress(planStudio),
    [planStudio]
  );

  const livePrompt = useMemo(() => {
    return activeSectionState.promptText && activeSectionState.promptText.trim()
      ? activeSectionState.promptText
      : buildPlanSectionPrompt(projectData, activeSectionId);
  }, [projectData, activeSectionId, activeSectionState.promptText]);

  const updateActiveSection = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      planStudio: {
        ...prev.planStudio,
        sections: {
          ...prev.planStudio.sections,
          [activeSectionId]: {
            ...prev.planStudio.sections[activeSectionId],
            [field]: value,
          },
        },
      },
    }));
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

    setProjectData((prev) => ({
      ...prev,
      planStudio: {
        ...prev.planStudio,
        sections: {
          ...prev.planStudio.sections,
          [activeSectionId]: {
            ...prev.planStudio.sections[activeSectionId],
            promptText,
          },
        },
      },
    }));
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

    setProjectData((prev) => ({
      ...prev,
      planStudio: {
        ...prev.planStudio,
        sections: {
          ...prev.planStudio.sections,
          [activeSectionId]: {
            ...prev.planStudio.sections[activeSectionId],
            ...parsed,
          },
        },
      },
    }));
  };

  const handleApplyDraftToSection = () => {
    const parsed = parsePlanStudioResponse(activeSectionState.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      planStudio: {
        ...prev.planStudio,
        sections: {
          ...prev.planStudio.sections,
          [activeSectionId]: {
            ...prev.planStudio.sections[activeSectionId],
            ...parsed,
            draftContent:
              parsed.draftContent || prev.planStudio.sections[activeSectionId].draftContent,
          },
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Plan Studio V1</PillBadge>
              <PillBadge tone="softBlue">PMBOK-Aligned</PillBadge>
              <PillBadge tone="orange">AI Section Builder</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Plan Studio Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              Build the project plan section by section using the current
              Project Basics and Charter as source context. This V1 includes
              Scope, Schedule, Risk, and Communications.
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
              onClick={onBackToCharter}
              className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
            >
              Back to Charter
            </button>

            <button
              type="button"
              onClick={onContinueToValue}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Go to Value Estimate
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Planning section navigator"
            subtitle="Choose a section to build and iterate with your AI partner."
          >
            <div className="space-y-3">
              {planSectionConfigs.map((config) => {
                const state = planStudio.sections[config.id];
                const complete = state?.draftContent && String(state.draftContent).trim();

                return (
                  <SectionStatusCard
                    key={config.id}
                    config={config}
                    isActive={config.id === activeSectionId}
                    isComplete={!!complete}
                    onClick={() => setActiveSection(config.id)}
                  />
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Plan progress"
            subtitle="A quick view of how much of Plan Studio V1 has draft content."
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                Plan Studio completeness
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {progress.percent}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {progress.completed} of {progress.total} sections drafted
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <p className="text-sm font-semibold text-sky-700">
                Current section
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {activeSectionConfig.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {activeSectionConfig.outputHint}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Editable section draft"
            subtitle="This is the reusable plan content for the selected section."
          >
            <div>
              <FieldLabel
                label={`${activeSectionConfig.title} Draft`}
                helper="You can edit this manually or apply parsed AI output into it."
              />
              <TextArea
                value={activeSectionState.draftContent}
                onChange={(e) => updateActiveSection("draftContent", e.target.value)}
                placeholder={`Draft ${activeSectionConfig.title} section content here...`}
                rows={14}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Parsed section outputs"
            subtitle="Once the AI response is parsed, these supporting blocks become reusable planning inputs."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputBlock
                title="Missing Information"
                value={activeSectionState.missingInformation}
              />
              <OutputBlock
                title="Questions for the User"
                value={activeSectionState.questionsForUser}
                accent="orange"
              />
              <OutputBlock
                title="Suggested Next Steps"
                value={activeSectionState.suggestedNextSteps}
              />
              <OutputBlock
                title="Key Assumptions"
                value={activeSectionState.keyAssumptions}
                accent="orange"
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="AI prompt preview"
            subtitle="Generate the section prompt, then copy it into your AI tool."
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {livePrompt}
                </pre>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleGeneratePrompt}
                  className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                >
                  Refresh Prompt
                </button>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {copyStatus === "copied"
                    ? "Prompt Copied"
                    : copyStatus === "failed"
                    ? "Copy Failed"
                    : "Copy Prompt"}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Paste AI response"
            subtitle="Paste the AI output here using the exact headings from the prompt."
          >
            <div className="space-y-4">
              <TextArea
                value={activeSectionState.aiResponse}
                onChange={(e) => updateActiveSection("aiResponse", e.target.value)}
                placeholder={`Paste the AI response here.

Required structure:
A. Draft Section Content
B. Missing Information
C. Questions for the User
D. Suggested Next Steps
E. Key Assumptions`}
                rows={16}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleParseResponse}
                  className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  Parse AI Response
                </button>

                <button
                  type="button"
                  onClick={handleApplyDraftToSection}
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Apply to Section
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="How to use Plan Studio V1"
            subtitle="Recommended section-by-section workflow"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 1</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Select a planning section and refresh the prompt so it uses the
                  latest Project Basics and Charter content.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 2</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Copy the prompt into your AI tool and ask it to return the
                  output using the exact required headings.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 3</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Paste the response back here and parse it into structured plan
                  components.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">Step 4</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Apply the parsed result to the section draft, then refine it as
                  needed before moving on to the next section.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}