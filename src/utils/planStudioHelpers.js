function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

export const planSectionConfigs = [
  {
    id: "scope",
    title: "Scope",
    shortLabel: "Scope",
    tone: "blue",
    purpose:
      "Define the scope approach, draft scope statement, boundaries, exclusions, and key deliverables.",
    outputHint:
      "Scope statement, in/out boundaries, work packages, missing information, and next actions.",
    tasks: [
      "Summarize the likely scope management approach for this project.",
      "Draft a concise scope statement.",
      "Identify likely In Scope and Out of Scope components.",
      "Suggest major deliverables, work packages, or workstreams.",
      "Call out assumptions and constraints affecting scope.",
      "Identify missing information and ask focused follow-up questions.",
      "Recommend practical next steps to complete this planning section.",
    ],
  },
  {
    id: "schedule",
    title: "Schedule",
    shortLabel: "Schedule",
    tone: "softBlue",
    purpose:
      "Outline phases, milestones, dependencies, sequencing, and timing assumptions.",
    outputHint:
      "High-level phases, milestones, sequencing logic, dependencies, missing inputs, and next actions.",
    tasks: [
      "Draft a high-level schedule approach that fits the selected delivery model.",
      "Suggest likely phases, iterations, or work stages.",
      "List major milestones or timing checkpoints.",
      "Call out likely dependencies, sequencing constraints, and schedule risks.",
      "Identify missing schedule information and ask focused follow-up questions.",
      "Recommend practical next steps to improve schedule confidence.",
    ],
  },
  {
    id: "risk",
    title: "Risk",
    shortLabel: "Risk",
    tone: "orange",
    purpose:
      "Identify major project risks, likely impacts, assumptions, mitigation ideas, and open questions.",
    outputHint:
      "Top risks, causes/impacts, mitigation thoughts, missing information, and next actions.",
    tasks: [
      "Identify the most likely early project risks and dependencies.",
      "Group risks by categories where useful (delivery, stakeholder, technical, data, vendor, adoption, budget, timeline).",
      "Describe why each risk matters and its likely effect.",
      "Suggest practical mitigations, watchouts, or ownership considerations.",
      "Identify missing information and ask focused follow-up questions.",
      "Recommend immediate next steps for early risk management.",
    ],
  },
  {
    id: "communications",
    title: "Communications",
    shortLabel: "Communications",
    tone: "teal",
    purpose:
      "Draft a communication approach for sponsors, business leads, delivery teams, and stakeholders.",
    outputHint:
      "Audience groups, communication goals, cadence, channels, reports, escalation paths, and next actions.",
    tasks: [
      "Draft a practical communications approach for this project.",
      "Identify stakeholder audience groups and what they need to know.",
      "Suggest likely communication types, channels, and cadence.",
      "Identify reporting, decision, escalation, and governance communication needs.",
      "Identify missing communication inputs and ask focused follow-up questions.",
      "Recommend immediate next steps to finalize the communications approach.",
    ],
  },
];

const parseSectionAliases = {
  draftContent: [
    "A. Draft Section Content",
    "Draft Section Content",
    "## Draft Section Content",
  ],
  missingInformation: [
    "B. Missing Information",
    "Missing Information",
    "## Missing Information",
  ],
  questionsForUser: [
    "C. Questions for the User",
    "Questions for the User",
    "Questions",
    "## Questions for the User",
  ],
  suggestedNextSteps: [
    "D. Suggested Next Steps",
    "Suggested Next Steps",
    "## Suggested Next Steps",
  ],
  keyAssumptions: [
    "E. Key Assumptions",
    "Key Assumptions",
    "Assumptions",
    "## Key Assumptions",
  ],
};

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/[#*:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findParsedBlockKey(line) {
  const normalized = normalizeHeading(line);

  for (const [key, aliases] of Object.entries(parseSectionAliases)) {
    for (const alias of aliases) {
      if (normalized === normalizeHeading(alias)) {
        return key;
      }
    }
  }

  return null;
}

function formatProjectContext(projectData) {
  const basics = projectData?.projectBasics || {};
  const charter = projectData?.charter || {};

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
    "Current Charter Context:",
    safeText(charter.charterText),
  ].join("\n");
}

function formatExistingSectionContext(sectionState) {
  return [
    `Current Draft Section Content: ${safeText(sectionState?.draftContent)}`,
    `Current Missing Information: ${safeText(sectionState?.missingInformation)}`,
    `Current Questions for the User: ${safeText(sectionState?.questionsForUser)}`,
    `Current Suggested Next Steps: ${safeText(sectionState?.suggestedNextSteps)}`,
    `Current Key Assumptions: ${safeText(sectionState?.keyAssumptions)}`,
  ].join("\n");
}

export function buildPlanSectionPrompt(projectData, sectionId) {
  const config =
    planSectionConfigs.find((item) => item.id === sectionId) ||
    planSectionConfigs[0];

  const sectionState = projectData?.planStudio?.sections?.[sectionId] || {};

  return `You are an expert project planning assistant with strong knowledge of PMBOK-aligned planning, practical delivery planning, and business-friendly project documentation.

Your task is to help build the ${config.title} section of a project plan.

Guiding principles:
1. Use the project charter and project basics as the minimum source of truth.
2. Align the plan content to the selected delivery approach.
3. Keep outputs practical, structured, and usable by project managers, sponsors, and business leads.
4. Clearly distinguish between draft content, missing information, assumptions, and recommended next steps.
5. If information is missing, ask focused follow-up questions instead of inventing precise detail.

Project context:
${formatProjectContext(projectData)}

Existing section context:
${formatExistingSectionContext(sectionState)}

Planning section to build:
${config.title}

Section goal:
${config.purpose}

Tasks:
${config.tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}

Please return the response in the exact structure below:

A. Draft Section Content
B. Missing Information
C. Questions for the User
D. Suggested Next Steps
E. Key Assumptions

Additional instructions:
- For Waterfall, lean toward structured phases, detailed planning, and defined controls.
- For Agile, lean toward iterative planning, backlog thinking, sprint/release thinking, and continuous refinement.
- For Hybrid, combine structured governance with iterative delivery where appropriate.
- Make the section concise enough to be reusable in a project plan, but detailed enough to be useful.
- Use bullets where helpful.`;
}

export function parsePlanStudioResponse(responseText) {
  const empty = {
    draftContent: "",
    missingInformation: "",
    questionsForUser: "",
    suggestedNextSteps: "",
    keyAssumptions: "",
  };

  if (!responseText || !responseText.trim()) {
    return empty;
  }

  const lines = responseText.split("\n");
  const buffers = {};
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const matchedKey = findParsedBlockKey(line);

    if (matchedKey) {
      currentKey = matchedKey;
      if (!buffers[currentKey]) buffers[currentKey] = [];
      continue;
    }

    if (currentKey) {
      buffers[currentKey].push(rawLine);
    }
  }

  return {
    draftContent: (buffers.draftContent || []).join("\n").trim(),
    missingInformation: (buffers.missingInformation || []).join("\n").trim(),
    questionsForUser: (buffers.questionsForUser || []).join("\n").trim(),
    suggestedNextSteps: (buffers.suggestedNextSteps || []).join("\n").trim(),
    keyAssumptions: (buffers.keyAssumptions || []).join("\n").trim(),
  };
}

export function getPlanStudioProgress(planStudio) {
  const sections = planStudio?.sections || {};
  const entries = Object.entries(sections);

  const total = entries.length;
  const completed = entries.filter(([, value]) => {
    return value?.draftContent && String(value.draftContent).trim();
  }).length;

  const percent = total ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
}