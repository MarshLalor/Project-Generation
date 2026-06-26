function hasText(value) {
  return !!(value && String(value).trim());
}

function rowHasContent(row) {
  return Object.values(row || {}).some((value) => hasText(value));
}

function createCheck({
  id,
  section,
  label,
  ready,
  severity = "required",
  recommendation,
}) {
  return {
    id,
    section,
    label,
    ready: !!ready,
    severity,
    recommendation,
  };
}

export function getValidationReadiness(projectData) {
  const basics = projectData?.projectBasics || {};
  const charter = projectData?.charter || {};
  const planSections = projectData?.planStudio?.sections || {};
  const valueEstimate = projectData?.valueEstimate || {};
  const costEstimate = projectData?.costEstimate || {};
  const assumptions = projectData?.assumptions || {};
  const businessCase = projectData?.businessCase || {};
  const executiveSummary = projectData?.executiveSummary || {};

  const checks = [
    createCheck({
      id: "project-title",
      section: "Project Basics",
      label: "Project title is provided",
      ready: hasText(basics.title),
      recommendation: "Add a clear project title in Project Basics.",
    }),
    createCheck({
      id: "business-problem",
      section: "Project Basics",
      label: "Business problem / opportunity is defined",
      ready: hasText(basics.businessProblem),
      recommendation:
        "Describe the current business problem, opportunity, inefficiency, or risk.",
    }),
    createCheck({
      id: "project-objective",
      section: "Project Basics",
      label: "Project objective is defined",
      ready: hasText(basics.projectObjective),
      recommendation: "Add a concise project objective.",
    }),
    createCheck({
      id: "expected-outcome",
      section: "Project Basics",
      label: "Expected business outcome is defined",
      ready: hasText(basics.expectedBusinessOutcome),
      recommendation:
        "Add the measurable or observable business outcome the project should create.",
    }),
    createCheck({
      id: "scope",
      section: "Project Basics",
      label: "Scope boundaries are defined",
      ready: hasText(basics.scopeIn) || hasText(basics.scopeOut),
      severity: "recommended",
      recommendation:
        "Add in-scope and out-of-scope items to improve planning quality.",
    }),
    createCheck({
      id: "success-criteria",
      section: "Project Basics",
      label: "Success criteria are defined",
      ready: hasText(basics.successCriteria),
      severity: "recommended",
      recommendation:
        "Define success criteria so outcomes can be evaluated later.",
    }),

    createCheck({
      id: "charter-ready",
      section: "Charter",
      label: "Charter draft exists",
      ready:
        hasText(charter.charterText) ||
        hasText(charter.problemStatement) ||
        hasText(charter.projectObjectives),
      recommendation:
        "Generate or refresh the project charter from Project Basics.",
    }),

    createCheck({
      id: "scope-plan",
      section: "Plan Studio",
      label: "Scope plan section is drafted",
      ready: hasText(planSections.scope?.draftContent),
      recommendation: "Draft the Scope section in Plan Studio.",
    }),
    createCheck({
      id: "schedule-plan",
      section: "Plan Studio",
      label: "Schedule plan section is drafted",
      ready: hasText(planSections.schedule?.draftContent),
      severity: "recommended",
      recommendation: "Draft the Schedule section in Plan Studio.",
    }),
    createCheck({
      id: "risk-plan",
      section: "Plan Studio",
      label: "Risk plan section is drafted",
      ready: hasText(planSections.risk?.draftContent),
      recommendation: "Draft the Risk section in Plan Studio.",
    }),

    createCheck({
      id: "value-drivers",
      section: "Value Estimate",
      label: "Value drivers are identified",
      ready: hasText(valueEstimate.likelyValueDrivers),
      recommendation: "Identify likely value drivers in Value Estimate.",
    }),
    createCheck({
      id: "value-model",
      section: "Value Estimate",
      label: "Preliminary value model exists",
      ready:
        hasText(valueEstimate.preliminaryValueModel) ||
        hasText(businessCase.valueInputs?.annualSavedHours),
      recommendation:
        "Add a preliminary value model or scenario calculator value inputs.",
    }),

    createCheck({
      id: "cost-categories",
      section: "Cost Estimate",
      label: "Cost categories are identified",
      ready: hasText(costEstimate.costCategories),
      recommendation: "Identify cost categories in Cost Estimate.",
    }),
    createCheck({
      id: "cost-model",
      section: "Cost Estimate",
      label: "Preliminary cost model exists",
      ready:
        hasText(costEstimate.preliminaryCostSummary) ||
        hasText(businessCase.costInputs?.softwareCost) ||
        hasText(businessCase.costInputs?.implementationCost),
      recommendation:
        "Add a preliminary cost summary or scenario calculator cost inputs.",
    }),

    createCheck({
      id: "labor-assumptions",
      section: "Assumptions",
      label: "Labor assumptions are captured",
      ready: assumptions.laborRates?.roles?.some(rowHasContent),
      severity: "recommended",
      recommendation:
        "Add labor rate assumptions to strengthen value and cost estimates.",
    }),
    createCheck({
      id: "effort-assumptions",
      section: "Assumptions",
      label: "Effort assumptions are captured",
      ready: assumptions.effortAssumptions?.items?.some(rowHasContent),
      severity: "recommended",
      recommendation:
        "Add effort assumptions such as hours saved, implementation hours, or review effort.",
    }),
    createCheck({
      id: "open-questions",
      section: "Assumptions",
      label: "Open questions are captured",
      ready: hasText(assumptions.openQuestions),
      severity: "recommended",
      recommendation:
        "Capture unresolved questions that could affect estimates or executive review.",
    }),

    createCheck({
      id: "scenario-inputs",
      section: "Scenario Calculator",
      label: "Scenario calculator has value and cost inputs",
      ready:
        hasText(businessCase.valueInputs?.annualSavedHours) &&
        (hasText(businessCase.costInputs?.softwareCost) ||
          hasText(businessCase.costInputs?.implementationCost) ||
          hasText(businessCase.costInputs?.internalLaborCost)),
      recommendation:
        "Add value and cost inputs in the Scenario Calculator.",
    }),

    createCheck({
      id: "executive-summary",
      section: "Outputs",
      label: "Executive summary is drafted",
      ready:
        hasText(executiveSummary.summaryText) ||
        hasText(executiveSummary.recommendation),
      severity: "recommended",
      recommendation:
        "Generate and parse the executive summary in Outputs before final export.",
    }),
  ];

  const requiredChecks = checks.filter((check) => check.severity === "required");
  const recommendedChecks = checks.filter(
    (check) => check.severity === "recommended"
  );

  const requiredComplete = requiredChecks.filter((check) => check.ready).length;
  const recommendedComplete = recommendedChecks.filter(
    (check) => check.ready
  ).length;

  const totalComplete = checks.filter((check) => check.ready).length;
  const total = checks.length;

  const percent = total ? Math.round((totalComplete / total) * 100) : 0;

  const requiredPercent = requiredChecks.length
    ? Math.round((requiredComplete / requiredChecks.length) * 100)
    : 100;

  const missingRequired = requiredChecks.filter((check) => !check.ready);
  const missingRecommended = recommendedChecks.filter((check) => !check.ready);

  const executiveReady = missingRequired.length === 0 && percent >= 70;

  return {
    checks,
    percent,
    total,
    totalComplete,
    requiredPercent,
    requiredComplete,
    requiredTotal: requiredChecks.length,
    recommendedComplete,
    recommendedTotal: recommendedChecks.length,
    missingRequired,
    missingRecommended,
    executiveReady,
  };
}

export function buildValidationSummaryText(projectData) {
  const readiness = getValidationReadiness(projectData);

  const requiredItems = readiness.missingRequired.length
    ? readiness.missingRequired
        .map((item) => `• ${item.section}: ${item.recommendation}`)
        .join("\n")
    : "• No required gaps identified.";

  const recommendedItems = readiness.missingRecommended.length
    ? readiness.missingRecommended
        .map((item) => `• ${item.section}: ${item.recommendation}`)
        .join("\n")
    : "• No recommended gaps identified.";

  return [
    "Executive Review Readiness",
    "",
    `Overall Readiness: ${readiness.percent}%`,
    `Required Readiness: ${readiness.requiredPercent}%`,
    `Ready for Executive Review: ${readiness.executiveReady ? "Yes" : "No"}`,
    "",
    "Required Gaps",
    requiredItems,
    "",
    "Recommended Improvements",
    recommendedItems,
  ].join("\n");
}