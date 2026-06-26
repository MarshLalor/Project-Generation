function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/[#*:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const executiveSummaryAliases = {
  summaryText: [
    "A. Executive Summary",
    "Executive Summary",
    "## Executive Summary",
  ],
  decisionAsk: [
    "B. Decision Ask",
    "Decision Ask",
    "## Decision Ask",
  ],
  recommendation: [
    "C. Recommendation",
    "Recommendation",
    "## Recommendation",
  ],
  keyBenefits: [
    "D. Key Benefits",
    "Key Benefits",
    "## Key Benefits",
  ],
  keyCosts: [
    "E. Key Costs / Investment",
    "Key Costs / Investment",
    "Key Costs",
    "Investment",
    "## Key Costs / Investment",
  ],
  scenarioTakeaway: [
    "F. Scenario Takeaway",
    "Scenario Takeaway",
    "## Scenario Takeaway",
  ],
  risksAssumptions: [
    "G. Key Risks / Assumptions",
    "Key Risks / Assumptions",
    "Risks / Assumptions",
    "## Key Risks / Assumptions",
  ],
  nextSteps: [
    "H. Recommended Next Steps",
    "Recommended Next Steps",
    "Next Steps",
    "## Recommended Next Steps",
  ],
};

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

export function createDefaultExecutiveSummaryState() {
  return {
    promptText: "",
    aiResponse: "",
    summaryText: "",
    decisionAsk: "",
    recommendation: "",
    keyBenefits: "",
    keyCosts: "",
    scenarioTakeaway: "",
    risksAssumptions: "",
    nextSteps: "",
  };
}

export function buildExecutiveSummaryPrompt(projectData, outputs) {
  const basics = projectData?.projectBasics || {};
  const executiveSummary = projectData?.executiveSummary || {};

  return `You are an executive business case and project governance advisor.

Your task is to create a concise sponsor-ready executive summary for this project.

Guiding principles:
1. Write for an executive sponsor, steering committee, or business decision maker.
2. Keep the summary concise, practical, and decision-oriented.
3. Clearly explain why the project matters, what outcome it targets, what value it may create, what it may cost, and what decision or next step is needed.
4. Distinguish confirmed facts from assumptions where needed.
5. Do not invent precision. If numbers are preliminary, say they are preliminary.
6. Call out open questions and assumptions that must be validated.

Project basics:
Project Title: ${safeText(basics.title)}
Business Problem / Opportunity: ${safeText(basics.businessProblem)}
Project Objective: ${safeText(basics.projectObjective)}
Expected Business Outcome: ${safeText(basics.expectedBusinessOutcome)}
Delivery Approach: ${safeText(basics.deliveryApproach, "hybrid")}
Estimated Budget Range: ${safeText(basics.estimatedBudgetRange)}
Target Timeline: ${safeText(basics.targetTimeline)}

Current compiled outputs:

PROJECT CHARTER:
${safeText(outputs?.charterText)}

PROJECT PLAN SUMMARY:
${safeText(outputs?.projectPlanSummary)}

VALUE SUMMARY:
${safeText(outputs?.valueSummary)}

COST SUMMARY:
${safeText(outputs?.costSummary)}

SCENARIO SUMMARY:
${safeText(outputs?.scenarioSummary)}

ASSUMPTIONS REGISTER:
${safeText(outputs?.assumptionsRegister)}

OPEN QUESTIONS:
${safeText(outputs?.openQuestionsAndAssumptions)}

Existing executive summary content, if any:
Executive Summary: ${safeText(executiveSummary.summaryText)}
Decision Ask: ${safeText(executiveSummary.decisionAsk)}
Recommendation: ${safeText(executiveSummary.recommendation)}
Key Benefits: ${safeText(executiveSummary.keyBenefits)}
Key Costs: ${safeText(executiveSummary.keyCosts)}
Scenario Takeaway: ${safeText(executiveSummary.scenarioTakeaway)}
Risks / Assumptions: ${safeText(executiveSummary.risksAssumptions)}
Next Steps: ${safeText(executiveSummary.nextSteps)}

Please return the response in the exact structure below:

A. Executive Summary
B. Decision Ask
C. Recommendation
D. Key Benefits
E. Key Costs / Investment
F. Scenario Takeaway
G. Key Risks / Assumptions
H. Recommended Next Steps

Keep the response business-ready and concise.`;
}

export function parseExecutiveSummaryResponse(responseText) {
  return parseStructuredResponse(responseText, executiveSummaryAliases);
}

export function buildExecutiveSummaryText(projectData) {
  const basics = projectData?.projectBasics || {};
  const summary = projectData?.executiveSummary || {};

  return [
    `${safeText(basics.title, "Untitled Project")} — Executive Summary`,
    "",
    "EXECUTIVE SUMMARY",
    safeText(summary.summaryText),
    "",
    "DECISION ASK",
    safeText(summary.decisionAsk),
    "",
    "RECOMMENDATION",
    safeText(summary.recommendation),
    "",
    "KEY BENEFITS",
    safeText(summary.keyBenefits),
    "",
    "KEY COSTS / INVESTMENT",
    safeText(summary.keyCosts),
    "",
    "SCENARIO TAKEAWAY",
    safeText(summary.scenarioTakeaway),
    "",
    "KEY RISKS / ASSUMPTIONS",
    safeText(summary.risksAssumptions),
    "",
    "RECOMMENDED NEXT STEPS",
    safeText(summary.nextSteps),
  ].join("\n");
}