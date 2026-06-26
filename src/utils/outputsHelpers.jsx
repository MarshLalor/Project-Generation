import {
  calculateScenarioSummary,
  formatCurrency,
  formatNumber,
} from "./calculationHelpers";
import { buildExecutiveSummaryText } from "./executiveSummaryHelpers";

function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function multilineToBullets(value, fallback = "Not yet provided") {
  if (!value || !String(value).trim()) {
    return `• ${fallback}`;
  }

  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("•") || line.startsWith("-")) return line;
      return `• ${line}`;
    })
    .join("\n");
}

function rowHasContent(row) {
  return Object.values(row || {}).some(
    (value) => value && String(value).trim()
  );
}

function buildPlanSectionSummary(label, section) {
  return [
    `${label}`,
    section?.draftContent?.trim() ? section.draftContent : "Not yet drafted.",
    "",
    "Missing Information",
    section?.missingInformation?.trim()
      ? section.missingInformation
      : "Not yet captured.",
    "",
    "Questions for the User",
    section?.questionsForUser?.trim()
      ? section.questionsForUser
      : "Not yet captured.",
    "",
    "Suggested Next Steps",
    section?.suggestedNextSteps?.trim()
      ? section.suggestedNextSteps
      : "Not yet captured.",
    "",
    "Key Assumptions",
    section?.keyAssumptions?.trim()
      ? section.keyAssumptions
      : "Not yet captured.",
  ].join("\n");
}

function formatLaborRates(roles = []) {
  const populated = roles.filter(rowHasContent);

  if (!populated.length) {
    return "• Not yet provided";
  }

  return populated
    .map((row) => {
      return [
        `• Role: ${safeText(row.role)}`,
        `  Annual Salary: ${safeText(row.annualSalary)}`,
        `  Hourly Rate: ${safeText(row.hourlyRate)}`,
        `  Fully Loaded Rate: ${safeText(row.fullyLoadedRate)}`,
        `  Source: ${safeText(row.source)}`,
        `  Notes: ${safeText(row.notes)}`,
      ].join("\n");
    })
    .join("\n\n");
}

function formatMetricRows(items = []) {
  const populated = items.filter(rowHasContent);

  if (!populated.length) {
    return "• Not yet provided";
  }

  return populated
    .map((row) => {
      return [
        `• ${safeText(row.name)}`,
        `  Value: ${safeText(row.value)}`,
        `  Unit: ${safeText(row.unit)}`,
        `  Source: ${safeText(row.source)}`,
        `  Notes: ${safeText(row.notes)}`,
      ].join("\n");
    })
    .join("\n\n");
}

function formatBenchmarkRows(items = []) {
  const populated = items.filter(rowHasContent);

  if (!populated.length) {
    return "• Not yet provided";
  }

  return populated
    .map((row) => {
      return [
        `• Category: ${safeText(row.category)}`,
        `  Source: ${safeText(row.source)}`,
        `  Assumption: ${safeText(row.assumption)}`,
        `  Notes: ${safeText(row.notes)}`,
      ].join("\n");
    })
    .join("\n\n");
}

function buildScenarioSummary(projectData) {
  const scenarioData = calculateScenarioSummary(projectData?.businessCase);

  const scenarioBlocks = scenarioData.scenarios.map((scenario) => {
    return [
      `${scenario.label} Scenario`,
      `Annual Benefit: ${formatCurrency(scenario.annualBenefit)}`,
      `Year 1 Cost: ${formatCurrency(scenario.yearOneCost)}`,
      `Recurring Annual Cost: ${formatCurrency(scenario.recurringAnnualCost)}`,
      `Year 1 Net Value: ${formatCurrency(scenario.yearOneNetValue)}`,
      `Payback: ${
        scenario.paybackYears === null
          ? "N/A"
          : `${formatNumber(scenario.paybackYears)} years`
      }`,
      `Benefit Factor: ${scenario.benefitFactor}`,
      `Cost Factor: ${scenario.costFactor}`,
      `Notes: ${safeText(scenario.notes)}`,
    ].join("\n");
  });

  return [
    `${safeText(
      projectData?.projectBasics?.title,
      "Untitled Project"
    )} — Scenario Summary`,
    "",
    "BASE VALUE SUMMARY",
    `Base Annual Labor Savings: ${formatCurrency(
      scenarioData.baseValue.laborSavings
    )}`,
    `Base Additional Annual Value: ${formatCurrency(
      scenarioData.baseValue.additionalValue
    )}`,
    `Base Total Annual Value: ${formatCurrency(
      scenarioData.baseValue.totalAnnualValue
    )}`,
    "",
    "BASE COST SUMMARY",
    `One-Time Cost Subtotal: ${formatCurrency(
      scenarioData.baseCost.oneTimeSubtotal
    )}`,
    `Contingency: ${formatCurrency(scenarioData.baseCost.contingency)}`,
    `Base Year 1 Cost: ${formatCurrency(scenarioData.baseCost.yearOneCost)}`,
    `Base Recurring Annual Cost: ${formatCurrency(
      scenarioData.baseCost.recurringAnnualCost
    )}`,
    "",
    "LOW / EXPECTED / HIGH SCENARIOS",
    scenarioBlocks.join("\n\n"),
  ].join("\n");
}

