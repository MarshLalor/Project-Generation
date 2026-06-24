import React, { useMemo, useState } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildAssumptionsPrompt,
  createDefaultAssumptionsState,
  createEmptyBenchmarkAssumption,
  createEmptyLaborRate,
  createEmptyMetricAssumption,
  ensureAssumptionsState,
  summarizeAssumptions,
} from "../../utils/assumptionsHelpers";
import { getAssumptionsCompletion } from "../../utils/workspaceHelpers";

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

function RowActions({ onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
    >
      Remove
    </button>
  );
}

export default function AssumptionsWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToCost,
  onContinueToOutputs,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const assumptions = useMemo(
    () => ensureAssumptionsState(projectData.assumptions),
    [projectData.assumptions]
  );

  const completion = useMemo(
    () => getAssumptionsCompletion({ assumptions }),
    [assumptions]
  );

  const summary = useMemo(() => summarizeAssumptions(assumptions), [assumptions]);

  const benchmarkPrompt = useMemo(() => {
    return assumptions.benchmarkPrompt && assumptions.benchmarkPrompt.trim()
      ? assumptions.benchmarkPrompt
      : buildAssumptionsPrompt({ ...projectData, assumptions });
  }, [projectData, assumptions]);

  const updateAssumptions = (updater) => {
    setProjectData((prev) => ({
      ...prev,
      assumptions: updater(ensureAssumptionsState(prev.assumptions)),
    }));
  };

  const updateGroupNotes = (group, value) => {
    updateAssumptions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        notes: value,
      },
    }));
  };

  const updateLaborRateRow = (id, field, value) => {
    updateAssumptions((prev) => ({
      ...prev,
      laborRates: {
        ...prev.laborRates,
        roles: prev.laborRates.roles.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    }));
  };

  const updateMetricRow = (group, id, field, value) => {
    updateAssumptions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        items: prev[group].items.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    }));
  };

  const updateBenchmarkRow = (id, field, value) => {
    updateAssumptions((prev) => ({
      ...prev,
      benchmarkAssumptions: {
        ...prev.benchmarkAssumptions,
        items: prev.benchmarkAssumptions.items.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    }));
  };

  const addLaborRateRow = () => {
    updateAssumptions((prev) => ({
      ...prev,
      laborRates: {
        ...prev.laborRates,
        roles: [...prev.laborRates.roles, createEmptyLaborRate()],
      },
    }));
  };

  const addMetricRow = (group) => {
    updateAssumptions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        items: [...prev[group].items, createEmptyMetricAssumption()],
      },
    }));
  };

  const addBenchmarkRow = () => {
    updateAssumptions((prev) => ({
      ...prev,
      benchmarkAssumptions: {
        ...prev.benchmarkAssumptions,
        items: [...prev.benchmarkAssumptions.items, createEmptyBenchmarkAssumption()],
      },
    }));
  };

  const removeLaborRateRow = (id) => {
    updateAssumptions((prev) => {
      const nextRows = prev.laborRates.roles.filter((row) => row.id !== id);

      return {
        ...prev,
        laborRates: {
          ...prev.laborRates,
          roles: nextRows.length ? nextRows : [createEmptyLaborRate()],
        },
      };
    });
  };

  const removeMetricRow = (group, id) => {
    updateAssumptions((prev) => {
      const nextRows = prev[group].items.filter((row) => row.id !== id);

      return {
        ...prev,
        [group]: {
          ...prev[group],
          items: nextRows.length ? nextRows : [createEmptyMetricAssumption()],
        },
      };
    });
  };

  const removeBenchmarkRow = (id) => {
    updateAssumptions((prev) => {
      const nextRows = prev.benchmarkAssumptions.items.filter(
        (row) => row.id !== id
      );

      return {
        ...prev,
        benchmarkAssumptions: {
          ...prev.benchmarkAssumptions,
          items: nextRows.length ? nextRows : [createEmptyBenchmarkAssumption()],
        },
      };
    });
  };

  const updateCalculationSetting = (field, value) => {
    updateAssumptions((prev) => ({
      ...prev,
      calculationAssumptions: {
        ...prev.calculationAssumptions,
        [field]: value,
      },
    }));
  };

  const handleRefreshPrompt = () => {
    const prompt = buildAssumptionsPrompt({ ...projectData, assumptions });

    updateAssumptions((prev) => ({
      ...prev,
      benchmarkPrompt: prompt,
    }));
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(benchmarkPrompt);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  const copyLabel =
    copyStatus === "copied"
      ? "Prompt Copied"
      : copyStatus === "failed"
      ? "Copy Failed"
      : "Copy Prompt";

  const handleResetAssumptions = () => {
    setProjectData((prev) => ({
      ...prev,
      assumptions: createDefaultAssumptionsState(),
    }));
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Assumptions Workspace", tone: "blue" },
        { label: "Shared Inputs Register", tone: "softBlue" },
        { label: "Planning + Estimation Glue", tone: "orange" },
      ]}
      title="Assumptions Workspace"
      description="Use this tab to centralize labor rates, effort assumptions, volume assumptions, benchmark assumptions, calculation settings, and open questions so the project plan, value estimate, cost estimate, and outputs can work from a shared source of truth."
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
            onClick={onBackToCost}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
          >
            Back to Cost Estimate
          </button>

          <button
            type="button"
            onClick={onContinueToOutputs}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Go to Outputs
          </button>
        </>
      }
      progress={{
        percent: completion.percent,
        completed: completion.completed,
        total: completion.total,
        metricLabel: "Assumptions completeness",
        detail: `${completion.completed} of ${completion.total} tracked assumptions areas populated`,
        secondaryLabel: "Why this matters",
        secondaryText:
          "Assumptions are the connective tissue across valuation, costing, schedule confidence, and final business case quality.",
      }}
      left={
        <>
          <SectionCard
            title="Labor Rates"
            subtitle="Track annual salary, hourly rate, or fully loaded rate assumptions by role."
          >
            <div className="space-y-4">
              {assumptions.laborRates.roles.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-sky-100 bg-sky-50/50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <FieldLabel label="Role" />
                      <TextInput
                        value={row.role}
                        onChange={(e) =>
                          updateLaborRateRow(row.id, "role", e.target.value)
                        }
                        placeholder="Example: Paid Search Manager"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Annual Salary" />
                      <TextInput
                        value={row.annualSalary}
                        onChange={(e) =>
                          updateLaborRateRow(
                            row.id,
                            "annualSalary",
                            e.target.value
                          )
                        }
                        placeholder="Example: 105000"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Hourly Rate" />
                      <TextInput
                        value={row.hourlyRate}
                        onChange={(e) =>
                          updateLaborRateRow(row.id, "hourlyRate", e.target.value)
                        }
                        placeholder="Example: 50"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Fully Loaded Rate" />
                      <TextInput
                        value={row.fullyLoadedRate}
                        onChange={(e) =>
                          updateLaborRateRow(
                            row.id,
                            "fullyLoadedRate",
                            e.target.value
                          )
                        }
                        placeholder="Example: 68"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Source" />
                      <TextInput
                        value={row.source}
                        onChange={(e) =>
                          updateLaborRateRow(row.id, "source", e.target.value)
                        }
                        placeholder="Example: internal finance / Salary.com"
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-3">
                      <FieldLabel label="Notes" />
                      <TextArea
                        value={row.notes}
                        onChange={(e) =>
                          updateLaborRateRow(row.id, "notes", e.target.value)
                        }
                        placeholder="Add any context, burden assumptions, or scenario notes."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <RowActions onRemove={() => removeLaborRateRow(row.id)} />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={addLaborRateRow}
                  className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  Add Labor Rate Row
                </button>
              </div>

              <div>
                <FieldLabel
                  label="Labor Rate Notes"
                  helper="Use this for cross-role assumptions or notes about how rates were derived."
                />
                <TextArea
                  value={assumptions.laborRates.notes}
                  onChange={(e) => updateGroupNotes("laborRates", e.target.value)}
                  placeholder="Example: Fully loaded rates use a 1.3 burden factor where internal rates are unavailable."
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Effort Assumptions"
            subtitle="Track effort assumptions such as hours per review, implementation hours, training hours, or admin effort."
          >
            <div className="space-y-4">
              {assumptions.effortAssumptions.items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-sky-100 bg-sky-50/50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <FieldLabel label="Assumption Name" />
                      <TextInput
                        value={row.name}
                        onChange={(e) =>
                          updateMetricRow(
                            "effortAssumptions",
                            row.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Example: Manual QA hours per week"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Value" />
                      <TextInput
                        value={row.value}
                        onChange={(e) =>
                          updateMetricRow(
                            "effortAssumptions",
                            row.id,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Example: 12"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Unit" />
                      <TextInput
                        value={row.unit}
                        onChange={(e) =>
                          updateMetricRow(
                            "effortAssumptions",
                            row.id,
                            "unit",
                            e.target.value
                          )
                        }
                        placeholder="hours / weeks / reviews"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Source" />
                      <TextInput
                        value={row.source}
                        onChange={(e) =>
                          updateMetricRow(
                            "effortAssumptions",
                            row.id,
                            "source",
                            e.target.value
                          )
                        }
                        placeholder="Example: SME estimate"
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-2">
                      <FieldLabel label="Notes" />
                      <TextArea
                        value={row.notes}
                        onChange={(e) =>
                          updateMetricRow(
                            "effortAssumptions",
                            row.id,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="Add context, scenario notes, or caveats."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <RowActions
                      onRemove={() =>
                        removeMetricRow("effortAssumptions", row.id)
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addMetricRow("effortAssumptions")}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Add Effort Assumption
              </button>

              <div>
                <FieldLabel label="Effort Notes" />
                <TextArea
                  value={assumptions.effortAssumptions.notes}
                  onChange={(e) =>
                    updateGroupNotes("effortAssumptions", e.target.value)
                  }
                  placeholder="Add any overarching notes about effort data quality, source confidence, or range logic."
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Volume Assumptions"
            subtitle="Track transaction, campaign, volume, or throughput assumptions that affect value and cost calculations."
          >
            <div className="space-y-4">
              {assumptions.volumeAssumptions.items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-sky-100 bg-sky-50/50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <FieldLabel label="Assumption Name" />
                      <TextInput
                        value={row.name}
                        onChange={(e) =>
                          updateMetricRow(
                            "volumeAssumptions",
                            row.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Example: Ads reviewed per month"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Value" />
                      <TextInput
                        value={row.value}
                        onChange={(e) =>
                          updateMetricRow(
                            "volumeAssumptions",
                            row.id,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Example: 20000"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Unit" />
                      <TextInput
                        value={row.unit}
                        onChange={(e) =>
                          updateMetricRow(
                            "volumeAssumptions",
                            row.id,
                            "unit",
                            e.target.value
                          )
                        }
                        placeholder="ads / campaigns / reviews"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Source" />
                      <TextInput
                        value={row.source}
                        onChange={(e) =>
                          updateMetricRow(
                            "volumeAssumptions",
                            row.id,
                            "source",
                            e.target.value
                          )
                        }
                        placeholder="Example: operations reporting"
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-2">
                      <FieldLabel label="Notes" />
                      <TextArea
                        value={row.notes}
                        onChange={(e) =>
                          updateMetricRow(
                            "volumeAssumptions",
                            row.id,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="Add context, time window, or scenario notes."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <RowActions
                      onRemove={() =>
                        removeMetricRow("volumeAssumptions", row.id)
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addMetricRow("volumeAssumptions")}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Add Volume Assumption
              </button>

              <div>
                <FieldLabel label="Volume Notes" />
                <TextArea
                  value={assumptions.volumeAssumptions.notes}
                  onChange={(e) =>
                    updateGroupNotes("volumeAssumptions", e.target.value)
                  }
                  placeholder="Add any notes about seasonality, period assumptions, or volume confidence."
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Benchmark Assumptions"
            subtitle="Track externally sourced reference assumptions such as salary benchmarks, adoption rates, or industry norms."
          >
            <div className="space-y-4">
              {assumptions.benchmarkAssumptions.items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-sky-100 bg-sky-50/50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <FieldLabel label="Category" />
                      <TextInput
                        value={row.category}
                        onChange={(e) =>
                          updateBenchmarkRow(row.id, "category", e.target.value)
                        }
                        placeholder="Example: Salary benchmark"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Source" />
                      <TextInput
                        value={row.source}
                        onChange={(e) =>
                          updateBenchmarkRow(row.id, "source", e.target.value)
                        }
                        placeholder="Example: Salary.com"
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-3">
                      <FieldLabel label="Assumption" />
                      <TextArea
                        value={row.assumption}
                        onChange={(e) =>
                          updateBenchmarkRow(
                            row.id,
                            "assumption",
                            e.target.value
                          )
                        }
                        placeholder="Describe the benchmark-assumption being used."
                        rows={3}
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-3">
                      <FieldLabel label="Notes" />
                      <TextArea
                        value={row.notes}
                        onChange={(e) =>
                          updateBenchmarkRow(row.id, "notes", e.target.value)
                        }
                        placeholder="Add caveats, date range, geography notes, or scenario notes."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <RowActions onRemove={() => removeBenchmarkRow(row.id)} />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBenchmarkRow}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Add Benchmark Assumption
              </button>

              <div>
                <FieldLabel label="Benchmark Notes" />
                <TextArea
                  value={assumptions.benchmarkAssumptions.notes}
                  onChange={(e) =>
                    updateGroupNotes("benchmarkAssumptions", e.target.value)
                  }
                  placeholder="Add any notes about benchmark source quality, comparability, or recency."
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Calculation Settings + Open Questions"
            subtitle="Use this section for cross-cutting calculation settings and unresolved items."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel
                  label="Burden Factor"
                  helper="Example: 1.25, 1.3, or 1.4"
                />
                <TextInput
                  value={assumptions.calculationAssumptions.burdenFactor}
                  onChange={(e) =>
                    updateCalculationSetting("burdenFactor", e.target.value)
                  }
                  placeholder="Example: 1.3"
                />
              </div>

              <div>
                <FieldLabel
                  label="Confidence Level"
                  helper="Example: Low / Medium / High"
                />
                <TextInput
                  value={assumptions.calculationAssumptions.confidenceLevel}
                  onChange={(e) =>
                    updateCalculationSetting("confidenceLevel", e.target.value)
                  }
                  placeholder="Example: Medium"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel label="Calculation Notes" />
                <TextArea
                  value={assumptions.calculationAssumptions.notes}
                  onChange={(e) =>
                    updateCalculationSetting("notes", e.target.value)
                  }
                  placeholder="Add any notes about scenario logic, burden assumptions, or confidence framing."
                  rows={4}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel
                  label="Open Questions"
                  helper="Track unresolved questions that affect planning, value, or cost quality."
                />
                <TextArea
                  value={assumptions.openQuestions}
                  onChange={(e) =>
                    updateAssumptions((prev) => ({
                      ...prev,
                      openQuestions: e.target.value,
                    }))
                  }
                  placeholder={`One question per line
Example: What are the validated fully loaded hourly rates by role?
Example: What is the current rework rate for ad QA issues?`}
                  rows={6}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleResetAssumptions}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Reset Assumptions Workspace
                </button>
              </div>
            </div>
          </SectionCard>
        </>
      }
      right={
        <>
          <SectionCard
            title="Assumptions summary"
            subtitle="A quick view of what is currently captured in the shared assumptions register."
            className="xl:sticky xl:top-24"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputSummaryCard
                title="Labor Rate Rows"
                value={String(summary.laborCount)}
                accent="orange"
              />
              <OutputSummaryCard
                title="Effort Assumptions"
                value={String(summary.effortCount)}
              />
              <OutputSummaryCard
                title="Volume Assumptions"
                value={String(summary.volumeCount)}
              />
              <OutputSummaryCard
                title="Benchmark Assumptions"
                value={String(summary.benchmarkCount)}
                accent="orange"
              />
              <OutputSummaryCard
                title="Burden Factor"
                value={summary.burdenFactor}
              />
              <OutputSummaryCard
                title="Confidence Level"
                value={summary.confidenceLevel}
              />
            </div>

            <div className="mt-4">
              <OutputSummaryCard
                title="Open Questions Snapshot"
                value={summary.openQuestions}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="AI benchmark helper prompt"
            subtitle="Use this prompt with an AI partner to help identify missing benchmark assumptions, salary logic, or calculation settings."
            className="xl:sticky xl:top-[420px]"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {benchmarkPrompt}
                </pre>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleRefreshPrompt}
                  className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                >
                  Refresh Prompt
                </button>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {copyLabel}
                </button>
              </div>

              <div>
                <FieldLabel
                  label="AI Notes"
                  helper="Paste notes or recommendations from the AI partner here, then manually transfer anything useful into the assumptions register."
                />
                <TextArea
                  value={assumptions.aiNotes}
                  onChange={(e) =>
                    updateAssumptions((prev) => ({
                      ...prev,
                      aiNotes: e.target.value,
                    }))
                  }
                  placeholder={`Paste AI notes here.

Suggested response structure:
A. Recommended Labor Rate Assumptions
B. Recommended Effort Assumptions
C. Recommended Volume Assumptions
D. Recommended Benchmark Assumptions
E. Suggested Calculation Settings
F. Open Questions to Resolve`}
                  rows={12}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="How to use Assumptions"
            subtitle="Recommended workflow for building the shared assumptions register."
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 1</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Capture the most important labor, effort, and volume assumptions
                  that affect your project plan, value estimate, and cost estimate.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 2</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Use benchmark assumptions when internal data is unavailable, but
                  clearly note the source and confidence level.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Step 3</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Set your burden factor and confidence level so later estimates
                  are framed consistently.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">Step 4</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Carry unresolved items into Open Questions so Outputs can surface
                  what still needs validation.
                </p>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}