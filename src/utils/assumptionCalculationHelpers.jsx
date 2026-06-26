function toNumber(value) {
  if (value === null || value === undefined) return 0;

  const cleaned = String(value)
    .replace(/[$,%]/g, "")
    .replace(/,/g, "")
    .trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
}

function hasText(value) {
  return !!(value && String(value).trim());
}

function rowHasContent(row) {
  return Object.values(row || {}).some((value) => hasText(value));
}

function getBurdenFactor(assumptions) {
  const raw = assumptions?.calculationAssumptions?.burdenFactor;
  const parsed = toNumber(raw);

  return parsed > 0 ? parsed : 1;
}

function getBestHourlyRate(row, burdenFactor) {
  const fullyLoadedRate = toNumber(row?.fullyLoadedRate);
  const hourlyRate = toNumber(row?.hourlyRate);
  const annualSalary = toNumber(row?.annualSalary);

  if (fullyLoadedRate > 0) return fullyLoadedRate;
  if (hourlyRate > 0) return hourlyRate * burdenFactor;
  if (annualSalary > 0) return (annualSalary / 2080) * burdenFactor;

  return 0;
}

function deriveAverageLaborRate(assumptions) {
  const roles = assumptions?.laborRates?.roles || [];
  const burdenFactor = getBurdenFactor(assumptions);

  const rates = roles
    .filter(rowHasContent)
    .map((row) => getBestHourlyRate(row, burdenFactor))
    .filter((rate) => rate > 0);

  if (!rates.length) {
    return {
      weightedHourlyRate: "",
      laborRateNotes:
        "No usable labor rates were found. Add hourly, fully loaded, or annual salary assumptions.",
    };
  }

  const averageRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

  return {
    weightedHourlyRate: String(Math.round(averageRate)),
    laborRateNotes: `Derived blended hourly rate from ${rates.length} labor rate row(s). Burden factor used where needed: ${burdenFactor}.`,
  };
}

function estimateAnnualHoursFromMetric(row) {
  const name = String(row?.name || "").toLowerCase();
  const unit = String(row?.unit || "").toLowerCase();
  const value = toNumber(row?.value);

  if (value <= 0) return 0;

  const combined = `${name} ${unit}`;

  const isHours =
    combined.includes("hour") ||
    combined.includes("hr") ||
    combined.includes("time");

  if (!isHours) return 0;

  if (combined.includes("per week") || combined.includes("/week")) {
    return value * 52;
  }

  if (combined.includes("weekly")) {
    return value * 52;
  }

  if (combined.includes("per month") || combined.includes("/month")) {
    return value * 12;
  }

  if (combined.includes("monthly")) {
    return value * 12;
  }

  if (combined.includes("per day") || combined.includes("/day")) {
    return value * 260;
  }

  if (combined.includes("daily")) {
    return value * 260;
  }

  if (combined.includes("per year") || combined.includes("/year")) {
    return value;
  }

  if (combined.includes("annual") || combined.includes("yearly")) {
    return value;
  }

  return value;
}

function isSavingsEffortRow(row) {
  const name = String(row?.name || "").toLowerCase();
  const notes = String(row?.notes || "").toLowerCase();
  const combined = `${name} ${notes}`;

  return (
    combined.includes("save") ||
    combined.includes("saved") ||
    combined.includes("reduction") ||
    combined.includes("reduce") ||
    combined.includes("automation") ||
    combined.includes("manual qa") ||
    combined.includes("review time")
  );
}

function isImplementationEffortRow(row) {
  const name = String(row?.name || "").toLowerCase();
  const notes = String(row?.notes || "").toLowerCase();
  const combined = `${name} ${notes}`;

  return (
    combined.includes("implementation") ||
    combined.includes("build") ||
    combined.includes("configuration") ||
    combined.includes("setup") ||
    combined.includes("integration") ||
    combined.includes("training") ||
    combined.includes("testing") ||
    combined.includes("deployment")
  );
}

