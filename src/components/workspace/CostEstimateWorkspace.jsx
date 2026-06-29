import React, { useMemo } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import BusinessCaseCalculatorSection from "./BusinessCaseCalculatorSection";
import {
  buildCostEstimatePrompt,
  getAssumptionsPreview,
  parseCostEstimateResponse,
} from "../../utils/valueCostHelpers";
import { getCostEstimateCompletion } from "../../utils/workspaceHelpers";

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

export default function CostEstimateWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToValue,
  onContinueToOutputs,
  onContinueToAssumptions,
}) {
  const basics = projectData.projectBasics || {};
  const costEstimate = projectData.costEstimate || {};

  const assumptionsPreview = useMemo(
    () => getAssumptionsPreview(projectData),
    [projectData]
  );

  const completion = useMemo(
    () => getCostEstimateCompletion(projectData),
    [projectData]
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
        value,
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

  const handleNext = () => {
    if (onContinueToAssumptions) {
      onContinueToAssumptions();
      return;
    }

    if (onContinueToOutputs) {
      onContinueToOutputs();
    }
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Cost Estimate", tone: "blue" },
        { label: "Assumptions-Aware", tone: "softBlue" },
        { label: "Scenario Calculator", tone: "orange" },
      ]}
      title="Cost Estimate Workspace"
      description="Use this tab to create a high-level cost estimate for Year 1 and recurring annual cost using shared assumptions, labor rates, implementation effort, training, integration, support assumptions, and scenario calculations."
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
            onClick={onBackToValue}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
          >
            Back to Value Estimate
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Go to Assumptions
          </button>
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Cost estimate completeness",
        detail: `${completion.completed} of ${completion.total} tracked cost estimate fields completed`,
        secondaryLabel: "Assumptions-aware cost story",
        secondaryText:
          "This workspace uses labor rates, effort assumptions, benchmark assumptions, burden factor, confidence level, and scenario inputs to support the cost story.",
      }}
      left={
        <>
          <SectionCard
            title="Cost estimate context"
            subtitle="These context items shape the cost story and affect how the estimate should be framed."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Delivery Approach"
                value={basics.deliveryApproach}
                accent="orange"
              />
              <OutputSummaryCard
                title="Estimated Budget Range"
                value={basics.estimatedBudgetRange}
              />
              <OutputSummaryCard
                title="Project Objective"
                value={basics.projectObjective}
              />
              <OutputSummaryCard
                title="Expected Business Outcome"
                value={basics.expectedBusinessOutcome}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Assumptions feeding this cost estimate"
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
                title="Benchmark Assumptions"
                value={assumptionsPreview.benchmarkAssumptions}
              />
              <OutputSummaryCard
                title="Burden Factor"
                value={assumptionsPreview.burdenFactor}
                accent="orange"
              />
              <OutputSummaryCard
                title="Confidence Level"
                value={assumptionsPreview.confidenceLevel}
              />
              <OutputSummaryCard
                title="Open Questions"
                value={assumptionsPreview.openQuestions}
              />
            </div>
          </SectionCard>

          <BusinessCaseCalculatorSection
            projectData={projectData}
            setProjectData={setProjectData}
          />

          <SectionCard
            title="Editable cost estimate fields"
            subtitle="You can fill these manually or let the AI response populate them."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel label="Cost Categories" />
                <TextArea
                  value={costEstimate.costCategories}
                  onChange={(e) =>
                    updateCostField("costCategories", e.target.value)
                  }
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel label="Known Inputs" />
                <TextArea
                  value={costEstimate.knownInputs}
                  onChange={(e) =>
                    updateCostField("knownInputs", e.target.value)
                  }
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel label="Missing Inputs" />
                <TextArea
                  value={costEstimate.missingInputs}
                  onChange={(e) =>
                    updateCostField("missingInputs", e.target.value)
                  }
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel label="Step-by-Step Questions" />
                <TextArea
                  value={costEstimate.followUpQuestions}
                  onChange={(e) =>
                    updateCostField("followUpQuestions", e.target.value)
                  }
                  rows={6}
                />
              </div>

              <div>
                <FieldLabel label="Recommended Estimation Methods" />
                <TextArea
                  value={costEstimate.estimationMethods}
                  onChange={(e) =>
                    updateCostField("estimationMethods", e.target.value)
                  }
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel label="Preliminary Cost Estimate Summary" />
                <TextArea
                  value={costEstimate.preliminaryCostSummary}
                  onChange={(e) =>
                    updateCostField("preliminaryCostSummary", e.target.value)
                  }
                  rows={7}
                />
              </div>

              <div>
                <FieldLabel label="Assumptions and Confidence Notes" />
                <TextArea
                  value={costEstimate.assumptionsConfidenceNotes}
                  onChange={(e) =>
                    updateCostField(
                      "assumptionsConfidenceNotes",
                      e.target.value
                    )
                  }
                  rows={5}
                />
              </div>
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="AI prompt builder"
          promptSubtitle="Generate a cost estimate prompt that uses previous sections and asks follow-up questions before producing final output."
          promptSectionName="Cost Estimate"
          promptText={livePrompt}
          onRefreshPrompt={handleGeneratePrompt}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI cost estimate response here. The first response may ask follow-up questions before final output."
          responseValue={costEstimate.aiResponse}
          onResponseChange={(e) =>
            updateCostField("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

First response may contain:
A. Context Review
B. Missing or Unclear Information
C. Follow-Up Questions
D. Recommended Assumptions if the User Wants to Proceed
E. Next Step Instruction

Required final structure:
A. Cost Categories
B. Known Inputs
C. Missing Inputs
D. Step-by-Step Questions
E. Recommended Estimation Methods
F. Preliminary Cost Estimate Summary
G. Assumptions and Confidence Notes`}
          responseRows={18}
          onParseResponse={handleParseResponse}
          onApplyResponse={handleParseResponse}
          parseLabel="Parse AI Response"
          applyLabel="Apply to Cost Estimate"
          helperTitle="How to use Cost Estimate"
          helperSteps={[
            {
              title: "Step 1",
              body: "Refresh the prompt so it uses the latest charter, plan, value context, assumptions register, and scenario calculator inputs.",
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
              body: "Paste the final AI response back into the tool and parse it into structured cost estimate fields.",
            },
          ]}
        />
      }
    />
  );
}