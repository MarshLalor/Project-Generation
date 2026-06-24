import React, { useEffect, useMemo, useState } from "react";
import TopNav from "./components/layout/TopNav";
import LandingPage from "./components/home/LandingPage";
import PlaceholderWorkspace from "./components/workspace/PlaceholderWorkspace";
import IdeationWorkspace from "./components/workspace/IdeationWorkspace";
import ProjectBasicsWorkspace from "./components/workspace/ProjectBasicsWorkspace";
import CharterWorkspace from "./components/workspace/CharterWorkspace";
import PlanStudioWorkspace from "./components/workspace/PlanStudioWorkspace";
import ValueEstimateWorkspace from "./components/workspace/ValueEstimateWorkspace";
import CostEstimateWorkspace from "./components/workspace/CostEstimateWorkspace";
import OutputsWorkspace from "./components/workspace/OutputsWorkspace";
import { topNavTabs, tabGuideCards } from "./data/projectBuilderConfig";
import {
  cloneInitialProjectData,
  getInitialHydratedState,
  getSlotSummaries,
  loadProjectFromSlot,
  saveProjectToSlot,
  setLastActiveSlot,
} from "./utils/storageHelpers";

const initialProjectData = {
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
};

function hasAnyMeaningfulData(value) {
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

export default function App() {
  const hydrated = getInitialHydratedState(initialProjectData);

  const [activeTab, setActiveTab] = useState(hydrated.activeTab);
  const [projectData, setProjectData] = useState(hydrated.projectData);
  const [activeSlot, setActiveSlot] = useState(hydrated.activeSlot);
  const [slotSummaries, setSlotSummaries] = useState(hydrated.slotSummaries);
  const [saveStatus, setSaveStatus] = useState("Ready");

  const currentTab = useMemo(
    () => topNavTabs.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  const currentGuideCard = useMemo(
    () => tabGuideCards.find((card) => card.id === activeTab),
    [activeTab]
  );

  useEffect(() => {
    setLastActiveSlot(activeSlot);
  }, [activeSlot]);

  useEffect(() => {
    if (!hasAnyMeaningfulData(projectData)) {
      return;
    }

    saveProjectToSlot(activeSlot, projectData, activeTab);
    setSlotSummaries(getSlotSummaries());
  }, [projectData, activeTab, activeSlot]);

  const flashStatus = (message) => {
    setSaveStatus(message);
    window.setTimeout(() => setSaveStatus("Ready"), 1800);
  };

  const handleStartNew = () => {
    setActiveTab("ideation");
  };

  const handleSave = () => {
    saveProjectToSlot(activeSlot, projectData, activeTab);
    setSlotSummaries(getSlotSummaries());
    flashStatus(`Saved to Slot ${activeSlot}`);
  };

  const handleSelectSlot = (slotId) => {
    const slotData = loadProjectFromSlot(slotId);

    setActiveSlot(slotId);

    if (slotData?.projectData) {
      setProjectData(slotData.projectData);
      setActiveTab(slotData.activeTab || "home");
      setSlotSummaries(getSlotSummaries());
      flashStatus(`Loaded Slot ${slotId}`);
      return;
    }

    setProjectData(cloneInitialProjectData(initialProjectData));
    setActiveTab("home");
    setSlotSummaries(getSlotSummaries());
    flashStatus(`Started new workspace in Slot ${slotId}`);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <TopNav
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onSave={handleSave}
        onSelectSlot={handleSelectSlot}
        activeSlot={activeSlot}
        slotSummaries={slotSummaries}
        saveStatus={saveStatus}
      />

      <main className="mx-auto max-w-7xl px-3 pb-16 pt-6 sm:px-6 lg:px-8">
        {activeTab === "home" ? (
          <LandingPage
            onNavigate={setActiveTab}
            onStartNew={handleStartNew}
          />
        ) : activeTab === "ideation" ? (
          <IdeationWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onContinueToBasics={() => setActiveTab("project-basics")}
          />
        ) : activeTab === "project-basics" ? (
          <ProjectBasicsWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToIdeation={() => setActiveTab("ideation")}
            onContinueToCharter={() => setActiveTab("charter")}
          />
        ) : activeTab === "charter" ? (
          <CharterWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToBasics={() => setActiveTab("project-basics")}
            onContinueToPlan={() => setActiveTab("plan-studio")}
          />
        ) : activeTab === "plan-studio" ? (
          <PlanStudioWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToCharter={() => setActiveTab("charter")}
            onContinueToValue={() => setActiveTab("value-estimate")}
          />
        ) : activeTab === "value-estimate" ? (
          <ValueEstimateWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToPlan={() => setActiveTab("plan-studio")}
            onContinueToCost={() => setActiveTab("cost-estimate")}
          />
        ) : activeTab === "cost-estimate" ? (
          <CostEstimateWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToValue={() => setActiveTab("value-estimate")}
            onContinueToOutputs={() => setActiveTab("outputs")}
          />
        ) : activeTab === "outputs" ? (
          <OutputsWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToCost={() => setActiveTab("cost-estimate")}
          />
        ) : (
          <PlaceholderWorkspace
            tab={currentTab}
            guide={currentGuideCard}
            onGoHome={() => setActiveTab("home")}
          />
        )}
      </main>
    </div>
  );
}
