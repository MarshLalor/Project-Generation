function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function rowHasContent(row) {
  return Object.values(row || {}).some(
    (value) => value && String(value).trim()
  );
}

function summarizePlanStudio(planStudio) {
  if (!planStudio?.sections) return "No plan sections drafted yet.";

  const summary = [];

  Object.entries(planStudio.sections).forEach(([key, section]) => {
    if (section?.draftContent && String(section.draftContent).trim()) {
      summary.push(`${key.toUpperCase()}: ${section.draftContent}`);
    }
  });

  return summary.length ? summary.join("\n\n") : "No plan sections drafted yet.";
}

function formatLaborRates(roles = []) {
  const populated = roles.filter(rowHasContent);

  if (!populated.length) {
    return "No labor rate assumptions captured yet.";
  }

  return populated
    .map((row) => {
      return [
        `Role: ${safeText(row.role)}`,
        `Annual Salary: ${safeText(row.annualSalary)}`,
        `Hourly Rate: ${safeText(row.hourlyRate)}`,
        `Fully Loaded Rate: ${safeText(row.fullyLoadedRate)}`,
        `Source: ${safeText(row.source)}`,
        `Notes: ${safeText(row.notes)}`,
      ].join(" | ");
    })
    .join("\n");
}

function formatMetricRows(items = []) {
  const populated = items.filter(rowHasContent);

  if (!populated.length) {
    return "No assumptions captured yet.";
  }

  return populated
    .map((row) => {
      return [
        `Name: ${safeText(row.name)}`,
        `Value: ${safeText(row.value)}`,
        `Unit: ${safeText(row.unit)}`,
        `Source: ${safeText(row.source)}`,
        `Notes: ${safeText(row.notes)}`,
      ].join(" | ");
    })
    .join("\n");
}

function formatBenchmarkRows(items = []) {
  const populated = items.filter(rowHasContent);

  if (!populated.length) {
    return "No benchmark assumptions captured yet.";
  }

  return populated
    .map((row) => {
      return [
        `Category: ${safeText(row.category)}`,
        `Source: ${safeText(row.source)}`,
        `Assumption: ${safeText(row.assumption)}`,
        `Notes: ${safeText(row.notes)}`,
      ].join(" | ");
    })
    .join("\n");
}

function buildAssumptionsContext(projectData) {
  const assumptions = projectData?.assumptions || {};
  const calculation = assumptions?.calculationAssumptions || {};

  return [
    "ASSUMPTIONS REGISTER CONTEXT",
    "",
    "Labor Rate Assumptions:",
    formatLaborRates(assumptions?.laborRates?.roles || []),
    "",
    "Labor Rate Notes:",
    safeText(assumptions?.laborRates?.notes),
    "",
    "Effort Assumptions:",
    formatMetricRows(assumptions?.effortAssumptions?.items || []),
    "",
    "Effort Notes:",
    safeText(assumptions?.effortAssumptions?.notes),
    "",
    "Volume Assumptions:",
    formatMetricRows(assumptions?.volumeAssumptions?.items || []),
    "",
    "Volume Notes:",
    safeText(assumptions?.volumeAssumptions?.notes),
    "",
    "Benchmark Assumptions:",
    formatBenchmarkRows(assumptions?.benchmarkAssumptions?.items || []),
    "",
    "Benchmark Notes:",
    safeText(assumptions?.benchmarkAssumptions?.notes),
    "",
    "Calculation Settings:",
    `Burden Factor: ${safeText(calculation.burdenFactor)}`,
    `Confidence Level: ${safeText(calculation.confidenceLevel)}`,
    `Calculation Notes: ${safeText(calculation.notes)}`,
    "",
    "Open Questions from Assumptions Register:",
    safeText(assumptions?.openQuestions),
  ].join("\n");
}

