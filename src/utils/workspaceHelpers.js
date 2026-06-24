export function hasText(value) {
  return !!(value && String(value).trim());
}

export function countCompletedFields(values = []) {
  const completed = values.filter((value) => hasText(value)).length;
  const total = values.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percent,
  };
}

export function formatCompletionLabel(summary, label = "Completion") {
  return `${label}: ${summary.percent}% (${summary.completed}/${summary.total})`;
}

export function getIdeationCompletion(projectData) {
  const ideation = projectData?.ideation || {};
  const parsed = ideation?.parsedSections || {};

  return countCompletedFields([
    ideation.ideaType,
    ideation.spark,
    ideation.businessContext,
    ideation.currentPain,
    ideation.knownGoal,
    parsed.problemStatement,
    parsed.projectObjective,
    parsed.desiredOutcomes,
    parsed.potentialApproaches,
    parsed.recommendedDirection,
    parsed.scopeIn,
    parsed.scopeOut,
    parsed.stakeholders,
    parsed.assumptions,
    parsed.risksConstraints,
    parsed.valueDrivers,
    parsed.openQuestions,
  ]);
}

export function getProjectBasicsCompletion(projectData) {
  const basics = projectData?.projectBasics || {};

  return countCompletedFields([
    basics.title,
    basics.businessProblem,
    basics.projectObjective,
    basics.expectedBusinessOutcome,
    basics.deliveryApproach,
    basics.sponsor,
    basics.businessOwner,
    basics.projectManager,
    basics.department,
    basics.targetTimeline,
    basics.estimatedBudgetRange,
    basics.scopeIn,
    basics.scopeOut,
    basics.keyStakeholders,
    basics.successCriteria,
    basics.keyAssumptions,
    basics.keyConstraints,
    basics.risksDependencies,
    basics.initialValueHypothesis,
  ]);
}

export function getCharterCompletion(projectData) {
  const charter = projectData?.charter || {};

  return countCompletedFields([
    charter.backgroundBusinessNeed,
    charter.problemStatement,
    charter.projectObjectives,
    charter.scopeSummary,
    charter.keyStakeholders,
    charter.timelineMilestones,
    charter.assumptions,
    charter.constraints,
    charter.risksDependencies,
    charter.successCriteria,
    charter.initialValueHypothesis,
    charter.recommendedNextSteps,
    charter.charterText,
  ]);
}

export function getValueEstimateCompletion(projectData) {
  const valueEstimate = projectData?.valueEstimate || {};

  return countCompletedFields([
    valueEstimate.likelyValueDrivers,
    valueEstimate.knownInputs,
    valueEstimate.missingInputs,
    valueEstimate.followUpQuestions,
    valueEstimate.estimationMethods,
    valueEstimate.preliminaryValueModel,
    valueEstimate.confidenceNotes,
  ]);
}

export function getCostEstimateCompletion(projectData) {
  const costEstimate = projectData?.costEstimate || {};

  return countCompletedFields([
    costEstimate.costCategories,
    costEstimate.knownInputs,
    costEstimate.missingInputs,
    costEstimate.followUpQuestions,
    costEstimate.estimationMethods,
    costEstimate.preliminaryCostSummary,
    costEstimate.assumptionsConfidenceNotes,
  ]);
}