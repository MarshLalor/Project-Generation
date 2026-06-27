function hasText(value) {
  return !!(value && String(value).trim());
}

function rowHasContent(row) {
  return Object.values(row || {}).some((value) => hasText(value));
}

function countReady(values = []) {
  const total = values.length;
  const ready = values.filter(Boolean).length;
  const percent = total ? Math.round((ready / total) * 100) : 0;

  return {
    ready,
    total,
    percent,
  };
}

export const toolFlowSteps = [
  {
    id: "ideation",
    label: "Ideation",
    shortLabel: "Ideation",
    description: "Shape an early idea, pain point, or opportunity.",
  },
  {
    id: "project-basics",
    label: "Project Basics",
    shortLabel: "Basics",
    description: "Define the core project context and business outcome.",
  },
  {
    id: "charter",
    label: "Charter",
    shortLabel: "Charter",
    description: "Generate and refine the project charter.",
  },
  {
    id: "plan-studio",
    label: "Plan Studio",
    shortLabel: "Plan",
    description: "Build planning sections for scope, schedule, risk, and communications.",
  },
  {
    id: "value-estimate",
    label: "Value Estimate",
    shortLabel: "Value",
    description: "Identify benefits, value drivers, and estimate logic.",
  },
  {
    id: "cost-estimate",
    label: "Cost Estimate",
    shortLabel: "Cost",
    description: "Estimate investment, cost categories, and recurring costs.",
  },
  {
    id: "assumptions",
    label: "Assumptions",
    shortLabel: "Assumptions",
    description: "Centralize labor, effort, volume, benchmark, and calculation assumptions.",
  },
  {
    id: "outputs",
    label: "Outputs",
    shortLabel: "Outputs",
    description: "Compile, validate, and export executive-ready deliverables.",
  },
];

function getIdeationScore(projectData) {
  const ideation = projectData?.ideation || {};
  const parsed = ideation?.parsedSections || {};

  return countReady([
    hasText(ideation.ideaType),
    hasText(ideation.spark),
    hasText(ideation.businessContext),
    hasText(ideation.currentPain),
    hasText(ideation.knownGoal),
    hasText(parsed.problemStatement),
    hasText(parsed.projectObjective),
    hasText(parsed.valueDrivers),
  ]);
}

function getProjectBasicsScore(projectData) {
  const basics = projectData?.projectBasics || {};

  return countReady([
    hasText(basics.title),
    hasText(basics.businessProblem),
    hasText(basics.projectObjective),
    hasText(basics.expectedBusinessOutcome),
    hasText(basics.deliveryApproach),
    hasText(basics.scopeIn) || hasText(basics.scopeOut),
    hasText(basics.keyStakeholders),
    hasText(basics.successCriteria),
  ]);
}

function getCharterScore(projectData) {
  const charter = projectData?.charter || {};

  return countReady([
    hasText(charter.backgroundBusinessNeed),
    hasText(charter.problemStatement),
    hasText(charter.projectObjectives),
    hasText(charter.scopeSummary),
    hasText(charter.keyStakeholders),
    hasText(charter.successCriteria),
    hasText(charter.charterText),
  ]);
}

function getPlanStudioScore(projectData) {
  const sections = projectData?.planStudio?.sections || {};

  return countReady([
    hasText(sections.scope?.draftContent),
    hasText(sections.schedule?.draftContent),
    hasText(sections.risk?.draftContent),
    hasText(sections.communications?.draftContent),
  ]);
}

function getValueEstimateScore(projectData) {
  const value = projectData?.valueEstimate || {};
  const businessCase = projectData?.businessCase || {};

  return countReady([
    hasText(value.likelyValueDrivers),
    hasText(value.knownInputs),
    hasText(value.missingInputs),
    hasText(value.estimationMethods),
    hasText(value.preliminaryValueModel) ||
      hasText(businessCase.valueInputs?.annualSavedHours),
    hasText(value.confidenceNotes),
  ]);
}

function getCostEstimateScore(projectData) {
  const cost = projectData?.costEstimate || {};
  const businessCase = projectData?.businessCase || {};

  return countReady([
    hasText(cost.costCategories),
    hasText(cost.knownInputs),
    hasText(cost.missingInputs),
    hasText(cost.estimationMethods),
    hasText(cost.preliminaryCostSummary) ||
      hasText(businessCase.costInputs?.softwareCost) ||
      hasText(businessCase.costInputs?.implementationCost),
    hasText(cost.assumptionsConfidenceNotes),
  ]);
}

