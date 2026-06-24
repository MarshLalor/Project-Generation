import React, { useMemo, useState } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildValueEstimatePrompt,
  parseValueEstimateResponse,
} from "../../utils/valueCostHelpers";
import { getValueEstimateCompletion } from "../../utils/workspaceHelpers";

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

export default function ValueEstimateWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToPlan,
  onContinueToCost,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const basics = projectData.projectBasics;
  const valueEstimate = projectData.valueEstimate;

  const completion = useMemo(
    () => getValueEstimateCompletion(projectData),
    [projectData]
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
    <BuilderLayout
      badges={[
        { label: "Value Estimate", tone: "blue" },
        { label: "Outcome Focused", tone: "softBlue" },
        { label: "AI Estimation Workflow", tone: "orange" },
      ]}
      title="Value Estimate Workspace"
      description="Use this tab to identify value drivers, capture known and missing variables, and build a practical high-level benefit estimate tied to your project outcomes."
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
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Value estimate completeness",
        detail: `${completion.completed} of ${completion.total} tracked value estimate fields completed`,
        secondaryLabel: "Why this matters",
        secondaryText:
          "This section turns outcomes, assumptions, and known variables into a usable value story for sponsor or executive review.",
      }}
      left={
        <>
          <SectionCard
            title="Value estimate context"
            subtitle="These source items shape the value story and help anchor later calculations."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Expected Business Outcome"
                value={basics.expectedBusinessOutcome}
                accent="orange"
              />
              <OutputSummaryCard
                title="Initial Value Hypothesis"
                value={basics.initialValueHypothesis}
              />
              <OutputSummaryCard
                title="Project Objective"
                value={basics.projectObjective}
              />
              <OutputSummaryCard
                title="Delivery Approach"
                value={basics.deliveryApproach}
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
                  placeholder={`One item per line
Example: labor savings from reduced manual review
Example: error reduction and rework avoidance`}
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
                  onChange={(e) =>
                    updateValueField("knownInputs", e.target.value)
                  }
                  placeholder={`One item per line
Example: approx. 20,000 ads reviewed per month
Example: Sr. managers spend 3 hours per week on final review`}
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
                  onChange={(e) =>
                    updateValueField("missingInputs", e.target.value)
                  }
                  placeholder={`One item per line
Example: fully loaded hourly rates by role
Example: current error/rework rate`}
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
                  placeholder={`One question per line
Example: How many ads are reviewed per week by each role?
Example: What % of review effort could be reduced?`}
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
                  placeholder={`One item per line
Example: use industry average salaries if internal data is unavailable
Example: estimate fully loaded hourly rate from salary × burden factor`}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Preliminary High-Level Value Model"
                  helper="Capture the structure of the estimate, not only the final number."
                />
                <TextArea
                  value={valueEstimate.preliminaryValueModel}
                  onChange={(e) =>
                    updateValueField("preliminaryValueModel", e.target.value)
                  }
                  placeholder={`Example:
Annual labor savings = review volume × hours saved × hourly labor rate
Annual rework savings = error volume reduction × rework hours × weighted labor rate`}
                  rows={7}
                />
              </div>

              <div>
                <FieldLabel
                  label="Confidence / Assumption Notes"
                  helper="Track where the estimate is strong and where assumptions still drive the numbers."
                />
                <TextArea
                  value={valueEstimate.confidenceNotes}
                  onChange={(e) =>
                    updateValueField("confidenceNotes", e.target.value)
                  }
                  placeholder={`One item per line
Example: labor rates are still benchmark-based
Example: current-state QA effort has not yet been validated by time study`}
                  rows={5}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Parsed value estimate preview"
            subtitle="These are the reusable structured outputs after parsing an AI response."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Likely Value Drivers"
                value={valueEstimate.likelyValueDrivers}
                accent="orange"
              />
              <OutputSummaryCard
                title="Known Inputs"
                value={valueEstimate.knownInputs}
              />
              <OutputSummaryCard
                title="Missing Inputs"
                value={valueEstimate.missingInputs}
              />
              <OutputSummaryCard
                title="Follow-Up Questions"
                value={valueEstimate.followUpQuestions}
                accent="orange"
              />
              <OutputSummaryCard
                title="Estimation Methods"
                value={valueEstimate.estimationMethods}
              />
              <OutputSummaryCard
                title="Preliminary Value Model"
                value={valueEstimate.preliminaryValueModel}
                accent="orange"
              />
              <OutputSummaryCard
                title="Confidence Notes"
                value={valueEstimate.confidenceNotes}
              />
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="AI prompt preview"
          promptSubtitle="Refresh the prompt whenever Project Basics, Charter, or Plan Studio content changes."
          promptText={livePrompt}
          onRefreshPrompt={handleGeneratePrompt}
          onCopyPrompt={handleCopyPrompt}
          copyStatus={copyStatus}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI value estimate response here using the exact headings requested in the prompt."
          responseValue={valueEstimate.aiResponse}
          onResponseChange={(e) =>
            updateValueField("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

Required structure:
A. Likely Value Drivers
B. Known Inputs
C. Missing Inputs
D. Step-by-Step Follow-Up Questions
E. Suggested Estimation Methods
F. Preliminary High-Level Value Model
G. Confidence / Assumption Notes`}
          responseRows={18}
          onParseResponse={handleParseResponse}
          onApplyResponse={handleApplyParsed}
          parseLabel="Parse AI Response"
          applyLabel="Apply to Value Estimate"
          helperTitle="How to use Value Estimate"
          helperSteps={[
            {
              title: "Step 1",
              body: "Refresh the prompt so it uses the latest charter and planning information.",
            },
            {
              title: "Step 2",
              body: "Ask the AI to identify value drivers, known variables, missing data, and practical estimation methods.",
            },
            {
              title: "Step 3",
              body: "Paste the response back into the tool and parse it into structured estimate fields.",
            },
            {
              title: "Step 4",
              body: "Refine the preliminary model and assumptions before moving to the cost estimate.",
            },
          ]}
        />
      }
    />
  );
}