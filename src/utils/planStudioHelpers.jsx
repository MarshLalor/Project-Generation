function safeText(value, fallback = "Not yet provided") {function safeText(value, fallback = "Not).trim() : fallback;
}

export const planSectionConfigs = [
  {
    id: "scope",
    title: "Scope",
    shortLabel: "Scope",
    tone: "blue",
    purpose:
      "Define the scope approach, draft scope boundaries, in/out decisions, deliverables, and work packages.",
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