function buildSharedProjectContext(projectData) {
  const basics = projectData?.projectBasics || {};
  const charter = projectData?.charter || {};
  const ideation = projectData?.ideation?.parsedSections || {};

  return [
    `Project Title: ${safeText(basics.title)}`,
    `Business Problem / Opportunity: ${safeText(basics.businessProblem)}`,
    `Project Objective: ${safeText(basics.projectObjective)}`,
    `Expected Business Outcome: ${safeText(basics.expectedBusinessOutcome)}`,
    `Delivery Approach: ${safeText(basics.deliveryApproach, "hybrid")}`,
    `Project Sponsor: ${safeText(basics.sponsor)}`,
    `Business Owner: ${safeText(basics.businessOwner)}`,
    `Project Manager: ${safeText(basics.projectManager)}`,
    `Department / Business Unit: ${safeText(basics.department)}`,
    `Target Timeline: ${safeText(basics.targetTimeline)}`,
    `Estimated Budget Range: ${safeText(basics.estimatedBudgetRange)}`,
    `In Scope: ${safeText(basics.scopeIn)}`,
    `Out of Scope: ${safeText(basics.scopeOut)}`,
    `Key Stakeholders: ${safeText(basics.keyStakeholders)}`,
    `Success Criteria: ${safeText(basics.successCriteria)}`,
    `Key Assumptions: ${safeText(basics.keyAssumptions)}`,
    `Key Constraints: ${safeText(basics.keyConstraints)}`,
    `Risks / Dependencies: ${safeText(basics.risksDependencies)}`,
    `Initial Value Hypothesis: ${safeText(basics.initialValueHypothesis)}`,
    "",
    "Ideation context if available:",
    `Problem Statement: ${safeText(ideation.problemStatement)}`,
    `Desired Outcomes: ${safeText(ideation.desiredOutcomes)}`,
    `Value Drivers: ${safeText(ideation.valueDrivers)}`,
    "",
    "Current Charter Context:",
    safeText(charter.charterText),
    "",
    "Current Plan Studio Drafts:",
    summarizePlanStudio(projectData?.planStudio),
    "",
    buildAssumptionsContext(projectData),
  ].join("\n");
}

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/[#*:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStructuredResponse(responseText, aliases) {
  const result = Object.keys(aliases).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  if (!responseText || !responseText.trim()) {
    return result;
  }

  const findKey = (line) => {
    const normalized = normalizeHeading(line);

    for (const [key, options] of Object.entries(aliases)) {
      for (const option of options) {
        if (normalized === normalizeHeading(option)) {
          return key;
        }
      }
    }

    return null;
  };

  const buffers = {};
  let currentKey = null;

  responseText.split("\n").forEach((rawLine) => {
    const trimmed = rawLine.trim();
    const matched = findKey(trimmed);

    if (matched) {
      currentKey = matched;
      if (!buffers[currentKey]) buffers[currentKey] = [];
      return;
    }

    if (currentKey) {
      buffers[currentKey].push(rawLine);
    }
  });

  Object.keys(result).forEach((key) => {
    result[key] = (buffers[key] || []).join("\n").trim();
  });

  return result;
}

