function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
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
    "Ideation context (if available):",
    `Problem Statement: ${safeText(ideation.problemStatement)}`,
    `Desired Outcomes: ${safeText(ideation.desiredOutcomes)}`,
    `Value Drivers: ${safeText(ideation.valueDrivers)}`,
    "",
    "Current Charter Context:",
    safeText(charter.charterText),
    "",
    "Current Plan Studio Drafts:",
    summarizePlanStudio(projectData?.planStudio),
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

  return `You are an expert business case and value estimation assistant with strong experience in project benefit modeling, business transformation, labor savings logic, cost avoidance logic, and high-level estimation.

Your task is to help create a high-level business value estimate for this project.

Guiding principles:
1. Use the project charter and project planning context as the minimum source of truth.
2. Focus on measurable outcomes and realistic benefit mechanisms.
3. Clearly separate confirmed inputs, assumptions, missing inputs, and suggested estimation methods.
4. If key data is missing, ask focused step-by-step follow-up questions.
5. When exact values are unavailable, suggest a range-based high-level estimate approach instead of false precision.
6. If salary, labor rate, or effort data is missing, recommend asking for internal data first, then offer industry averages or benchmark-based assumptions.

Project context:
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
- If useful, recommend how to calculate fully loaded labor costs or benchmark assumptions.
- Keep the output practical and business-friendly.`;
}

export function buildCostEstimatePrompt(projectData) {
  const cost = projectData?.costEstimate || {};

  return `You are an expert business case and project cost estimation assistant with strong experience in implementation costing, internal labor estimation, recurring operating cost logic, and rough investment modeling.

Your task is to help create a high-level cost estimate for this project.

Guiding principles:
1. Use the project charter and planning context as the source of truth.
2. Distinguish one-time costs from recurring costs.
3. Clearly separate confirmed inputs, assumptions, missing inputs, and suggested estimation methods.
4. If cost data is missing, ask focused step-by-step follow-up questions.
5. If labor rates or salary data are missing, recommend asking for internal rates first, then offer industry averages or benchmark assumptions.
6. Avoid false precision. Use ranges where needed.

Project context:
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
- Consider software/license costs, implementation costs, internal labor, training, process redesign, integration, support, and contingency where relevant.
- Consider how the delivery approach (Waterfall / Agile / Hybrid) may affect cost shape and timing.
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
