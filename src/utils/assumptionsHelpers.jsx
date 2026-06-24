function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

export function createEmptyLaborRate() {
  return {
    id: crypto.randomUUID(),
    role: "",
    annualSalary: "",
    hourlyRate: "",
    fullyLoadedRate: "",
    source: "",
    notes: "",
  };
}

export function createEmptyMetricAssumption() {
  return {
    id: crypto.randomUUID(),
    name: "",
    value: "",
    unit: "",
    source: "",
    notes: "",
  };
}

export function createEmptyBenchmarkAssumption() {
  return {
    id: crypto.randomUUID(),
    category: "",
    source: "",
    assumption: "",
    notes: "",
  };
}

export function createDefaultAssumptionsState() {
  return {
    laborRates: {
      notes: "",
      roles: [createEmptyLaborRate()],
    },
    effortAssumptions: {
      notes: "",
      items: [createEmptyMetricAssumption()],
    },
    volumeAssumptions: {
      notes: "",
      items: [createEmptyMetricAssumption()],
    },
    benchmarkAssumptions: {
      notes: "",
      items: [createEmptyBenchmarkAssumption()],
    },
    calculationAssumptions: {
      burdenFactor: "",
      confidenceLevel: "",
      notes: "",
    },
    openQuestions: "",
    benchmarkPrompt: "",
    aiNotes: "",
  };
}

export function ensureAssumptionsState(assumptions) {
  const defaults = createDefaultAssumptionsState();

  return {
    laborRates: {
      notes: assumptions?.laborRates?.notes || "",
      roles:
        assumptions?.laborRates?.roles?.length > 0
          ? assumptions.laborRates.roles
          : defaults.laborRates.roles,
    },
    effortAssumptions: {
      notes: assumptions?.effortAssumptions?.notes || "",
      items:
        assumptions?.effortAssumptions?.items?.length > 0
          ? assumptions.effortAssumptions.items
          : defaults.effortAssumptions.items,
    },
    volumeAssumptions: {
      notes: assumptions?.volumeAssumptions?.notes || "",
      items:
        assumptions?.volumeAssumptions?.items?.length > 0
          ? assumptions.volumeAssumptions.items
          : defaults.volumeAssumptions.items,
    },
    benchmarkAssumptions: {
      notes: assumptions?.benchmarkAssumptions?.notes || "",
      items:
        assumptions?.benchmarkAssumptions?.items?.length > 0
          ? assumptions.benchmarkAssumptions.items
          : defaults.benchmarkAssumptions.items,
    },
    calculationAssumptions: {
      burdenFactor: assumptions?.calculationAssumptions?.burdenFactor || "",
      confidenceLevel:
        assumptions?.calculationAssumptions?.confidenceLevel || "",
      notes: assumptions?.calculationAssumptions?.notes || "",
    },
    openQuestions: assumptions?.openQuestions || "",
    benchmarkPrompt: assumptions?.benchmarkPrompt || "",
    aiNotes: assumptions?.aiNotes || "",
  };
}

function formatRows(rows = [], formatter) {
  const meaningful = rows.filter((row) =>
    Object.values(row).some((value) => value && String(value).trim())
  );

  if (!meaningful.length) {
    return "• Not yet provided";
  }

  return meaningful.map(formatter).join("\n");
}

