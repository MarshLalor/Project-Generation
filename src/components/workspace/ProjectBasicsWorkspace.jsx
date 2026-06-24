import React, { useMemo } from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import {
  generateCharterPayload,
  getProjectBasicsReadiness,
} from "../../utils/charterHelpers";

const deliveryOptions = [
  { id: "waterfall", label: "Waterfall" },
  { id: "agile", label: "Agile" },
  { id: "hybrid", label: "Hybrid" },
];

function FieldLabel({ label, helper }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-slate-900">{label}</label>
      {helper && <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>}
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

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value && value.trim() ? value : "Not yet provided"}
      </p>
    </div>
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
  const readiness = useMemo(
    () => getProjectBasicsReadiness(basics),
    [basics]
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
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Project Basics</PillBadge>
              <PillBadge tone="softBlue">Core Intake</PillBadge>
              <PillBadge tone="orange">Feeds Charter</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Project Basics Workspace
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              Capture the minimum project information needed to generate a strong
              starting charter. This section stays outcome-focused and should be
              usable whether the project is still emerging or already partially
              defined.
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
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard
            title="Core project intake"
            subtitle="These fields create the reusable source context for the charter, planning prompts, value estimate, and cost estimate."
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
                  helper="Focus on the outcome you want to achieve — not only what is being built. Think cost reduction, time savings, quality improvement, risk reduction, capacity creation, revenue growth, or experience improvement."
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
                  helper="Choose the expected delivery model so future planning prompts align correctly."
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
                  onChange={(e) => handleBasicsChange("sponsor", e.target.value)}
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
                  onChange={(e) => handleBasicsChange("scopeIn", e.target.value)}
                  placeholder={"One item per line\nExample: QA workflow redesign\nExample: Tool selection and configuration"}
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
                  onChange={(e) => handleBasicsChange("scopeOut", e.target.value)}
                  placeholder={"One item per line\nExample: Full media buying platform replacement"}
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
                  placeholder={"One item per line\nExample: Paid Search Directors\nExample: Campaign Managers"}
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
                  placeholder={"One item per line\nExample: Reduce review cycle time by 30%\nExample: Lower ad error rate below 2%"}
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
                  placeholder={"One item per line\nExample: QA reviewers will adopt the new workflow\nExample: baseline review volumes are stable"}
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
                  placeholder={"One item per line\nExample: Must use existing martech environment\nExample: Limited budget for implementation"}
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
                  placeholder={"One item per line\nExample: Tool integration depends on vendor API access\nExample: Review team standardization is not yet defined"}
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
                    handleBasicsChange("initialValueHypothesis", e.target.value)
                  }
                  placeholder={"One item per line\nExample: labor savings from reduced manual review time\nExample: lower rework caused by quality errors"}
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
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Project readiness"
            subtitle="This gives a quick view of how complete the basics are for charter generation."
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">
                Charter readiness
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {readiness.percent}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {readiness.completed} of {readiness.total} key fields completed
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {readiness.checks.map((item) => {
                const complete = item.value && String(item.value).trim();

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3"
                  >
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-medium",
                        complete
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {complete ? "Ready" : "Needs input"}
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Charter source preview"
            subtitle="This is the core source content the Charter tab will transform into a structured draft."
          >
            <div className="space-y-4">
              <SummaryItem label="Project Title" value={basics.title} />
              <SummaryItem
                label="Business Problem / Opportunity"
                value={basics.businessProblem}
              />
              <SummaryItem
                label="Project Objective"
                value={basics.projectObjective}
              />
              <SummaryItem
                label="Expected Business Outcome"
                value={basics.expectedBusinessOutcome}
              />
              <SummaryItem
                label="Delivery Approach"
                value={basics.deliveryApproach}
              />
              <SummaryItem label="In Scope" value={basics.scopeIn} />
              <SummaryItem label="Out of Scope" value={basics.scopeOut} />
              <SummaryItem
                label="Key Stakeholders"
                value={basics.keyStakeholders}
              />
              <SummaryItem
                label="Success Criteria"
                value={basics.successCriteria}
              />
              <SummaryItem
                label="Initial Value Hypothesis"
                value={basics.initialValueHypothesis}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="How to use this tab"
            subtitle="Recommended flow"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 1</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Start with the objective, expected business outcome, and delivery
                  approach. Those three fields do a lot of work downstream.
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
        </div>
      </div>
    </div>
  );
}