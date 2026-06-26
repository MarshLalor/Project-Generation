import React, { useMemo } from "react";
import SectionCard from "../common/SectionCard";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  calculateRoleWeightedLabor,
  calculateScenarioSummary,
  createRoleSavingsRow,
  ensureBusinessCaseState,
  formatCurrency,
  formatNumber,
} from "../../utils/calculationHelpers";
import {
  buildCalculatorSuggestionFromAssumptions,
  buildRoleSavingsRowsFromAssumptions,
} from "../../utils/assumptionCalculationHelpers";
import {
  buildTemplateApplicationNotes,
  scenarioTemplates,
} from "../../utils/scenarioTemplateHelpers";

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

export default function BusinessCaseCalculatorSection({
  projectData,
  setProjectData,
}) {
  const businessCase = useMemo(
    () => ensureBusinessCaseState(projectData.businessCase),
    [projectData.businessCase]
  );

  const summary = useMemo(
    () => calculateScenarioSummary(businessCase),
    [businessCase]
  );

  const roleWeightedLabor = useMemo(
    () => calculateRoleWeightedLabor(businessCase.roleSavings.items),
    [businessCase.roleSavings.items]
  );

  const assumptionSuggestion = useMemo(
    () => buildCalculatorSuggestionFromAssumptions(projectData),
    [projectData]
  );

  const updateBusinessCase = (updater) => {
    setProjectData((prev) => ({
      ...prev,
      businessCase: updater(ensureBusinessCaseState(prev.businessCase)),
    }));
  };

  const updateValueInput = (field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      valueInputs: {
        ...prev.valueInputs,
        [field]: value,
      },
    }));
  };

  const updateCostInput = (field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      costInputs: {
        ...prev.costInputs,
        [field]: value,
      },
    }));
  };

  const updateScenario = (scenarioKey, field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      scenarios: {
        ...prev.scenarios,
        [scenarioKey]: {
          ...prev.scenarios[scenarioKey],
          [field]: value,
        },
      },
    }));
  };

  const updateRoleSavingsRow = (id, field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      roleSavings: {
        ...prev.roleSavings,
        items: prev.roleSavings.items.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      },
    }));
  };

  const addRoleSavingsRow = () => {
    updateBusinessCase((prev) => ({
      ...prev,
      roleSavings: {
        ...prev.roleSavings,
        items: [...prev.roleSavings.items, createRoleSavingsRow()],
      },
    }));
  };

  const removeRoleSavingsRow = (id) => {
    updateBusinessCase((prev) => ({
      ...prev,
      roleSavings: {
        ...prev.roleSavings,
        items: prev.roleSavings.items.filter((row) => row.id !== id),
      },
    }));
  };

  const updateRoleSavingsNotes = (value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      roleSavings: {
        ...prev.roleSavings,
        notes: value,
      },
    }));
  };

  const handleImportRolesFromAssumptions = () => {
    const importedRows = buildRoleSavingsRowsFromAssumptions(projectData);

    updateBusinessCase((prev) => ({
      ...prev,
      roleSavings: {
        ...prev.roleSavings,
        items: importedRows.length ? importedRows : prev.roleSavings.items,
        notes: importedRows.length
          ? `Imported ${importedRows.length} role row(s) from the Assumptions workspace. Add annual hours saved by role to calculate role-weighted labor savings.`
          : "No usable labor rate rows were found in the Assumptions workspace.",
      },
    }));
  };

  const handleApplyRoleWeightedLabor = () => {
    updateBusinessCase((prev) => ({
      ...prev,
      valueInputs: {
        ...prev.valueInputs,
        annualSavedHours: roleWeightedLabor.totalAnnualHoursSaved
          ? String(Math.round(roleWeightedLabor.totalAnnualHoursSaved))
          : prev.valueInputs.annualSavedHours,
        weightedHourlyRate: roleWeightedLabor.weightedHourlyRate
          ? String(Math.round(roleWeightedLabor.weightedHourlyRate))
          : prev.valueInputs.weightedHourlyRate,
        notes: [
          prev.valueInputs.notes,
          "",
          "Role-Weighted Labor Model Applied:",
          `Total annual hours saved: ${Math.round(
            roleWeightedLabor.totalAnnualHoursSaved
          )}`,
          `Weighted hourly rate: ${Math.round(
            roleWeightedLabor.weightedHourlyRate
          )}`,
          `Annual labor savings: ${formatCurrency(
            roleWeightedLabor.totalAnnualLaborSavings
          )}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    }));
  };

  const handleApplyAssumptions = () => {
    updateBusinessCase((prev) => ({
      ...prev,
      valueInputs: {
        ...prev.valueInputs,
        annualSavedHours:
          assumptionSuggestion.annualSavedHours ||
          prev.valueInputs.annualSavedHours,
        weightedHourlyRate:
          assumptionSuggestion.weightedHourlyRate ||
          prev.valueInputs.weightedHourlyRate,
        notes: assumptionSuggestion.valueNotes || prev.valueInputs.notes,
      },
      costInputs: {
        ...prev.costInputs,
        internalLaborCost:
          assumptionSuggestion.internalLaborCost ||
          prev.costInputs.internalLaborCost,
        notes: assumptionSuggestion.costNotes || prev.costInputs.notes,
      },
    }));
  };

  const handleApplyScenarioTemplate = (template) => {
    const templateNotes = buildTemplateApplicationNotes(template);

    updateBusinessCase((prev) => ({
      ...prev,
      valueInputs: {
        ...prev.valueInputs,
        notes: [
          prev.valueInputs.notes,
          "",
          templateNotes,
          template.valueNotes,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      costInputs: {
        ...prev.costInputs,
        notes: [
          prev.costInputs.notes,
          "",
          templateNotes,
          template.costNotes,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      scenarios: {
        low: {
          ...prev.scenarios.low,
          ...template.scenarios.low,
        },
        expected: {
          ...prev.scenarios.expected,
          ...template.scenarios.expected,
        },
        high: {
          ...prev.scenarios.high,
          ...template.scenarios.high,
        },
      },
    }));
  };

  return (
    <SectionCard
      title="Scenario Calculator"
      subtitle="Use lightweight inputs, assumption-based suggestions, role-weighted labor modeling, and one-click scenario templates to create low, expected, and high business case scenarios."
    >
      <div className="space-y-8">
        <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-5">
          <h3 className="text-base font-semibold text-slate-900">
            Scenario Templates
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Apply a template to quickly update low, expected, and high scenario
            factors. You can still edit the factors manually afterward.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scenarioTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleApplyScenarioTemplate(template)}
                className="rounded-3xl border border-sky-100 bg-white p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
              >
                <h4 className="text-sm font-semibold text-slate-900">
                  {template.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-orange-700">
                Assumption-Based Suggestions
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Use the assumptions register to estimate annual saved hours,
                blended hourly rate, and internal labor cost.
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyAssumptions}
              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Apply Assumptions to Calculator
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <OutputSummaryCard
              title="Suggested Annual Saved Hours"
              value={
                assumptionSuggestion.annualSavedHours ||
                "No savings-hour suggestion available."
              }
              accent="orange"
            />
            <OutputSummaryCard
              title="Suggested Weighted Hourly Rate"
              value={
                assumptionSuggestion.weightedHourlyRate
                  ? `$${assumptionSuggestion.weightedHourlyRate}`
                  : "No labor-rate suggestion available."
              }
            />
            <OutputSummaryCard
              title="Suggested Internal Labor Cost"
              value={
                assumptionSuggestion.internalLaborCost
                  ? formatCurrency(assumptionSuggestion.internalLaborCost)
                  : "No internal-labor-cost suggestion available."
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Role-Weighted Labor Model
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Estimate annual labor savings by role. Import roles from labor
                rate assumptions, enter annual hours saved by role, then apply
                the weighted result to the main value inputs.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleImportRolesFromAssumptions}
                className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Import Roles
              </button>

              <button
                type="button"
                onClick={addRoleSavingsRow}
                className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Add Role
              </button>

              <button
                type="button"
                onClick={handleApplyRoleWeightedLabor}
                className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Apply Role Model
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <OutputSummaryCard
              title="Total Role Hours Saved"
              value={formatNumber(roleWeightedLabor.totalAnnualHoursSaved)}
              accent="orange"
            />
            <OutputSummaryCard
              title="Weighted Hourly Rate"
              value={formatCurrency(roleWeightedLabor.weightedHourlyRate)}
            />
            <OutputSummaryCard
              title="Role-Based Annual Labor Savings"
              value={formatCurrency(roleWeightedLabor.totalAnnualLaborSavings)}
              accent="orange"
            />
          </div>

          <div className="mt-5 space-y-4">
            {businessCase.roleSavings.items.length === 0 ? (
              <div className="rounded-2xl border border-sky-100 bg-white p-4">
                <p className="text-sm text-slate-700">
                  No role rows yet. Import roles from assumptions or add a role
                  manually.
                </p>
              </div>
            ) : (
              businessCase.roleSavings.items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-sky-100 bg-white p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <FieldLabel label="Role" />
                      <TextInput
                        value={row.role}
                        onChange={(e) =>
                          updateRoleSavingsRow(row.id, "role", e.target.value)
                        }
                        placeholder="Example: Paid Search Manager"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Hourly / Fully Loaded Rate" />
                      <TextInput
                        value={row.hourlyRate}
                        onChange={(e) =>
                          updateRoleSavingsRow(
                            row.id,
                            "hourlyRate",
                            e.target.value
                          )
                        }
                        placeholder="Example: 65"
                      />
                    </div>

                    <div>
                      <FieldLabel label="Annual Hours Saved" />
                      <TextInput
                        value={row.annualHoursSaved}
                        onChange={(e) =>
                          updateRoleSavingsRow(
                            row.id,
                            "annualHoursSaved",
                            e.target.value
                          )
                        }
                        placeholder="Example: 300"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeRoleSavingsRow(row.id)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="md:col-span-2 xl:col-span-4">
                      <FieldLabel label="Notes" />
                      <TextArea
                        value={row.notes}
                        onChange={(e) =>
                          updateRoleSavingsRow(row.id, "notes", e.target.value)
                        }
                        placeholder="Add role-specific context or source notes."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}

            <div>
              <FieldLabel label="Role Model Notes" />
              <TextArea
                value={businessCase.roleSavings.notes}
                onChange={(e) => updateRoleSavingsNotes(e.target.value)}
                placeholder="Add notes about role weighting, assumptions, or confidence."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Value Inputs
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            These inputs estimate annual benefit potential.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel
                label="Annual Saved Hours"
                helper="Total estimated hours saved per year."
              />
              <TextInput
                value={businessCase.valueInputs.annualSavedHours}
                onChange={(e) =>
                  updateValueInput("annualSavedHours", e.target.value)
                }
                placeholder="Example: 1200"
              />
            </div>

            <div>
              <FieldLabel
                label="Weighted Hourly Rate"
                helper="Blended or fully loaded hourly rate."
              />
              <TextInput
                value={businessCase.valueInputs.weightedHourlyRate}
                onChange={(e) =>
                  updateValueInput("weightedHourlyRate", e.target.value)
                }
                placeholder="Example: 65"
              />
             label="Rework Savings" />
              <TextInput
                value={businessCase.valueInputs.reworkSavings}
                onChange={(e) =>
                  updateValueInput("reworkSavings", e.target.value)
                }
                placeholder="Example: 25000"
              />
            </div>

            <div>
              <FieldLabel label="Cycle-Time Savings" />
              <TextInput
                value={businessCase.valueInputs.cycleTimeSavings}
                onChange={(e) =>
                  updateValueInput("cycleTimeSavings", e.target.value)
                }
                placeholder="Example: 15000"
              />
            </div>

            <div>
              <FieldLabel label="Revenue Uplift" />
              <TextInput
                value={businessCase.valueInputs.revenueUplift}
                onChange={(e) =>
                  updateValueInput("revenueUplift", e.target.value)
                }
                placeholder="Example: 50000"
              />
            </div>

            <div>
              <FieldLabel label="Risk Avoidance" />
              <TextInput
                value={businessCase.valueInputs.riskAvoidance}
                onChange={(e) =>
                  updateValueInput("riskAvoidance", e.target.value)
                }
                placeholder="Example: 10000"
              />
            </div>

            <div>
              <FieldLabel label="Capacity Value" />
              <TextInput
                value={businessCase.valueInputs.capacityValue}
                onChange={(e) =>
                  updateValueInput("capacityValue", e.target.value)
                }
                placeholder="Example: 30000"
              />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel label="Value Notes" />
              <TextArea
                value={businessCase.valueInputs.notes}
                onChange={(e) => updateValueInput("notes", e.target.value)}
                placeholder="Add notes about how value inputs were estimated."
                rows={4}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Cost Inputs
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            These inputs estimate Year 1 and recurring annual cost.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel label="Software / License Cost" />
              <TextInput
                value={businessCase.costInputs.softwareCost}
                onChange={(e) =>
                  updateCostInput("softwareCost", e.target.value)
                }
                placeholder="Example: 60000"
              />
            </div>

            <div>
              <FieldLabel label="Implementation Cost" />
              <TextInput
                value={businessCase.costInputs.implementationCost}
                onChange={(e) =>
                  updateCostInput("implementationCost", e.target.value)
                }
                placeholder="Example: 45000"
              />
            </div>

            <div>
              <FieldLabel label="Internal Labor Cost" />
              <TextInput
                value={businessCase.costInputs.internalLaborCost}
                onChange={(e) =>
                  updateCostInput("internalLaborCost", e.target.value)
                }
                placeholder="Example: 25000"
              />
            </div>

            <div>
              <FieldLabel label="Training Cost" />
              <TextInput
                value={businessCase.costInputs.trainingCost}
                onChange={(e) =>
                  updateCostInput("trainingCost", e.target.value)
                }
                placeholder="Example: 10000"
              />
            </div>

            <div>
              <FieldLabel label="Integration Cost" />
              <TextInput
                value={businessCase.costInputs.integrationCost}
                onChange={(e) =>
                  updateCostInput("integrationCost", e.target.value)
                }
                placeholder="Example: 20000"
              />
            </div>

            <div>
              <FieldLabel label="Support / Launch Cost" />
              <TextInput
                value={businessCase.costInputs.supportCost}
                onChange={(e) => updateCostInput("supportCost", e.target.value)}
                placeholder="Example: 5000"
              />
            </div>

            <div>
              <FieldLabel label="Recurring Software Cost" />
              <TextInput
                value={businessCase.costInputs.recurringSoftwareCost}
                onChange={(e) =>
                  updateCostInput("recurringSoftwareCost", e.target.value)
                }
                placeholder="Example: 60000"
              />
            </div>

            <div>
              <FieldLabel label="Recurring Support Cost" />
              <TextInput
                value={businessCase.costInputs.recurringSupportCost}
                onChange={(e) =>
                  updateCostInput("recurringSupportCost", e.target.value)
                }
                placeholder="Example: 10000"
              />
            </div>

            <div>
              <FieldLabel
                label="Contingency Percent"
                helper="Use a whole number. Example: 15"
              />
              <TextInput
                value={businessCase.costInputs.contingencyPercent}
                onChange={(e) =>
                  updateCostInput("contingencyPercent", e.target.value)
                }
                placeholder="Example: 15"
              />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel label="Cost Notes" />
              <TextArea
                value={businessCase.costInputs.notes}
                onChange={(e) => updateCostInput("notes", e.target.value)}
                placeholder="Add notes about cost assumptions, confidence, or known gaps."
                rows={4}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Scenario Factors
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Adjust benefit and cost multipliers for low, expected, and high cases.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {summary.scenarios.map((scenario) => (
              <div
                key={scenario.key}
                className="rounded-3xl border border-sky-100 bg-sky-50/60 p-4"
              >
                <h4 className="text-sm font-semibold text-slate-900">
                  {scenario.label} Scenario
                </h4>

                <div className="mt-4 space-y-3">
                  <div>
                    <FieldLabel label="Benefit Factor" />
                    <TextInput
                      value={businessCase.scenarios[scenario.key].benefitFactor}
                      onChange={(e) =>
                        updateScenario(
                          scenario.key,
                          "benefitFactor",
                          e.target.value
                        )
                      }
                      placeholder="Example: 1.00"
                    />
                  </div>

                  <div>
                    <FieldLabel label="Cost Factor" />
                    <TextInput
                      value={businessCase.scenarios[scenario.key].costFactor}
                      onChange={(e) =>
                        updateScenario(
                          scenario.key,
                          "costFactor",
                          e.target.value
                        )
                      }
                      placeholder="Example: 1.00"
                    />
                  </div>

                  <div>
                    <FieldLabel label="Notes" />
                    <TextArea
                      value={businessCase.scenarios[scenario.key].notes}
                      onChange={(e) =>
                        updateScenario(scenario.key, "notes", e.target.value)
                      }
                      placeholder="Add scenario-specific notes."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Scenario Summary
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OutputSummaryCard
              title="Base Annual Labor Savings"
              value={formatCurrency(summary.baseValue.laborSavings)}
              accent="orange"
            />
            <OutputSummaryCard
              title="Role-Based Annual Labor Savings"
              value={formatCurrency(roleWeightedLabor.totalAnnualLaborSavings)}
              accent="orange"
            />
            <OutputSummaryCard
              title="Base Annual Value"
              value={formatCurrency(summary.baseValue.totalAnnualValue)}
              accent="orange"
            />
            <OutputSummaryCard
              title="Base Year 1 Cost"
              value={formatCurrency(summary.baseCost.yearOneCost)}
            />
            <OutputSummaryCard
              title="Recurring Annual Cost"
              value={formatCurrency(summary.baseCost.recurringAnnualCost)}
            />
            <OutputSummaryCard
              title="Contingency"
              value={formatCurrency(summary.baseCost.contingency)}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {summary.scenarios.map((scenario) => (
              <div
                key={scenario.key}
                className={[
                  "rounded-3xl border p-5",
                  scenario.key === "expected"
                    ? "border-orange-200 bg-orange-50"
                    : "border-sky-100 bg-sky-50/60",
                ].join(" ")}
              >
                <h4 className="text-base font-semibold text-slate-900">
                  {scenario.label}
                </h4>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>
                    Annual Benefit:{" "}
                    <span className="font-semibold">
                      {formatCurrency(scenario.annualBenefit)}
                    </span>
                  </p>

                  <p>
                    Year 1 Cost:{" "}
                    <span className="font-semibold">
                      {formatCurrency(scenario.yearOneCost)}
                    </span>
                  </p>

                  <p>
                    Year 1 Net Value:{" "}
                    <span className="font-semibold">
                      {formatCurrency(scenario.yearOneNetValue)}
                    </span>
                  </p>

                  <p>
                    Payback:{" "}
                    <span className="font-semibold">
                      {scenario.paybackYears === null
                        ? "N/A"
                        : `${formatNumber(scenario.paybackYears)} years`}
                    </span>
                  </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {scenario.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}