export function buildAssumptionsPrompt(projectData) {
  const basics = projectData?.projectBasics || {};
  const charter = projectData?.charter || {};
  const valueEstimate = projectData?.valueEstimate || {};
  const costEstimate = projectData?.costEstimate || {};
  const assumptions = ensureAssumptionsState(projectData?.assumptions);

  const laborSnapshot = formatRows(assumptions.laborRates.roles, (row) => {
    return `• Role: ${safeText(row.role)} | Annual Salary: ${safeText(
      row.annualSalary
    )} | Hourly Rate: ${safeText(row.hourlyRate)} | Fully Loaded Rate: ${safeText(
      row.fullyLoadedRate
    )} | Source: ${safeText(row.source)}`;
  });

  const effortSnapshot = formatRows(
    assumptions.effortAssumptions.items,
    (row) => {
      return `• ${safeText(row.name)} = ${safeText(row.value)} ${safeText(
        row.unit
      )} | Source: ${safeText(row.source)} | Notes: ${safeText(row.notes)}`;
    }
  );

  const volumeSnapshot = formatRows(
    assumptions.volumeAssumptions.items,
    (row) => {
      return `• ${safeText(row.name)} = ${safeText(row.value)} ${safeText(
        row.unit
      )} | Source: ${safeText(row.source)} | Notes: ${safeText(row.notes)}`;
    }
  );

  const benchmarkSnapshot = formatRows(
    assumptions.benchmarkAssumptions.items,
    (row) => {
      return `• Category: ${safeText(row.category)} | Source: ${safeText(
        row.source
      )} | Assumption: ${safeText(row.assumption)} | Notes: ${safeText(
        row.notes
      )}`;
    }
  );

  return `You are an expert project business case and estimation assistant with strong experience in planning assumptions, labor cost benchmarking, effort assumptions, volume assumptions, and high-level project case development.

Your task is to help strengthen the assumptions register for this project.

Guiding principles:
1. Use the project basics, charter, value estimate, and cost estimate context as the source of truth.
2. Identify practical assumptions that improve planning quality and later calculations.
3. Clearly separate likely assumptions from confirmed inputs.
4. If data is missing, recommend what should be asked for internally first and what could be benchmarked externally if needed.
5. Keep the output practical and reusable in an assumptions register.

Project context:
Project Title: ${safeText(basics.title)}
Business Problem / Opportunity: ${safeText(basics.businessProblem)}
Project Objective: ${safeText(basics.projectObjective)}
Expected Business Outcome: ${safeText(basics.expectedBusinessOutcome)}
Delivery Approach: ${safeText(basics.deliveryApproach, "hybrid")}
Target Timeline: ${safeText(basics.targetTimeline)}
Estimated Budget Range: ${safeText(basics.estimatedBudgetRange)}
Initial Value Hypothesis: ${safeText(basics.initialValueHypothesis)}

Current Charter Context:
${safeText(charter.charterText)}

Current Value Estimate Context:
Likely Value Drivers: ${safeText(valueEstimate.likelyValueDrivers)}
Known Inputs: ${safeText(valueEstimate.knownInputs)}
Missing Inputs: ${safeText(valueEstimate.missingInputs)}

Current Cost Estimate Context:
Cost Categories: ${safeText(costEstimate.costCategories)}
Known Inputs: ${safeText(costEstimate.knownInputs)}
Missing Inputs: ${safeText(costEstimate.missingInputs)}

Existing Assumptions Register Snapshot:
Labor Rates:
${laborSnapshot}

Effort Assumptions:
${effortSnapshot}

Volume Assumptions:
${volumeSnapshot}

Benchmark Assumptions:
${benchmarkSnapshot}

Calculation Settings:
Burden Factor: ${safeText(assumptions.calculationAssumptions.burdenFactor)}
Confidence Level: ${safeText(assumptions.calculationAssumptions.confidenceLevel)}
Calculation Notes: ${safeText(assumptions.calculationAssumptions.notes)}

Open Questions:
${safeText(assumptions.openQuestions)}

Please return the response in the exact structure below:

A. Recommended Labor Rate Assumptions
B. Recommended Effort Assumptions
C. Recommended Volume Assumptions
D. Recommended Benchmark Assumptions
E. Suggested Calculation Settings
F. Open Questions to Resolve

Additional instructions:
- If the project could benefit from industry salary or hourly benchmark assumptions, say so explicitly.
- If the assumptions should differ by scenario (low / expected / high), note that.
- Keep the response concise and practical enough to manually capture in the tool.`;
}

export function summarizeAssumptions(assumptions) {
  const normalized = ensureAssumptionsState(assumptions);

  const laborCount = normalized.laborRates.roles.filter((row) =>
    Object.values(row).some((value) => value && String(value).trim())
  ).length;

  const effortCount = normalized.effortAssumptions.items.filter((row) =>
    Object.values(row).some((value) => value && String(value).trim())
  ).length;

  const volumeCount = normalized.volumeAssumptions.items.filter((row) =>
    Object.values(row).some((value) => value && String(value).trim())
  ).length;

  const benchmarkCount = normalized.benchmarkAssumptions.items.filter((row) =>
    Object.values(row).some((value) => value && String(value).trim())
  ).length;

  return {
    laborCount,
    effortCount,
    volumeCount,
    benchmarkCount,
    burdenFactor: normalized.calculationAssumptions.burdenFactor,
    confidenceLevel: normalized.calculationAssumptions.confidenceLevel,
    openQuestions: normalized.openQuestions,
  };
}