export function buildValueEstimatePrompt(projectData) {
  const value = projectData?.valueEstimate || {};

  return `You are an expert business case and value estimation assistant with strong experience in project benefit modeling, business transformation, labor savings logic, cost avoidance logic, high-level estimation, and assumptions-driven value modeling.

Your task is to help create a high-level business value estimate for this project using the available project context and assumptions register.

Guiding principles:
1. Use the project charter, planning context, and assumptions register as the source of truth.
2. Focus on measurable outcomes and realistic benefit mechanisms.
3. Clearly separate confirmed inputs, assumptions, missing inputs, and suggested estimation methods.
4. If key data is missing, ask focused step-by-step follow-up questions.
5. When exact values are unavailable, suggest a range-based high-level estimate approach instead of false precision.
6. If salary, labor rate, effort, volume, or benchmark data is available in the assumptions register, use it explicitly.
7. If values are missing from the assumptions register, recommend what should be captured there.

Project and assumptions context:
${buildSharedProjectContext(projectData)}

Existing value estimate content:
Likely Value Drivers: ${safeText(value.likelyValueDrivers)}
Known Inputs: ${safeText(value.knownInputs)}
Missing Inputs: ${safeText(value.missingInputs)}
Follow-Up Questions: ${safeText(value.followUpQuestions)}
Suggested Estimation Methods: ${safeText(value.estimationMethods)}
Preliminary Value Model: ${safeText(value.preliminaryValueModel)}
Confidence / Assumption Notes: ${safeText(value.confidenceNotes)}

Please return the response in the exact structure below:

A. Likely Value Drivers
B. Known Inputs
C. Missing Inputs
D. Step-by-Step Follow-Up Questions
E. Suggested Estimation Methods
F. Preliminary High-Level Value Model
G. Confidence / Assumption Notes

Additional instructions:
- Consider labor savings, error reduction, rework reduction, cycle-time reduction, capacity creation, risk reduction, and revenue-related effects where appropriate.
- Tie the estimate back to the user's expected business outcome.
- Use labor rates, effort assumptions, volume assumptions, benchmark assumptions, burden factor, and confidence level where available.
- If useful, recommend low / expected / high ranges.
- Keep the output practical and business-friendly.`;
}

export function buildCostEstimatePrompt(projectData) {
  const cost = projectData?.costEstimate || {};

  return `You are an expert business case and project cost estimation assistant with strong experience in implementation costing, internal labor estimation, recurring operating cost logic, assumptions-driven costing, and rough investment modeling.

Your task is to help create a high-level cost estimate for this project using the available project context and assumptions register.

Guiding principles:
1. Use the project charter, planning context, and assumptions register as the source of truth.
2. Distinguish one-time costs from recurring costs.
3. Clearly separate confirmed inputs, assumptions, missing inputs, and suggested estimation methods.
4. If cost data is missing, ask focused step-by-step follow-up questions.
5. If labor rates, salary data, effort estimates, or benchmark assumptions are available in the assumptions register, use them explicitly.
6. If needed inputs are missing from the assumptions register, recommend what needs to be captured there.
7. Avoid false precision. Use ranges where needed.

Project and assumptions context:
${buildSharedProjectContext(projectData)}

Existing cost estimate content:
Cost Categories: ${safeText(cost.costCategories)}
Known Inputs: ${safeText(cost.knownInputs)}
Missing Inputs: ${safeText(cost.missingInputs)}
Follow-Up Questions: ${safeText(cost.followUpQuestions)}
Recommended Estimation Methods: ${safeText(cost.estimationMethods)}
Preliminary Cost Estimate Summary: ${safeText(cost.preliminaryCostSummary)}
Assumptions and Confidence Notes: ${safeText(cost.assumptionsConfidenceNotes)}

Please return the response in the exact structure below:

A. Cost Categories
B. Known Inputs
C. Missing Inputs
D. Step-by-Step Questions
E. Recommended Estimation Methods
F. Preliminary Cost Estimate Summary
G. Assumptions and Confidence Notes

Additional instructions:
- Consider software/license costs, implementation costs, internal labor, training, process redesign, integration, support, maintenance, and contingency where relevant.
- Consider how the delivery approach may affect cost shape and timing.
- Use the burden factor and fully loaded rates from the assumptions register where available.
- Recommend low / expected / high range logic where useful.
- Keep the output practical and ready for later refinement.`;
}

