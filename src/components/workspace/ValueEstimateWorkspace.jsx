import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import {
  buildValueEstimatePrompt,
  getValueEstimateProgress,
  parseValueEstimateResponse,
} from "../../utils/valueCostHelpers";

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

export default function ValueEstimateWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToPlan,
  onContinueToCost,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const valueEstimate = projectData.valueEstimate;
  const basics = projectData.projectBasics;
  const progress = useMemo(
    () => getValueEstimateProgress(valueEstimate),
    [valueEstimate]
  );

  const livePrompt = useMemo(() => {
    return valueEstimate.promptText && valueEstimate.promptText.trim()
      ? valueEstimate.promptText
      : buildValueEstimatePrompt(projectData);
  }, [projectData, valueEstimate.promptText]);

  const updateValueField = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      valueEstimate: {
        ...prev.valueEstimate,
        [field]: value,
      },
    }));
  };

  const handleGeneratePrompt = () => {
    const promptText = buildValueEstimatePrompt(projectData);

    setProjectData((prev) => ({
      ...prev,
      valueEstimate: {
        ...prev.valueEstimate,
        promptText,
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
    const parsed = parseValueEstimateResponse(valueEstimate.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      valueEstimate: {
        ...prev.valueEstimate,
        ...parsed,
      },
    }));
  };

  const handleApplyParsed = () => {
    const parsed = parseValueEstimateResponse(valueEstimate.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      valueEstimate: {
        ...prev.valueEstimate,
        ...parsed,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Value Estimate</PillBadge>
              <PillBadge tone="softBlue">Outcome Focused</PillBadge>
              <PillBadge tone="orange">AI Estimation Workflow</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Value Estimate Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              Use this tab to identify value drivers, capture known and missing
              variables, and build a practical high-level benefit estimate tied
              to your project outcomes.
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
              onClick={onBackToPlan}
              className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
            >
              Back to Plan Studio
            </button>

            <button
              type="button"
              onClick={onContinueToCost}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Go to Cost Estimate
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <SectionCard
            title="Value estimate progress"
            subtitle="This tracks how complete the value estimation workspace is."
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                Value estimate completeness
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {progress.percent}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {progress.completed} of {progress.total} sections populated
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <OutputBlock
                title="Outcome Focus"
                value={basics.expectedBusinessOutcome}
                accent="orange"
              />
              <OutputBlock
                title="Initial Value Hypothesis"
                value={basics.initialValueHypothesis}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Editable value estimate fields"
            subtitle="You can fill these manually or let the AI response populate them."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel
                  label="Likely Value Drivers"
                  helper="What are the most likely sources of business value?"
                />
                <TextArea
                  value={valueEstimate.likelyValueDrivers}
                  onChange={(e) =>
                    updateValueField("likelyValueDrivers", e.target.value)
                  }
                  placeholder={"One item per line\nExample: labor savings from reduced manual review\nExample: error reduction and rework avoidance"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Known Inputs"
                  helper="Capture variables already known today."
                />
                <TextArea
                  value={valueEstimate.knownInputs}
                  onChange={(e) => updateValueField("knownInputs", e.target.value)}
                  placeholder={"One item per line\nExample: approx. 20,000 ads reviewed per month\nExample: Sr. managers spend 3 hours per week on final review"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Missing Inputs"
                  helper="List the data still needed to create a better estimate."
                />
                <TextArea
                  value={valueEstimate.missingInputs}
                  onChange={(e) => updateValueField("missingInputs", e.target.value)}
                  placeholder={"One item per line\nExample: fully loaded hourly rates by role\nExample: current error/rework rate"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Step-by-Step Follow-Up Questions"
                  helper="These should guide the user through the remaining variables."
                />
                <TextArea
                  value={valueEstimate.followUpQuestions}
                  onChange={(e) =>
                    updateValueField("followUpQuestions", e.target.value)
                  }
                  placeholder={"One question per line\nExample: How many ads are reviewed per week by each role?\nExample: What % of review effort could be reduced?"}
                  rows={6}
                />
              </div>

              <div>
                <FieldLabel
                  label="Suggested Estimation Methods"
                  helper="Use high-level methods, ranges, or benchmark logic if exact data is missing."
                />
                <TextArea
                  value={valueEstimate.estimationMethods}
                  onChange={(e) =>
                    updateValueField("estimationMethods", e.target.value)
                  }
                  placeholder={"One item per line\nExample: use industry average salaries if internal data is unavailable\nExample: estimate fully loaded hourly rate from salary × burden factor"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Preliminary High-Level Value Model"
                  helper="Capture the structure of the estimate, not just the final number."
                />
                <TextArea
