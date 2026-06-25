import React, { useMemo } from "react";
import SectionCard from "../common/SectionCard";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  calculateScenarioSummary,
  ensureBusinessCaseState,
  formatCurrency,
  formatNumber,
} from "../../utils/calculationHelpers";

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
        value,
      },
    }));
  };

  const updateCostInput = (field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      costInputs: {
        ...prev.costInputs,
        value,
      },
    }));
  };

  const updateScenario = (scenarioKey, field, value) => {
    updateBusinessCase((prev) => ({
      ...prev,
      scenarios: {
        ...prev.scenarios,
        {
          ...prev.scenarios[scenarioKey],
          value,
        },
      },
    }));
  };

  return (
    <SectionCard
      title="Scenario Calculator"
      subtitle="Use lightweight inputs to create low, expected, and high business case scenarios. This is an early estimate, not a final financial model."
    >
      <div className="space-y-8">
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
            </div>

            <div>
              <FieldLabel label="Rework Savings" />
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
                rows={3}
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
                rows={3}
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