function getAssumptionsScore(projectData) {
  const assumptions = projectData?.assumptions || {};

  return countReady([
    assumptions?.laborRates?.roles?.some(rowHasContent),
    assumptions?.effortAssumptions?.items?.some(rowHasContent),
    assumptions?.volumeAssumptions?.items?.some(rowHasContent),
    assumptions?.benchmarkAssumptions?.items?.some(rowHasContent),
    hasText(assumptions?.calculationAssumptions?.burdenFactor),
    hasText(assumptions?.calculationAssumptions?.confidenceLevel),
    hasText(assumptions?.openQuestions),
  ]);
}

function getOutputsScore(projectData) {
  const executive = projectData?.executiveSummary || {};
  const charter = projectData?.charter || {};
  const businessCase = projectData?.businessCase || {};

  return countReady([
    hasText(executive.summaryText),
    hasText(executive.recommendation),
    hasText(executive.decisionAsk),
    hasText(charter.charterText),
    hasText(businessCase.valueInputs?.annualSavedHours),
    hasText(businessCase.costInputs?.softwareCost) ||
      hasText(businessCase.costInputs?.implementationCost),
  ]);
}

function getScoreForStep(projectData, stepId) {
  switch (stepId) {
    case "ideation":
      return getIdeationScore(projectData);
    case "project-basics":
      return getProjectBasicsScore(projectData);
    case "charter":
      return getCharterScore(projectData);
    case "plan-studio":
      return getPlanStudioScore(projectData);
    case "value-estimate":
      return getValueEstimateScore(projectData);
    case "cost-estimate":
      return getCostEstimateScore(projectData);
    case "assumptions":
      return getAssumptionsScore(projectData);
    case "outputs":
      return getOutputsScore(projectData);
    default:
      return {
        ready: 0,
        total: 0,
        percent: 0,
      };
  }
}

function getStepStatus(score) {
  if (score.percent >= 70) return "completed";
  if (score.percent > 0) return "needs-work";
  return "not-started";
}

function getStatusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "next") return "Next best step";
  if (status === "needs-work") return "Needs work";
  return "Not started";
}

function getReasonForStep(projectData, stepId) {
  const basics = projectData?.projectBasics || {};
  const charter = projectData?.charter || {};
  const planSections = projectData?.planStudio?.sections || {};
  const value = projectData?.valueEstimate || {};
  const cost = projectData?.costEstimate || {};
  const assumptions = projectData?.assumptions || {};
  const executive = projectData?.executiveSummary || {};

  switch (stepId) {
    case "ideation":
      return "Start by shaping the opportunity and clarifying the initial problem.";
    case "project-basics":
      if (!hasText(basics.projectObjective)) {
        return "Add the project objective and expected business outcome.";
      }
      return "Strengthen the core context before generating the charter.";
    case "charter":
      if (!hasText(charter.charterText)) {
        return "Generate or refresh the charter so planning has a source of truth.";
      }
      return "Refine the charter sections before planning.";
    case "plan-studio":
      if (!hasText(planSections.scope?.draftContent)) {
        return "Draft the Scope section first, then continue with schedule, risk, and communications.";
      }
      return "Complete remaining planning sections.";
    case "value-estimate":
      if (!hasText(value.likelyValueDrivers)) {
        return "Identify the primary value drivers and high-level benefit logic.";
      }
      return "Refine the value estimate and scenario inputs.";
    case "cost-estimate":
      if (!hasText(cost.costCategories)) {
        return "Identify cost categories and rough investment assumptions.";
      }
      return "Refine the cost estimate and recurring cost logic.";
    case "assumptions":
      if (!assumptions?.laborRates?.roles?.some(rowHasContent)) {
        return "Add labor rates and effort assumptions to support stronger calculations.";
      }
      return "Review benchmarks, confidence level, and open questions.";
    case "outputs":
      if (!hasText(executive.summaryText)) {
        return "Generate the executive summary and review validation gaps.";
      }
      return "Review, validate, and export the final output package.";
    default:
      return "Continue through the tool flow.";
  }
}

export function getFlowStatusMap(projectData) {
  const base = toolFlowSteps.map((step) => {
    const score = getScoreForStep(projectData, step.id);
    const status = getStepStatus(score);

    return {
      ...step,
      score,
      status,
      statusLabel: getStatusLabel(status),
      reason: getReasonForStep(projectData, step.id),
    };
  });

  const nextStep =
    base.find((step) => step.status !== "completed") || base[base.length - 1];

  return base.map((step) => {
    if (step.id === nextStep.id && step.status !== "completed") {
      return {
        ...step,
        status: "next",
        statusLabel: "Next best step",
      };
    }

    return step;
  });
}

export function getNextRecommendedStep(projectData) {
  const flow = getFlowStatusMap(projectData);
  return flow.find((step) => step.status === "next") || flow[flow.length - 1];
}

export function getCurrentStepStatus(projectData, activeTab) {
  const flow = getFlowStatusMap(projectData);
  return flow.find((step) => step.id === activeTab) || null;
}