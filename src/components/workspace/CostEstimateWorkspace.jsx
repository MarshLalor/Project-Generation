import React, { useMemo, useState } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildCostEstimatePrompt,
  getAssumptionsPreview,
  parseCostEstimateResponse,
} from "../../utils/valueCostHelpers";
import { getCostEstimateCompletion } from "../../utils/workspaceHelpers";
import BusinessCaseCalculatorSection from "./BusinessCaseCalculatorSection";


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

export default function CostEstimateWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToValue,
  onContinueToOutputs,
  onContinueToAssumptions,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const basics = projectData.projectBasics;
  const costEstimate = projectData.costEstimate;

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
        { label: "AI Estimation Workflow", tone: "orange" },
      ]}
      title="Cost Estimate Workspace"
      description="Use this tab to create a high-level cost estimate for Year 1 and recurring annual cost using shared assumptions, labor rates, implementation effort, training, integration, and support assumptions."
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
          "This prompt now uses labor rates, effort assumptions, benchmark assumptions, burden factor, and calculation confidence from the Assumptions workspace.",
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

          <SectionCard
            title="Editable cost estimate fields"
            subtitle="You can fill these manually or let the AI response populate them."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel
                  label="Cost Categories"
                  helper="Separate cost types in a way that supports a rough cost model."
                />
                <TextArea
                  value={costEstimate.costCategories}
                  onChange={(e) =>
                    updateCostField("costCategories", e.target.value)
                  }
	<BusinessCaseCalculatorSection
  	projectData={projectData}
 	 setProjectData={setProjectData}
	/>

                  placeholder={`One item per line
Example: software / license cost
Example: implementation partner cost
Example: internal labor cost`}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Known Inputs"
                  helper="Capture cost information already known today, including assumptions that will drive the estimate."
                />
                <TextArea
                  value={costEstimate.knownInputs}
                  onChange={(e) =>
                    updateCostField("knownInputs", e.target.value)
                  }
                  placeholder={`One item per line
Example: vendor quote estimate available
Example: internal labor assumptions exist in the assumptions register`}
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
                  onChange={(e) =>
                    updateCostField("missingInputs", e.target.value)
                  }
                  placeholder={`One item per line
Example: software license tier
Example: integration labor hours
Example: training effort`}
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
                  placeholder={`One question per line
Example: What is the expected software subscription model?
Example: How many internal hours will be needed for implementation?`}
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
                  placeholder={`One item per line
Example: estimate internal labor using assumptions-register rates
Example: use low / expected / high range for vendor implementation`}
                  rows={5}
                />
              </div>

              <div>
                <FieldLabel
                  label="Preliminary Cost Estimate Summary"
                  helper="Capture the early structure of the estimate including one-time and recurring views."
                />
                <TextArea
                  value={costEstimate.preliminaryCostSummary}
                  onChange={(e) =>
                    updateCostField("preliminaryCostSummary", e.target.value)
                  }
                  placeholder={`Example:
Year 1 cost = software + implementation + internal labor + training + contingency
Recurring annual cost = ongoing license + support + maintenance`}
                  rows={7}
                />
              </div>

              <div>
                <FieldLabel
                  label="Assumptions and Confidence Notes"
                  helper="Track what is still estimated, benchmark-based, or uncertain."
                />
                <TextArea
                  value={costEstimate.assumptionsConfidenceNotes}
                  onChange={(e) =>
                    updateCostField(
                      "assumptionsConfidenceNotes",
                      e.target.value
                    )
                  }
                  placeholder={`One item per line
Example: internal labor rates are assumptions-register based
Example: vendor integration scope still needs validation`}
                  rows={5}
                />
              </div>
            </div>
          </SectionCard>
        </>
      }
      right={
        <PromptPanel
          promptTitle="AI prompt preview"
          promptSubtitle="Refresh the prompt whenever Project Basics, Charter, Plan Studio, Value Estimate, or Assumptions content changes."
          promptText={livePrompt}
          onRefreshPrompt={handleGeneratePrompt}
          onCopyPrompt={handleCopyPrompt}
          copyStatus={copyStatus}
          responseTitle="Paste AI response"
          responseSubtitle="Paste the AI cost estimate response here using the exact headings requested in the prompt."
          responseValue={costEstimate.aiResponse}
          onResponseChange={(e) =>
            updateCostField("aiResponse", e.target.value)
          }
          responsePlaceholder={`Paste the AI response here.

Required structure:
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
              body: "Refresh the prompt so it uses the latest charter, plan, value context, and assumptions register.",
            },
            {
              title: "Step 2",
              body: "Ask the AI to identify cost categories, known cost inputs, missing data, and estimation logic.",
            },
            {
              title: "Step 3",
              body: "Paste the result back into the tool and parse it into structured cost estimate fields.",
            },
            {
              title: "Step 4",
              body: "Refine the assumptions, confirm missing inputs, and prepare the estimate for Outputs.",
            },
          ]}
        />
      }
    />
  );
}