export function buildOutputsPayload(projectData) {
  const basics = projectData?.projectBasics || {};
  const ideation = projectData?.ideation?.parsedSections || {};
  const charter = projectData?.charter || {};
  const planStudio = projectData?.planStudio || {};
  const valueEstimate = projectData?.valueEstimate || {};
  const costEstimate = projectData?.costEstimate || {};
  const assumptions = projectData?.assumptions || {};

  const executiveSummary = buildExecutiveSummaryText(projectData);

  const effectiveCharterText =
    charter.charterText && charter.charterText.trim()
      ? charter.charterText
      : [
          `${safeText(basics.title, "Untitled Project")} — Project Charter`,
          "",
          "1. Background / Business Need",
          safeText(charter.backgroundBusinessNeed || basics.businessProblem),
          "",
          "2. Problem Statement",
          safeText(charter.problemStatement || basics.businessProblem),
          "",
          "3. Project Objectives",
          safeText(charter.projectObjectives || basics.projectObjective),
          "",
          "4. Scope Summary",
          safeText(charter.scopeSummary || basics.scopeIn),
          "",
          "5. Key Stakeholders",
          safeText(charter.keyStakeholders || basics.keyStakeholders),
          "",
          "6. Timeline / Milestones",
          safeText(charter.timelineMilestones || basics.targetTimeline),
          "",
          "7. Assumptions",
          safeText(charter.assumptions || basics.keyAssumptions),
          "",
          "8. Constraints",
          safeText(charter.constraints || basics.keyConstraints),
          "",
          "9. Risks / Dependencies",
          safeText(charter.risksDependencies || basics.risksDependencies),
          "",
          "10. Success Criteria",
          safeText(charter.successCriteria || basics.successCriteria),
          "",
          "11. Initial Value Hypothesis",
          safeText(
            charter.initialValueHypothesis || basics.initialValueHypothesis
          ),
          "",
          "12. Recommended Next Steps",
          safeText(charter.recommendedNextSteps),
        ].join("\n");

  const sections = planStudio.sections || {};

  const projectPlanSummary = [
    `${safeText(basics.title, "Untitled Project")} — Project Plan Summary`,
    "",
    "PROJECT CONTEXT",
    `Project Objective: ${safeText(basics.projectObjective)}`,
    `Expected Business Outcome: ${safeText(basics.expectedBusinessOutcome)}`,
    `Delivery Approach: ${safeText(basics.deliveryApproach, "hybrid")}`,
    "",
    "SCOPE SECTION",
    buildPlanSectionSummary("Scope", sections.scope),
    "",
    "SCHEDULE SECTION",
    buildPlanSectionSummary("Schedule", sections.schedule),
    "",
    "RISK SECTION",
    buildPlanSectionSummary("Risk", sections.risk),
    "",
    "COMMUNICATIONS SECTION",
    buildPlanSectionSummary("Communications", sections.communications),
  ].join("\n");

  const valueSummary = [
    `${safeText(basics.title, "Untitled Project")} — Value Summary`,
    "",
    "Outcome Focus",
    safeText(basics.expectedBusinessOutcome),
    "",
    "Likely Value Drivers",
    multilineToBullets(
      valueEstimate.likelyValueDrivers || basics.initialValueHypothesis
    ),
    "",
    "Known Inputs",
    multilineToBullets(valueEstimate.knownInputs),
    "",
    "Missing Inputs",
    multilineToBullets(valueEstimate.missingInputs),
    "",
    "Step-by-Step Follow-Up Questions",
    multilineToBullets(valueEstimate.followUpQuestions),
    "",
    "Suggested Estimation Methods",
    multilineToBullets(valueEstimate.estimationMethods),
    "",
    "Preliminary High-Level Value Model",
    safeText(valueEstimate.preliminaryValueModel),
    "",
    "Confidence / Assumption Notes",
    multilineToBullets(valueEstimate.confidenceNotes),
  ].join("\n");

  const costSummary = [
    `${safeText(basics.title, "Untitled Project")} — Cost Estimate Summary`,
    "",
    "Budget Context",
    `Estimated Budget Range: ${safeText(basics.estimatedBudgetRange)}`,
    `Delivery Approach: ${safeText(basics.deliveryApproach, "hybrid")}`,
    "",
    "Cost Categories",
    multilineToBullets(costEstimate.costCategories),
    "",
    "Known Inputs",
    multilineToBullets(costEstimate.knownInputs),
    "",
    "Missing Inputs",
    multilineToBullets(costEstimate.missingInputs),
    "",
    "Step-by-Step Questions",
    multilineToBullets(costEstimate.followUpQuestions),
    "",
    "Recommended Estimation Methods",
    multilineToBullets(costEstimate.estimationMethods),
    "",
    "Preliminary Cost Estimate Summary",
    safeText(costEstimate.preliminaryCostSummary),
    "",
    "Assumptions and Confidence Notes",
    multilineToBullets(costEstimate.assumptionsConfidenceNotes),
  ].join("\n");

  const assumptionsRegister = [
    `${safeText(basics.title, "Untitled Project")} — Assumptions Register`,
    "",
    "LABOR RATE ASSUMPTIONS",
    formatLaborRates(assumptions?.laborRates?.roles || []),
    "",
    "Labor Rate Notes",
    safeText(assumptions?.laborRates?.notes),
    "",
    "EFFORT ASSUMPTIONS",
    formatMetricRows(assumptions?.effortAssumptions?.items || []),
    "",
    "Effort Notes",
    safeText(assumptions?.effortAssumptions?.notes),
    "",
    "VOLUME ASSUMPTIONS",
    formatMetricRows(assumptions?.volumeAssumptions?.items || []),
    "",
    "Volume Notes",
    safeText(assumptions?.volumeAssumptions?.notes),
    "",
    "BENCHMARK ASSUMPTIONS",
    formatBenchmarkRows(assumptions?.benchmarkAssumptions?.items || []),
    "",
    "Benchmark Notes",
    safeText(assumptions?.benchmarkAssumptions?.notes),
    "",
    "CALCULATION SETTINGS",
    `Burden Factor: ${safeText(
      assumptions?.calculationAssumptions?.burdenFactor
    )}`,
    `Confidence Level: ${safeText(
      assumptions?.calculationAssumptions?.confidenceLevel
    )}`,
    "",
    "Calculation Notes",
    safeText(assumptions?.calculationAssumptions?.notes),
  ].join("\n");

  const scenarioSummary = buildScenarioSummary(projectData);

  const openQuestionsAndAssumptions = [
    `${safeText(basics.title, "Untitled Project")} — Open Questions & Assumptions`,
    "",
    "IDEATION OPEN QUESTIONS",
    multilineToBullets(ideation.openQuestions),
    "",
    "PROJECT ASSUMPTIONS",
    multilineToBullets(basics.keyAssumptions),
    "",
    "PROJECT CONSTRAINTS",
    multilineToBullets(basics.keyConstraints),
    "",
    "PROJECT RISKS / DEPENDENCIES",
    multilineToBullets(basics.risksDependencies),
    "",
    "ASSUMPTIONS WORKSPACE OPEN QUESTIONS",
    multilineToBullets(assumptions?.openQuestions),
    "",
    "PLAN STUDIO — SCOPE QUESTIONS",
    multilineToBullets(sections.scope?.questionsForUser),
    "",
    "PLAN STUDIO — SCHEDULE QUESTIONS",
    multilineToBullets(sections.schedule?.questionsForUser),
    "",
    "PLAN STUDIO — RISK QUESTIONS",
    multilineToBullets(sections.risk?.questionsForUser),
    "",
    "PLAN STUDIO — COMMUNICATIONS QUESTIONS",
    multilineToBullets(sections.communications?.questionsForUser),
    "",
    "VALUE ESTIMATE — MISSING INPUTS",
    multilineToBullets(valueEstimate.missingInputs),
    "",
    "VALUE ESTIMATE — FOLLOW-UP QUESTIONS",
    multilineToBullets(valueEstimate.followUpQuestions),
    "",
    "COST ESTIMATE — MISSING INPUTS",
    multilineToBullets(costEstimate.missingInputs),
    "",
    "COST ESTIMATE — FOLLOW-UP QUESTIONS",
    multilineToBullets(costEstimate.followUpQuestions),
  ].join("\n");

  const fullOutputPack = [
    executiveSummary,
    "",
    "============================================================",
    "",
    effectiveCharterText,
    "",
    "============================================================",
    "",
    projectPlanSummary,
    "",
    "============================================================",
    "",
    valueSummary,
    "",
    "============================================================",
    "",
    costSummary,
    "",
    "============================================================",
    "",
    scenarioSummary,
    "",
    "============================================================",
    "",
    assumptionsRegister,
    "",
    "============================================================",
    "",
    openQuestionsAndAssumptions,
  ].join("\n");

  return {
    executiveSummary,
    charterText: effectiveCharterText,
    projectPlanSummary,
    valueSummary,
    costSummary,
    scenarioSummary,
    assumptionsRegister,
    openQuestionsAndAssumptions,
    fullOutputPack,
  };
}