function deriveAnnualSavedHours(assumptions) {
  const effortRows = assumptions?.effortAssumptions?.items || [];

  const relevantRows = effortRows.filter((row) => {
    return rowHasContent(row) && isSavingsEffortRow(row);
  });

  const totalAnnualHours = relevantRows.reduce((sum, row) => {
    return sum + estimateAnnualHoursFromMetric(row);
  }, 0);

  if (totalAnnualHours <= 0) {
    return {
      annualSavedHours: "",
      savedHoursNotes:
        "No savings-related effort assumptions were found. Add effort assumptions such as 'Manual QA hours saved per week'.",
    };
  }

  return {
    annualSavedHours: String(Math.round(totalAnnualHours)),
    savedHoursNotes: `Derived annual saved hours from ${relevantRows.length} savings-related effort assumption row(s).`,
  };
}

function deriveInternalLaborCost(assumptions, weightedHourlyRate) {
  const effortRows = assumptions?.effortAssumptions?.items || [];
  const rate = toNumber(weightedHourlyRate);

  if (rate <= 0) {
    return {
      internalLaborCost: "",
      internalLaborCostNotes:
        "Internal labor cost was not derived because no usable hourly rate was available.",
    };
  }

  const relevantRows = effortRows.filter((row) => {
    return rowHasContent(row) && isImplementationEffortRow(row);
  });

  const totalHours = relevantRows.reduce((sum, row) => {
    return sum + estimateAnnualHoursFromMetric(row);
  }, 0);

  if (totalHours <= 0) {
    return {
      internalLaborCost: "",
      internalLaborCostNotes:
        "No implementation-related effort assumptions were found for internal labor cost.",
    };
  }

  const estimatedCost = totalHours * rate;

  return {
    internalLaborCost: String(Math.round(estimatedCost)),
    internalLaborCostNotes: `Derived internal labor cost from ${Math.round(
      totalHours
    )} implementation-related hour(s) using a blended hourly rate of ${Math.round(
      rate
    )}.`,
  };
}

function buildAssumptionNotes({
  laborRateNotes,
  savedHoursNotes,
  internalLaborCostNotes,
  assumptions,
}) {
  const confidenceLevel =
    assumptions?.calculationAssumptions?.confidenceLevel || "Not provided";

  const openQuestions = assumptions?.openQuestions || "";

  return [
    "Assumption Auto-Population Notes:",
    `- ${laborRateNotes}`,
    `- ${savedHoursNotes}`,
    `- ${internalLaborCostNotes}`,
    `- Confidence level: ${confidenceLevel}`,
    openQuestions
      ? `- Open questions from assumptions register: ${openQuestions}`
      : "- No open questions captured in the assumptions register.",
  ].join("\n");
}

export function buildCalculatorSuggestionFromAssumptions(projectData) {
  const assumptions = projectData?.assumptions || {};

  const laborRateResult = deriveAverageLaborRate(assumptions);
  const savedHoursResult = deriveAnnualSavedHours(assumptions);

  const internalLaborResult = deriveInternalLaborCost(
    assumptions,
    laborRateResult.weightedHourlyRate
  );

  const notes = buildAssumptionNotes({
    laborRateNotes: laborRateResult.laborRateNotes,
    savedHoursNotes: savedHoursResult.savedHoursNotes,
    internalLaborCostNotes: internalLaborResult.internalLaborCostNotes,
    assumptions,
  });

  return {
    annualSavedHours: savedHoursResult.annualSavedHours,
    weightedHourlyRate: laborRateResult.weightedHourlyRate,
    internalLaborCost: internalLaborResult.internalLaborCost,
    valueNotes: notes,
    costNotes: notes,
    hasAnySuggestion:
      hasText(savedHoursResult.annualSavedHours) ||
      hasText(laborRateResult.weightedHourlyRate) ||
      hasText(internalLaborResult.internalLaborCost),
  };
}