import { createDefaultAssumptionsState } from "./assumptionsHelpers";
import { createDefaultBusinessCaseState } from "./calculationHelpers";
import { createDefaultExecutiveSummaryState } from "./executiveSummaryHelpers";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge(defaultValue, savedValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(savedValue) ? savedValue : defaultValue;
  }

  if (isPlainObject(defaultValue)) {
    const result = { ...defaultValue };
    const source = isPlainObject(savedValue) ? savedValue : {};

    Object.keys(source).forEach((key) => {
      if (key in defaultValue) {
        result[key] = deepMerge(defaultValue[key], source[key]);
      } else {
        result[key] = source[key];
      }
    });

    return result;
  }

  return savedValue !== undefined && savedValue !== null
    ? savedValue
    : defaultValue;
}

export function createInitialProjectData() {
  return {
    projectBasics: {
      title: "",
      businessProblem: "",
      projectObjective: "",
      expectedBusinessOutcome: "",
      deliveryApproach: "hybrid",
      sponsor: "",
      businessOwner: "",
      projectManager: "",
      department: "",
      targetTimeline: "",
      estimatedBudgetRange: "",
      scopeIn: "",
      scopeOut: "",
      keyStakeholders: "",
      successCriteria: "",
      keyAssumptions: "",
      keyConstraints: "",
      risksDependencies: "",
      initialValueHypothesis: "",
    },
    ideation: {
      ideaType: "",
      spark: "",
      businessContext: "",
      currentPain: "",
      knownGoal: "",
      promptText: "",
      aiResponse: "",
      parsedSections: {
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
      },
    },
    charter: {
      backgroundBusinessNeed: "",
      problemStatement: "",
      projectObjectives: "",
      scopeSummary: "",
      keyStakeholders: "",
      timelineMilestones: "",
      assumptions: "",
      constraints: "",
      risksDependencies: "",
      successCriteria: "",
      initialValueHypothesis: "",
      recommendedNextSteps: "",
      charterText: "",
      aiPrompt: "",
      aiResponse: "",
    },
    planStudio: {
      activeSection: "scope",
      sections: {
        scope: {
          promptText: "",
          aiResponse: "",
          draftContent: "",
          missingInformation: "",
          questionsForUser: "",
          suggestedNextSteps: "",
          keyAssumptions: "",
        },
        schedule: {
          promptText: "",
          aiResponse: "",
          draftContent: "",
          missingInformation: "",
          questionsForUser: "",
          suggestedNextSteps: "",
          keyAssumptions: "",
        },
        risk: {
          promptText: "",
          aiResponse: "",
          draftContent: "",
          missingInformation: "",
          questionsForUser: "",
          suggestedNextSteps: "",
          keyAssumptions: "",
        },
        communications: {
          promptText: "",
          aiResponse: "",
          draftContent: "",
          missingInformation: "",
          questionsForUser: "",
          suggestedNextSteps: "",
          keyAssumptions: "",
        },
      },
    },
    valueEstimate: {
      promptText: "",
      aiResponse: "",
      likelyValueDrivers: "",
      knownInputs: "",
      missingInputs: "",
      followUpQuestions: "",
      estimationMethods: "",
      preliminaryValueModel: "",
      confidenceNotes: "",
    },
    costEstimate: {
      promptText: "",
      aiResponse: "",
      costCategories: "",
      knownInputs: "",
      missingInputs: "",
      followUpQuestions: "",
      estimationMethods: "",
      preliminaryCostSummary: "",
      assumptionsConfidenceNotes: "",
    },
    assumptions: createDefaultAssumptionsState(),
    businessCase: createDefaultBusinessCaseState(),
    executiveSummary: createDefaultExecutiveSummaryState(),
  };
}

export function normalizeProjectData(savedProjectData) {
  const baseline = createInitialProjectData();
  return deepMerge(baseline, savedProjectData || {});
}

export function cloneProjectData(projectData) {
  return JSON.parse(JSON.stringify(projectData));
}

export function createBlankProjectData() {
  return createInitialProjectData();
}

export function hasAnyMeaningfulData(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasAnyMeaningfulData(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((item) => hasAnyMeaningfulData(item));
  }

  return false;
}

export function getProjectTitle(projectData) {
  return projectData?.projectBasics?.title?.trim() || "Untitled Project";
}