export function getOutputsReadiness(projectData) {
  const executiveReady =
    projectData?.executiveSummary?.summaryText?.trim() ||
    projectData?.executiveSummary?.recommendation?.trim();

  const charterReady =
    projectData?.charter?.charterText?.trim() ||
    projectData?.projectBasics?.projectObjective?.trim();

  const hasPlan = Object.values(projectData?.planStudio?.sections || {}).some(
    (section) => section?.draftContent && String(section.draftContent).trim()
  );

  const hasValue =
    projectData?.valueEstimate?.preliminaryValueModel?.trim() ||
    projectData?.valueEstimate?.likelyValueDrivers?.trim() ||
    projectData?.businessCase?.valueInputs?.annualSavedHours?.trim();

  const hasCost =
    projectData?.costEstimate?.preliminaryCostSummary?.trim() ||
    projectData?.costEstimate?.costCategories?.trim() ||
    projectData?.businessCase?.costInputs?.softwareCost?.trim();

  const assumptions = projectData?.assumptions || {};

  const hasAssumptions =
    assumptions?.laborRates?.roles?.some(rowHasContent) ||
    assumptions?.effortAssumptions?.items?.some(rowHasContent) ||
    assumptions?.volumeAssumptions?.items?.some(rowHasContent) ||
    assumptions?.benchmarkAssumptions?.items?.some(rowHasContent) ||
    assumptions?.openQuestions?.trim();

  const hasScenario =
    projectData?.businessCase?.valueInputs?.annualSavedHours?.trim() ||
    projectData?.businessCase?.costInputs?.softwareCost?.trim() ||
    projectData?.businessCase?.costInputs?.implementationCost?.trim();

  const checks = [
    { label: "Executive Summary", ready: !!executiveReady },
    { label: "Charter", ready: !!charterReady },
    { label: "Project Plan Summary", ready: !!hasPlan },
    { label: "Value Summary", ready: !!hasValue },
    { label: "Cost Summary", ready: !!hasCost },
    { label: "Scenario Summary", ready: !!hasScenario },
    { label: "Assumptions Register", ready: !!hasAssumptions },
  ];

  const completed = checks.filter((item) => item.ready).length;
  const total = checks.length;
  const percent = Math.round((completed / total) * 100);

  return { checks, completed, total, percent };
}