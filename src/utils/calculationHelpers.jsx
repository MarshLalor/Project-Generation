export function toNumber(value) {
  if (value === null || value === undefined) return: "",  if (value === null || value === undefined) return 0;
      weightedHourlyRate: "",
      reworkSavings: "",
      cycleTimeSavings: "",
      revenueUplift: "",
      riskAvoidance: "",
      capacityValue: "",
      notes: "",
    },
    costInputs: {
      softwareCost: "",
      implementationCost: "",
      internalLaborCost: "",
      trainingCost: "",
      integrationCost: "",
      supportCost: "",
      recurringSoftwareCost: "",
      recurringSupportCost: "",
      contingencyPercent: "",
      notes: "",
    },
    scenarios: {
      low: {
        label: "Low",
        benefitFactor: "0.70",
        costFactor: "1.15",
        notes: "Conservative benefits with higher delivery/cost uncertainty.",
      },
      expected: {
        label: "Expected",
        benefitFactor: "1.00",
        costFactor: "1.00",
        notes: "Most likely planning case based on current assumptions.",
      },
      high: {
        label: "High",
        benefitFactor: "1.30",
        costFactor: "0.90",
        notes: "Optimistic benefits with stronger adoption and execution.",
      },
    },
  };
}

export function ensureBusinessCaseState(businessCase) {
  const defaults = createDefaultBusinessCaseState();

  return {
    valueInputs: {
      ...defaults.valueInputs,
      ...(businessCase?.valueInputs || {}),
    },
    costInputs: {
      ...defaults.costInputs,
      ...(businessCase?.costInputs || {}),
    },
    scenarios: {
      low: {
        ...defaults.scenarios.low,
        ...(businessCase?.scenarios?.low || {}),
      },
      expected: {
        ...defaults.scenarios.expected,
        ...(businessCase?.scenarios?.expected || {}),
      },
      high: {
        ...defaults.scenarios.high,
        ...(businessCase?.scenarios?.high || {}),
      },
    },
  };
}

export function calculateBaseValue(valueInputs = {}) {
  const laborSavings =
    toNumber(valueInputs.annualSavedHours) *
    toNumber(valueInputs.weightedHourlyRate);

  const additionalValue =
    toNumber(valueInputs.reworkSavings) +
    toNumber(valueInputs.cycleTimeSavings) +
    toNumber(valueInputs.revenueUplift) +
    toNumber(valueInputs.riskAvoidance) +
    toNumber(valueInputs.capacityValue);

  return {
    laborSavings,
    additionalValue,
    totalAnnualValue: laborSavings + additionalValue,
  };
}

export function calculateBaseCost(costInputs = {}) {
  const oneTimeSubtotal =
    toNumber(costInputs.softwareCost) +
    toNumber(costInputs.implementationCost) +
    toNumber(costInputs.internalLaborCost) +
    toNumber(costInputs.trainingCost) +
    toNumber(costInputs.integrationCost) +
    toNumber(costInputs.supportCost);

  const contingency =
    oneTimeSubtotal * (toNumber(costInputs.contingencyPercent) / 100);

  const yearOneCost = oneTimeSubtotal + contingency;

  const recurringAnnualCost =
    toNumber(costInputs.recurringSoftwareCost) +
    toNumber(costInputs.recurringSupportCost);

  return {
    oneTimeSubtotal,
    contingency,
    yearOneCost,
    recurringAnnualCost,
  };
}

export function calculateScenarioSummary(businessCase) {
  const normalized = ensureBusinessCaseState(businessCase);

  const baseValue = calculateBaseValue(normalized.valueInputs);
  const baseCost = calculateBaseCost(normalized.costInputs);

  const scenarioOrder = ["low", "expected", "high"];

  const scenarios = scenarioOrder.map((scenarioKey) => {
    const scenario = normalized.scenarios[scenarioKey];

    const benefitFactor = toNumber(scenario.benefitFactor) || 0;
    const costFactor = toNumber(scenario.costFactor) || 0;

    const annualBenefit = baseValue.totalAnnualValue * benefitFactor;
    const yearOneCost = baseCost.yearOneCost * costFactor;
    const recurringAnnualCost = baseCost.recurringAnnualCost * costFactor;
    const yearOneNetValue = annualBenefit - yearOneCost;

    const paybackYears =
      annualBenefit > 0 ? yearOneCost / annualBenefit : null;

    return {
      key: scenarioKey,
      label: scenario.label,
      benefitFactor,
      costFactor,
      annualBenefit,
      yearOneCost,
      recurringAnnualCost,
      yearOneNetValue,
      paybackYears,
      notes: scenario.notes,
    };
  });

  return {
    baseValue,
    baseCost,
    scenarios,
  };
}

  const cleaned = String(value)
    .replace(/[$,%]/g, "")
    .replace(/,/g, "")
    .trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatNumber(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(number);
}

export function createDefaultBusinessCaseState() {
  return {
    valueInputs: {