const valueAliases = {
  likelyValueDrivers: [
    "A. Likely Value Drivers",
    "Likely Value Drivers",
    "## Likely Value Drivers",
  ],
  knownInputs: ["B. Known Inputs", "Known Inputs", "## Known Inputs"],
  missingInputs: ["C. Missing Inputs", "Missing Inputs", "## Missing Inputs"],
  followUpQuestions: [
    "D. Step-by-Step Follow-Up Questions",
    "Step-by-Step Follow-Up Questions",
    "Follow-Up Questions",
    "Questions",
    "## Step-by-Step Follow-Up Questions",
  ],
  estimationMethods: [
    "E. Suggested Estimation Methods",
    "Suggested Estimation Methods",
    "Estimation Methods",
    "## Suggested Estimation Methods",
  ],
  preliminaryValueModel: [
    "F. Preliminary High-Level Value Model",
    "Preliminary High-Level Value Model",
    "Preliminary Value Model",
    "## Preliminary High-Level Value Model",
  ],
  confidenceNotes: [
    "G. Confidence / Assumption Notes",
    "Confidence / Assumption Notes",
    "Confidence Notes",
    "## Confidence / Assumption Notes",
  ],
};

const costAliases = {
  costCategories: [
    "A. Cost Categories",
    "Cost Categories",
    "## Cost Categories",
  ],
  knownInputs: ["B. Known Inputs", "Known Inputs", "## Known Inputs"],
  missingInputs: ["C. Missing Inputs", "Missing Inputs", "## Missing Inputs"],
  followUpQuestions: [
    "D. Step-by-Step Questions",
    "Step-by-Step Questions",
    "Questions",
    "## Step-by-Step Questions",
  ],
  estimationMethods: [
    "E. Recommended Estimation Methods",
    "Recommended Estimation Methods",
    "Estimation Methods",
    "## Recommended Estimation Methods",
  ],
  preliminaryCostSummary: [
    "F. Preliminary Cost Estimate Summary",
    "Preliminary Cost Estimate Summary",
    "Cost Estimate Summary",
    "## Preliminary Cost Estimate Summary",
  ],
  assumptionsConfidenceNotes: [
    "G. Assumptions and Confidence Notes",
    "Assumptions and Confidence Notes",
    "Confidence Notes",
    "## Assumptions and Confidence Notes",
  ],
};

export function parseValueEstimateResponse(responseText) {
  return parseStructuredResponse(responseText, valueAliases);
}

export function parseCostEstimateResponse(responseText) {
  return parseStructuredResponse(responseText, costAliases);
}

export function getValueEstimateProgress(valueEstimate) {
  const fields = [
    valueEstimate?.likelyValueDrivers,
    valueEstimate?.knownInputs,
    valueEstimate?.missingInputs,
    valueEstimate?.followUpQuestions,
    valueEstimate?.estimationMethods,
    valueEstimate?.preliminaryValueModel,
    valueEstimate?.confidenceNotes,
  ];

  const completed = fields.filter(
    (field) => field && String(field).trim()
  ).length;
  const total = fields.length;
  const percent = Math.round((completed / total) * 100);

  return { completed, total, percent };
}

export function getCostEstimateProgress(costEstimate) {
  const fields = [
    costEstimate?.costCategories,
    costEstimate?.knownInputs,
    costEstimate?.missingInputs,
    costEstimate?.followUpQuestions,
    costEstimate?.estimationMethods,
    costEstimate?.preliminaryCostSummary,
    costEstimate?.assumptionsConfidenceNotes,
  ];

  const completed = fields.filter(
    (field) => field && String(field).trim()
  ).length;
  const total = fields.length;
  const percent = Math.round((completed / total) * 100);

  return { completed, total, percent };
}

export function getAssumptionsPreview(projectData) {
  const assumptions = projectData?.assumptions || {};
  const calculation = assumptions?.calculationAssumptions || {};

  return {
    laborRates: formatLaborRates(assumptions?.laborRates?.roles || []),
    effortAssumptions: formatMetricRows(
      assumptions?.effortAssumptions?.items || []
    ),
    volumeAssumptions: formatMetricRows(
      assumptions?.volumeAssumptions?.items || []
    ),
    benchmarkAssumptions: formatBenchmarkRows(
      assumptions?.benchmarkAssumptions?.items || []
    ),
    burdenFactor: calculation.burdenFactor || "",
    confidenceLevel: calculation.confidenceLevel || "",
    openQuestions: assumptions?.openQuestions || "",
  };
}