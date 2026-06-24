import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import {
  buildCostEstimatePrompt,
  getCostEstimateProgress,
  parseCostEstimateResponse,
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

export default function CostEstimateWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToValue,
  onContinueToOutputs,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const costEstimate = projectData.costEstimate;
  const basics = projectData.projectBasics;
  const progress = useMemo(
    () => getCostEstimateProgress(costEstimate),
    [costEstimate]
  );

  const livePrompt = useMemo(() => {
    return costEstimate.promptText && costEstimate.promptText.trim()
      ? costEstimate.promptText
      : buildCostEstimatePrompt(projectData);
  }, [projectData, costEstimate.promptText]);

  const updateCostField = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      costEstimate: {
        ...prev.costEstimate,
        [field]: value,
      },
    }));
  };

  const handleGeneratePrompt = () => {
    const promptText = buildCostEstimatePrompt(projectData);

    setProjectData((prev) => ({
      ...prev,
      costEstimate: {
        ...prev.costEstimate,
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
    const parsed = parseCostEstimateResponse(costEstimate.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      costEstimate: {
        ...prev.costEstimate,
        ...parsed,
      },
    }));
  };

  const handleApplyParsed = () => {
    const parsed = parseCostEstimateResponse(costEstimate.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      costEstimate: {
        ...prev.costEstimate,
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
              <PillBadge tone="blue">Cost Estimate</PillBadge>
              <PillBadge tone="softBlue">Implementation + Ongoing Cost</PillBadge>
              <PillBadge tone="orange">AI Estimation Workflow</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Cost Estimate Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              Use this tab to create a high-level cost estimate for Year 1 and
              recurring annual cost, including labor, software, implementation,
              training, integration, and support assumptions.
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
              onClick={onBackToValue}
              className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
            >
              Back to Value Estimate
            </button>

            <button
              type="button"
              onClick={onContinueToOutputs}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Go to Outputs
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <SectionCard
            title="Cost estimate progress"
            subtitle="This tracks how complete the cost estimate workspace is."
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                Cost estimate completeness
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
                title="Delivery Approach"
                value={basics.deliveryApproach}
                accent="orange"
              />
              <OutputBlock
                title="Estimated Budget Range"
                value={basics.estimatedBudgetRange}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Editable cost estimate fields"
            subtitle="You can fill these manually or let the AI response populate them."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel
                  label="Cost Categories"
                  helper="Separate cost types in a way that will support a rough cost model."
                />
                <TextArea
                  value={costEstimate.costCategories}
                  onChange={(e) =>
                    updateCostField("costCategories", e.target.value)
                  }
                  placeholder={"One item per line\nExample: software / license cost\nExample: implementation partner cost\nExample: internal labor cost"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Known Inputs"
                  helper="Capture cost information already known today."
                />
                <TextArea
                  value={costEstimate.knownInputs}
                  onChange={(e) => updateCostField("knownInputs", e.target.value)}
                  placeholder={"One item per line\nExample: vendor quote estimate available\nExample: 2 PM resources needed part-time for 12 weeks"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Missing Inputs"
                  helper="List what still needs to be confirmed to improve the estimate."
                />
                <TextArea
                  value={costEstimate.missingInputs}
                  onChange={(e) => updateCostField("missingInputs", e.target.value)}
                  placeholder={"One item per line\nExample: software license tier\nExample: integration labor hours\nExample: training effort"}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Step-by-Step Questions"
                  helper="These questions should walk the user through the remaining cost variables."
                />
                <TextArea
                  value={costEstimate.followUpQuestions}
                  onChange={(e) =>
                    updateCostField("followUpQuestions", e.target.value)
                  }
                  placeholder={"One question per line\nExample: What is the expected software subscription model?\nExample: How many internal hours will be needed for implementation?"}
                  rows={6}
                />
              </div>

              <div>
                <FieldLabel
                  label="Recommended Estimation Methods"
                  helper="Use benchmark logic or ranges when exact data is not available."
                />
                <TextArea
                  value={costEstimate.estimationMethods}
                  onChange={(e) =>
                    updateCostField("estimationMethods", e.target.value)
                  }
