import React, { useMemo } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import BusinessCaseCalculatorSection from "./BusinessCaseCalculatorSection";
import {
  buildValueEstimatePrompt,
  getAssumptionsPreview,
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
      value={value || ""}
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
  const basics = projectData.projectBasics || {};
  const valueEstimate = projectData.valueEstimate || {};

  const assumptionsPreview = useMemo(
    () => getAssumptionsPreview(projectData),
    [projectData]
  );

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

  const handleParseResponse = () => {
    const parsed = parseValueEstimateResponse(valueEstimate.aiResponse || "");

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
        { label: "Assumptions-Aware", tone: "softBlue" },
        { label: "Scenario Calculator", tone: "orange" },
      ]}
      title="Value Estimate Workspace"
      description="Use this tab to identify value drivers, capture known and missing variables, and build a practical high-level benefit estimate tied to project outcomes, shared assumptions, and scenario calculations."
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
        secondaryLabel: "Assumptions-aware value story",
        secondaryText:
          "This workspace uses labor rates, effort assumptions, volume assumptions, benchmark assumptions, burden factor, open questions, and scenario inputs to support the value story.",
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
                livery Approach"
                value={basics.deliveryApproach}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Assumptions feeding this value estimate"
            subtitle="These assumptions are automatically included in the AI prompt."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Labor Rates"
                value={assumptionsPreview.laborRates}
                accent="orange"
              />
              <OutputSummaryCard
                title="Effort Assumptions"
                value={assumptionsPreview.effortAssumptions}
              />
              <OutputSummaryCard
                title="Volume Assumptions"
                value={assumptionsPreview.volumeAssumptions}
                accent="orange"
              />
              <OutputSummaryCard
                title="Benchmark Assumptions"
                value={assumptionsPreview.benchmarkAssumptions}
              />
              <OutputSummaryCard
                title="Burden Factor"
                value={assumptionsPreview.burdenFactor}
              />
              <OutputSummaryCard
                title="Confidence Level"
                value={assumptionsPreview.confidenceLevel}
              />
            </div>
          </SectionCard>

          <BusinessCaseCalculatorSection
            projectData={projectData}
            setProjectData={setProjectData}
          />

          <SectionCard
            title="Editable value estimate fields"
            subtitle="You can fill these manually or let the AI response populate them."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel
                  label="Likely Value Drivers"
                  helper="Summarize the primary sources of value."
                />
                <TextArea
                  value={valueEstimate.likelyValueDrivers}
                  onChange={(e) =>
                    updateValueField("likelyValueDrivers", e.target.value)
                  }
                  rows={5}
                  placeholder="Example: labor savings, rework reduction, cycle-time improvement, risk reduction, capacity creation."
                />
              </div>

              <div>
                <FieldLabel
                  label="Known Inputs"
                  helper="List known value inputs, assumptions, volumes, rates, or baseline metrics."
                />
                <TextArea
                  value={valueEstimate.knownInputs}
                  onChange={(e) =>
                    updateValueField("knownInputs", e.target.value)
                  }
                  rows={5}
                  placeholder="Example: current review volume, labor rates, known time savings, current error rate."
                />
              </div>

              <div>
                <FieldLabel
                  label="Missing Inputs"
                  helper="List variables needed to improve the estimate."
                />
                <TextArea
                  value={valueEstimate.missingInputs}
                  onChange={(e) =>
                    updateValueField("missingInputs", e.target.value)
                  }
                  rows={5}
                  placeholder="Example: current rework rate, adoption rate, QA cycle time baseline."
                />
              </div>

              <div>
                <FieldLabel
                  label="Step-by-Step Follow-Up Questions"
                  helper="Questions that should be answered before finalizing the value model."
                />
                <TextArea
                  value={valueEstimate.followUpQuestions}
                  onChange={(e) =>
                    updateValueField("followUpQuestions", e.target.value)
                  }
                  rows={6}
                  placeholder="Example: What percentage of manual review effort can be reduced?"
                />
              </div>

              <div>
                <FieldLabel
                  label="Suggested Estimation Methods"
                  helper="Describe possible formulas, benchmark approaches, or ranges."
                />
                <TextArea
                  value={valueEstimate.estimationMethods}
                  onChange={(e) =>
                    updateValueField("estimationMethods", e.target.value)
                  }
                  rows={5}
                  placeholder="Example: Annual labor savings = hours saved × weighted hourly rate."
                />
              </div>

              <div>
                <FieldLabel
                  label="Preliminary High-Level Value Model"
                  helper="Draft the value model or business benefit logic."
                />
                <TextArea
                  value={valueEstimate.preliminaryValueModel}
                  onChange={(e) =>
                    updateValueField("preliminaryValueModel", e.target.value)
                  }
                  rows={7}
                  placeholder="Draft the preliminary value model here."
                />
              </div>

              <div>
                <FieldLabel
                  label="Confidence / Assumption Notes"
                  helper="Capture confidence level, caveats, assumptions, and validation needs."
                />
                <TextArea
                  value={valueEstimate.confidenceNotes}
                  onChange={(e) =>
                    updateValueField("confidenceNotes", e.target.value)
                  }
                  rows={5}
                  placeholder="Example: Labor rates are benchmark-based; time savings require SME validation."
                />
              </div>
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="AI prompt builder"
          promptSubtitle="Generate a value estimate prompt that uses previous sections and asks follow-up questions before producing final output."
          promptSectionName="Value Estimate"
          promptText={livePrompt}
          onRefreshPrompt={handleGeneratePrompt}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI value estimate response here. The first response may ask follow-up questions before final output."
          responseValue={valueEstimate.aiResponse || ""}
          onResponseChange={(e) =>
            updateValueField("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

First response may contain:
A. Context Review
B. Missing or Unclear Information
C. Follow-Up Questions
D. Recommended Assumptions if the User Wants to Proceed
E. Next Step Instruction

Required final structure:
A. Likely Value Drivers
B. Known Inputs
C. Missing Inputs
D. Step-by-Step Follow-Up Questions
E. Suggested Estimation Methods
F. Preliminary High-Level Value Model
G. Confidence / Assumption Notes`}
          responseRows={18}
          onParseResponse={handleParseResponse}
          onApplyResponse={handleParseResponse}
          parseLabel="Parse AI Response"
          applyLabel="Apply to Value Estimate"
          helperTitle="How to use Value Estimate"
          helperSteps={[
            {
              title: "Step 1",
              body: "Refresh the prompt so it uses the latest charter, plan, assumptions register, and scenario calculator inputs.",
            },
            {
              title: "Step 2",
              body: "Copy the prompt and answer any follow-up questions the AI asks first.",
            },
            {
              title: "Step 3",
              body: "Use the Scenario Calculator to build low, expected, and high value/cost cases.",
            },
            {
              title: "Step 4",
              body: "Paste the final AI response back into the tool and parse it into structured value estimate fields.",
            },
          ]}
        />
      }
    />
  );
}