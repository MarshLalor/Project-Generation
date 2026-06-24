export const ideaTypeOptions = [
  "Process Improvement",
  "Automation",
  "Technology Implementation",
  "Cost Reduction",
  "Revenue Growth",
  "Quality Improvement",
  "Compliance / Risk",
  "Customer Experience",
  "Operational Efficiency",
];

export const ideationSectionOrder = [
  {
    key: "problemStatement",
    label: "Problem Statement",
    aliases: [
      "A. Problem Statement",
      "Problem Statement",
      "## Problem Statement",
    ],
  },
  {
    key: "projectObjective",
    label: "Project Objective",
    aliases: [
      "B. Project Objective",
      "Project Objective",
      "## Project Objective",
    ],
  },
  {
    key: "desiredOutcomes",
    label: "Desired Outcomes",
    aliases: ["C. Desired Outcomes", "Desired Outcomes", "## Desired Outcomes"],
  },
  {
    key: "potentialApproaches",
    label: "Potential Solution Approaches",
    aliases: [
      "D. Potential Solution Approaches",
      "Potential Solution Approaches",
      "Possible Approaches",
      "## Potential Solution Approaches",
    ],
  },
  {
    key: "recommendedDirection",
    label: "Recommended Direction",
    aliases: [
      "E. Recommended Direction",
      "Recommended Direction",
      "## Recommended Direction",
    ],
  },
  {
    key: "scopeBlock",
    label: "High-Level Scope",
    aliases: [
      "F. High-Level Scope (In / Out)",
      "High-Level Scope (In / Out)",
      "High-Level Scope",
      "Scope",
      "## High-Level Scope",
    ],
  },
  {
    key: "stakeholders",
    label: "Key Stakeholders",
    aliases: ["G. Key Stakeholders", "Key Stakeholders", "## Key Stakeholders"],
  },
  {
    key: "assumptions",
    label: "Initial Assumptions",
    aliases: ["H. Initial Assumptions", "Initial Assumptions", "## Initial Assumptions"],
  },
  {
    key: "risksConstraints",
    label: "Initial Risks / Constraints",
    aliases: [
      "I. Initial Risks / Constraints",
      "Initial Risks / Constraints",
      "Risks / Constraints",
      "## Initial Risks / Constraints",
    ],
  },
  {
    key: "valueDrivers",
    label: "Value Drivers",
    aliases: ["J. Value Drivers", "Value Drivers", "## Value Drivers"],
  },
  {
    key: "openQuestions",
    label: "Open Questions",
    aliases: ["K. Open Questions", "Open Questions", "## Open Questions"],
  },
];

export function buildIdeationPrompt(projectData) {
  const basics = projectData?.projectBasics || {};
  const ideation = projectData?.ideation || {};

  const safe = (value) => (value && value.trim() ? value.trim() : "Not provided");

  const existingProjectContext = [
    `Project Title: ${safe(basics.title)}`,
    `Business Problem: ${safe(basics.businessProblem)}`,
    `Project Objective: ${safe(basics.projectObjective)}`,
    `Expected Business Outcome: ${safe(basics.expectedBusinessOutcome)}`,
    `Delivery Approach: ${safe(basics.deliveryApproach)}`,
    `In Scope: ${safe(basics.scopeIn)}`,
    `Out of Scope: ${safe(basics.scopeOut)}`,
    `Key Stakeholders: ${safe(basics.keyStakeholders)}`,
    `Key Assumptions: ${safe(basics.keyAssumptions)}`,
    `Constraints: ${safe(basics.keyConstraints)}`,
    `Risks / Dependencies: ${safe(basics.risksDependencies)}`,
  ].join("\n");

  const ideationInput = [
    `Idea Type: ${safe(ideation.ideaType)}`,
    `What sparked this idea: ${safe(ideation.spark)}`,
    `Industry / business context: ${safe(ideation.businessContext)}`,
    `Initial problem / frustration: ${safe(ideation.currentPain)}`,
    `Known goal or desired outcome: ${safe(ideation.knownGoal)}`,
  ].join("\n");

  return `You are an expert project strategist and facilitator skilled in early-stage project ideation, project charter development, project planning, and business value framing.

Your role is to act as an interactive thinking partner to help define a potential project from an initial idea, pain point, or opportunity.

Your goals:
1. Help clarify the underlying problem or opportunity.
2. Identify possible project approaches or solution directions.
3. Define clear and measurable outcomes.
4. Evolve the idea into a structured project concept.
5. Prepare outputs that can be used to build a project charter.

Guidelines:
- Guide the thinking in a structured, practical, business-friendly way.
- Push for clarity and specificity, especially around outcomes and value.
- Distinguish between confirmed inputs, assumptions, and possible directions.
- If information is missing, identify what still needs to be clarified.
- Keep output concise enough to be reusable in a project charter.
- Focus the expected business benefit on the outcome the project should achieve, not only the solution being implemented.

Existing project information (if any):
${existingProjectContext}

Initial ideation input:
${ideationInput}

Please produce the output in the exact structure below:

A. Problem Statement
B. Project Objective
C. Desired Outcomes
D. Potential Solution Approaches
E. Recommended Direction
F. High-Level Scope (In / Out)
G. Key Stakeholders
H. Initial Assumptions
I. Initial Risks / Constraints
J. Value Drivers
K. Open Questions

Additional instructions for each section:
- Problem Statement: clearly describe what is happening today, what is not working, who is impacted, and why it matters.
- Project Objective: define the project in a clear business-focused sentence or short paragraph.
- Desired Outcomes: focus on measurable outcomes such as time savings, cost reduction, quality improvement, risk reduction, capacity increase, speed, revenue growth, or customer experience improvement.
- Potential Solution Approaches: suggest 2 to 4 realistic project directions or solution types.
- Recommended Direction: give the most sensible direction if one stands out, otherwise explain what needs to be known first.
- High-Level Scope (In / Out): explicitly separate In Scope and Out of Scope.
- Value Drivers: identify likely sources of value and where later value estimation should focus.
- Open Questions: list the next questions that should be answered to improve the charter and project plan.

Use concise headings and practical bullet points where useful.`;
}

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/[#*:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findSectionByHeading(line) {
  const normalizedLine = normalizeHeading(line);

  for (const section of ideationSectionOrder) {
    for (const alias of section.aliases) {
      if (normalizedLine === normalizeHeading(alias)) {
        return section.key;
      }
    }
  }

  return null;
}

