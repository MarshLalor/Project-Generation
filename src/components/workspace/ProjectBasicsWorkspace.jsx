import React, { useMemo } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import OutputSummaryCard from "./OutputSummaryCard";
import { generateCharterPayload } from "../../utils/charterHelpers";
import { getProjectBasicsCompletion } from "../../utils/workspaceHelpers";

const deliveryOptions = [
  { id: "waterfall", label: "Waterfall" },
  { id: "agile", label: "Agile" },
  { id: "hybrid", label: "Hybrid" },
];

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

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
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

export default function ProjectBasicsWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToIdeation,
  onContinueToCharter,
}) {
  const basics = projectData.projectBasics;

  const completion = useMemo(
    () => getProjectBasicsCompletion(projectData),
    [projectData]
  );

  const handleBasicsChange = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      projectBasics: {
        ...prev.projectBasics,
        [field]: value,
      },
    }));
  };

  const handleGenerateCharterDraft = () => {
    const charterPayload = generateCharterPayload(projectData);

    setProjectData((prev) => ({
      ...prev,
      charter: {
        ...prev.charter,
        ...charterPayload,
      },
    }));
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Project Basics", tone: "blue" },
        { label: "Core Intake", tone: "softBlue" },
        { label: "Feeds Charter", tone: "orange" },
      ]}
      title="Project Basics Workspace"
      description="Capture the minimum project information needed to generate a strong starting charter. This section is outcome-focused and should be usable whether the project is still emerging or already partially defined."
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
            onClick={onBackToIdeation}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
          >
            Back to Ideation
          </button>

          <button
            type="button"
            onClick={onContinueToCharter}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Go to Charter
          </button>
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Project Basics completeness",
        detail: `${completion.completed} of ${completion.total} tracked basics fields completed`,
        secondaryLabel: "Why this matters",
        secondaryText:
          "Project Basics becomes the reusable source context for the charter, plan prompts, value estimate, cost estimate, and final outputs.",
      }}
      left={
        <>
          <SectionCard
            title="Core project intake"
            subtitle="These fields create the reusable source context for the rest of the tool."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel label="Project Title" />
                <TextInput
                  value={basics.title}
                  onChange={(e) => handleBasicsChange("title", e.target.value)}
                  placeholder="Example: Paid Search Ad Quality Control Automation"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Business Problem / Opportunity"
                  helper="What is happening today that creates the need for this project?"
                />
                <TextArea
                  value={basics.businessProblem}
                  onChange={(e) =>
                    handleBasicsChange("businessProblem", e.target.value)
                  }
                  placeholder="Describe the current challenge, inefficiency, or opportunity."
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Project Objective"
                  helper="Write the project objective in plain business language."
                />
                <TextArea
                  value={basics.projectObjective}
                  onChange={(e) =>
                    handleBasicsChange("projectObjective", e.target.value)
                  }
                  placeholder="Example: Implement a QA workflow and software-supported review process to reduce manual effort and improve ad quality."
                  rows={4}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Expected Business Outcome"
                  helper="Focus on the outcome you want to achieve — time saved, cost reduced, quality improved, risk reduced, capacity created, or growth enabled."
                />
                <TextArea
                  value={basics.expectedBusinessOutcome}
                  onChange={(e) =>
                    handleBasicsChange("expectedBusinessOutcome", e.target.value)
                  }
                  placeholder="Example: Reduce manual review effort by 30–40%, improve ad quality, and speed campaign launch readiness."
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Delivery Approach"
                  helper="Choose the expected delivery model so downstream prompts align correctly."
                />
                <div className="flex flex-wrap gap-2">
                  {deliveryOptions.map((option) => {
                    const active = basics.deliveryApproach === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleBasicsChange("deliveryApproach", option.id)
                        }
                        className={[
                          "rounded-full px-4 py-2 text-sm font-medium transition",
                          active
                            ? "bg-sky-600 text-white"
                            : "border border-sky-200 bg-sky-50 text-slate-700 hover:bg-sky-100",
                        ].join(" ")}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel label="Project Sponsor" />
                <TextInput
                  value={basics.sponsor}
                  onChange={(e) =>
                    handleBasicsChange("sponsor", e.target.value)
                  }
                  placeholder="Name / role"
                />
              </div>

              <div>
                <FieldLabel label="Business Owner" />
                <TextInput
                  value={basics.businessOwner}
                  onChange={(e) =>
                    handleBasicsChange("businessOwner", e.target.value)
                  }
                  placeholder="Name / role"
                />
              </div>

              <div>
                <FieldLabel label="Project Manager" />
                <TextInput
                  value={basics.projectManager}
                  onChange={(e) =>
                    handleBasicsChange("projectManager", e.target.value)
                  }
                  placeholder="Name / role"
                />
              </div>

              <div>
                <FieldLabel label="Department / Business Unit" />
                <TextInput
                  value={basics.department}
                  onChange={(e) =>
                    handleBasicsChange("department", e.target.value)
                  }
                  placeholder="Function, team, or business area"
                />
              </div>

              <div>
                <FieldLabel label="Target Timeline" />
                <TextInput
                  value={basics.targetTimeline}
                  onChange={(e) =>
                    handleBasicsChange("targetTimeline", e.target.value)
                  }
                  placeholder="Example: Q3 2026 pilot / 12-week implementation"
                />
              </div>

              <div>
                <FieldLabel label="Estimated Budget Range" />
                <TextInput
                  value={basics.estimatedBudgetRange}
                  onChange={(e) =>
                    handleBasicsChange("estimatedBudgetRange", e.target.value)
                  }
                  placeholder="Example: $75K–$150K"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="In Scope"
                  helper="List what the project will include."
                />
                <TextArea
                  value={basics.scopeIn}
                  onChange={(e) =>
                    handleBasicsChange("scopeIn", e.target.value)
                  }
                  placeholder={`One item per line
Example: QA workflow redesign
Example: Tool selection and configuration`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Out of Scope"
                  helper="List what the project will explicitly not include."
                />
                <TextArea
                  value={basics.scopeOut}
                  onChange={(e) =>
                    handleBasicsChange("scopeOut", e.target.value)
                  }
                  placeholder={`One item per line
Example: Full media buying platform replacement`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Key Stakeholders"
                  helper="List stakeholder groups, teams, or named roles."
                />
                <TextArea
                  value={basics.keyStakeholders}
                  onChange={(e) =>
                    handleBasicsChange("keyStakeholders", e.target.value)
                  }
                  placeholder={`One item per line
Example: Paid Search Directors
Example: Campaign Managers`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Success Criteria"
                  helper="How will you know the project succeeded?"
                />
                <TextArea
                  value={basics.successCriteria}
                  onChange={(e) =>
                    handleBasicsChange("successCriteria", e.target.value)
                  }
                  placeholder={`One item per line
Example: Reduce review cycle time by 30%
Example: Lower ad error rate below 2%`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Key Assumptions"
                  helper="Capture assumptions that will influence scope, timing, value, or cost."
                />
                <TextArea
                  value={basics.keyAssumptions}
                  onChange={(e) =>
                    handleBasicsChange("keyAssumptions", e.target.value)
                  }
                  placeholder={`One item per line
Example: QA reviewers will adopt the new workflow
Example: baseline review volumes are stable`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Key Constraints"
                  helper="Capture what limits the project (timing, budget, systems, approvals, etc.)."
                />
                <TextArea
                  value={basics.keyConstraints}
                  onChange={(e) =>
                    handleBasicsChange("keyConstraints", e.target.value)
                  }
                  placeholder={`One item per line
Example: Must use existing martech environment
Example: Limited budget for implementation`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Risks / Dependencies"
                  helper="List early risks, dependencies, or required conditions."
                />
                <TextArea
                  value={basics.risksDependencies}
                  onChange={(e) =>
                    handleBasicsChange("risksDependencies", e.target.value)
                  }
                  placeholder={`One item per line
Example: Tool integration depends on vendor API access
Example: Review team standardization is not yet defined`}
                  rows={5}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Initial Value Hypothesis"
                  helper="What are the top ways this project could create value?"
                />
                <TextArea
                  value={basics.initialValueHypothesis}
                  onChange={(e) =>
                    handleBasicsChange(
                      "initialValueHypothesis",
                      e.target.value
                    )
                  }
                  placeholder={`One item per line
Example: labor savings from reduced manual review time
Example: lower rework caused by quality errors`}
                  rows={5}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleGenerateCharterDraft}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Generate Charter Draft Data
              </button>

              <button
                type="button"
                onClick={onContinueToCharter}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Continue to Charter
              </button>
            </div>
          </SectionCard>
        </>
      }
      right={
        <>
          <SectionCard
            title="Project readiness snapshot"
            subtitle="A quick view of the most important downstream source fields."
          >
            <div className="grid gap-4">
              <OutputSummaryCard title="Project Title" value={basics.title} />
              <OutputSummaryCard
                title="Business Problem / Opportunity"
                value={basics.businessProblem}
              />
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
                title="Key Stakeholders"
                value={basics.keyStakeholders}
              />
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
            title="How to use Project Basics"
            subtitle="Recommended workflow"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 1</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Start with the objective, expected business outcome, and
                  delivery approach. Those three fields do a lot of work
                  downstream.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 2</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Add scope, stakeholders, assumptions, constraints, and success
                  criteria to improve the future charter and planning prompts.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">Step 3</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Generate charter draft data, then move to the Charter tab to
                  review, refine, and prepare the project charter.
                </p>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}