function extractScopeParts(scopeBlock) {
  if (!scopeBlock || !scopeBlock.trim()) {
    return { scopeIn: "", scopeOut: "" };
  }

  const lines = scopeBlock.split("\n").map((line) => line.trim()).filter(Boolean);

  let inScope = [];
  let outScope = [];
  let currentMode = "in";

  for (const line of lines) {
    const normalized = line.toLowerCase();

    if (
      normalized.startsWith("in scope") ||
      normalized.startsWith("- in scope") ||
      normalized.startsWith("• in scope")
    ) {
      currentMode = "in";
      const cleaned = line.replace(/^[•\-]?\s*in scope[:\-]?\s*/i, "").trim();
      if (cleaned) inScope.push(cleaned);
      continue;
    }

    if (
      normalized.startsWith("out of scope") ||
      normalized.startsWith("- out of scope") ||
      normalized.startsWith("• out of scope")
    ) {
      currentMode = "out";
      const cleaned = line.replace(/^[•\-]?\s*out of scope[:\-]?\s*/i, "").trim();
      if (cleaned) outScope.push(cleaned);
      continue;
    }

    if (currentMode === "in") {
      inScope.push(line.replace(/^[•\-]\s*/, "").trim());
    } else {
      outScope.push(line.replace(/^[•\-]\s*/, "").trim());
    }
  }

  return {
    scopeIn: inScope.join("\n").trim(),
    scopeOut: outScope.join("\n").trim(),
  };
}

export function parseIdeationResponse(responseText) {
  const emptyResult = {
    problemStatement: "",
    projectObjective: "",
    desiredOutcomes: "",
    potentialApproaches: "",
    recommendedDirection: "",
    scopeIn: "",
    scopeOut: "",
    stakeholders: "",
    assumptions: "",
    risksConstraints: "",
    valueDrivers: "",
    openQuestions: "",
  };

  if (!responseText || !responseText.trim()) {
    return emptyResult;
  }

  const lines = responseText.split("\n");
  const sectionBuffers = {};
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const matchedKey = findSectionByHeading(line);

    if (matchedKey) {
      currentKey = matchedKey;
      if (!sectionBuffers[currentKey]) sectionBuffers[currentKey] = [];
      continue;
    }

    if (currentKey) {
      sectionBuffers[currentKey].push(rawLine);
    }
  }

  const cleanedSections = Object.fromEntries(
    Object.entries(sectionBuffers).map(([key, value]) => [
      key,
      value.join("\n").trim(),
    ])
  );

  const scopeParts = extractScopeParts(cleanedSections.scopeBlock || "");

  return {
    ...emptyResult,
    problemStatement: cleanedSections.problemStatement || "",
    projectObjective: cleanedSections.projectObjective || "",
    desiredOutcomes: cleanedSections.desiredOutcomes || "",
    potentialApproaches: cleanedSections.potentialApproaches || "",
    recommendedDirection: cleanedSections.recommendedDirection || "",
    scopeIn: scopeParts.scopeIn,
    scopeOut: scopeParts.scopeOut,
    stakeholders: cleanedSections.stakeholders || "",
    assumptions: cleanedSections.assumptions || "",
    risksConstraints: cleanedSections.risksConstraints || "",
    valueDrivers: cleanedSections.valueDrivers || "",
    openQuestions: cleanedSections.openQuestions || "",
  };
}

export function applyIdeationToProject(projectData) {
  const parsed = projectData?.ideation?.parsedSections || {};

  return {
    ...projectData,
    projectBasics: {
      ...projectData.projectBasics,
      businessProblem:
        parsed.problemStatement || projectData.projectBasics.businessProblem,
      projectObjective:
        parsed.projectObjective || projectData.projectBasics.projectObjective,
      expectedBusinessOutcome:
        parsed.desiredOutcomes ||
        projectData.projectBasics.expectedBusinessOutcome,
      scopeIn: parsed.scopeIn || projectData.projectBasics.scopeIn,
      scopeOut: parsed.scopeOut || projectData.projectBasics.scopeOut,
      keyStakeholders:
        parsed.stakeholders || projectData.projectBasics.keyStakeholders,
      keyAssumptions:
        parsed.assumptions || projectData.projectBasics.keyAssumptions,
      risksDependencies:
        parsed.risksConstraints || projectData.projectBasics.risksDependencies,
      initialValueHypothesis:
        parsed.valueDrivers || projectData.projectBasics.initialValueHypothesis,
    },
  };
}

export function loadIdeationExample() {
  return {
    ideaType: "Quality Improvement",
    spark:
      "Our paid search leaders and specialists are spending significant time manually reviewing ad quality before launch.",
    businessContext:
      "Paid search marketing operations with multiple review layers across specialists, associates, managers, senior managers, associate directors, and directors.",
    currentPain:
      "Manual ad QA is time-consuming, inconsistent, and creates delays. Senior resources are spending time on review tasks that may be partially automatable.",
    knownGoal:
      "Reduce manual review effort, improve ad quality, reduce rework, and speed campaign launch readiness.",
  };
}