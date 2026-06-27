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
import AssumptionsWorkspace from "./components/workspace/AssumptionsWorkspace";
import OutputsWorkspace from "./components/workspace/OutputsWorkspace";
import { topNavTabs, tabGuideCards } from "./data/projectBuilderConfig";
import NextStepBanner from "./components/common/NextStepBanner";
import {
  clearProjectSlot,
  createNewProjectForSlot,
  duplicateProjectSlot,
  getFirstAvailableSlot,
  getInitialHydratedState,
  getSlotSummaries,
  loadProjectFromSlot,
  renameProjectSlot,
  saveProjectToSlot,
  setLastActiveSlot,
} from "./utils/storageHelpers";
import {
  createBlankProjectData,
  normalizeProjectData,
} from "./utils/projectDataHelpers";

function hasText(value) {
  return !!(value && String(value).trim());
}

function rowHasContent(row) {
  return Object.values(row || {}).some((value) => hasText(value));
}

function shouldAutoSaveProject(projectData) {
  const basics = projectData?.projectBasics || {};
  const ideation = projectData?.ideation || {};
  const charter = projectData?.charter || {};
  const planSections = projectData?.planStudio?.sections || {};
  const valueEstimate = projectData?.valueEstimate || {};
  const costEstimate = projectData?.costEstimate || {};
  const assumptions = projectData?.assumptions || {};
  const businessCase = projectData?.businessCase || {};
  const executiveSummary = projectData?.executiveSummary || {};

  return (
    hasText(basics.title) ||
    hasText(basics.businessProblem) ||
    hasText(basics.projectObjective) ||
    hasText(basics.expectedBusinessOutcome) ||
    hasText(ideation.spark) ||
    hasText(ideation.currentPain) ||
    hasText(charter.charterText) ||
    Object.values(planSections).some((section) =>
      hasText(section?.draftContent)
    ) ||
    hasText(valueEstimate.likelyValueDrivers) ||
    hasText(valueEstimate.preliminaryValueModel) ||
    hasText(costEstimate.costCategories) ||
    hasText(costEstimate.preliminaryCostSummary) ||
    assumptions?.laborRates?.roles?.some(rowHasContent) ||
    assumptions?.effortAssumptions?.items?.some(rowHasContent) ||
    assumptions?.volumeAssumptions?.items?.some(rowHasContent) ||
    assumptions?.benchmarkAssumptions?.items?.some(rowHasContent) ||
    hasText(assumptions.openQuestions) ||
    hasText(businessCase?.valueInputs?.annualSavedHours) ||
    hasText(businessCase?.costInputs?.softwareCost) ||
    hasText(executiveSummary.summaryText)
  );
}

export default function App() {
  const hydrated = useMemo(() => getInitialHydratedState(), []);

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
    if (!shouldAutoSaveProject(projectData)) {
      return;
    }

    const normalized = normalizeProjectData(projectData);
    saveProjectToSlot(activeSlot, normalized, activeTab);
    setSlotSummaries(getSlotSummaries());
  }, [projectData, activeTab, activeSlot]);

  const flashStatus = (message) => {
    setSaveStatus(message);
    window.setTimeout(() => setSaveStatus("Ready"), 1800);
  };

  const handleStartNew = () => {
    setProjectData(createBlankProjectData());
    setActiveTab("ideation");
    flashStatus(`New project started in Slot ${activeSlot}`);
  };

  const handleSave = () => {
    const normalized = normalizeProjectData(projectData);
    saveProjectToSlot(activeSlot, normalized, activeTab);
    setProjectData(normalized);
    setSlotSummaries(getSlotSummaries());
    flashStatus(`Saved to Slot ${activeSlot}`);
  };

  const handleSelectSlot = (slotId) => {
    const slotData = loadProjectFromSlot(slotId);

    setActiveSlot(slotId);

    if (slotData?.projectData) {
      const normalized = normalizeProjectData(slotData.projectData);
      setProjectData(normalized);
      setActiveTab(slotData.activeTab || "home");
      setSlotSummaries(getSlotSummaries());
      flashStatus(`Loaded Slot ${slotId}`);
      return;
    }

    const next = createNewProjectForSlot(slotId);
    setProjectData(next.projectData);
    setActiveTab(next.activeTab);
    setSlotSummaries(next.slotSummaries);
    flashStatus(`Started new workspace in Slot ${slotId}`);
  };

  const handleRenameSlot = () => {
    const currentSummary = slotSummaries.find((slot) => slot.id === activeSlot);
    const currentName = currentSummary?.slotName || `Slot ${activeSlot}`;

    const nextName = window.prompt("Rename this save slot:", currentName);

    if (!nextName || !nextName.trim()) {
      return;
    }

    renameProjectSlot(activeSlot, nextName.trim());
    setSlotSummaries(getSlotSummaries());
    flashStatus(`Renamed Slot ${activeSlot}`);
  };

  const handleClearSlot = () => {
    const currentSummary = slotSummaries.find((slot) => slot.id === activeSlot);
    const slotName = currentSummary?.slotName || `Slot ${activeSlot}`;

    const confirmed = window.confirm(
      `Clear ${slotName}? This removes the saved project from this slot.`
    );

    if (!confirmed) {
      return;
    }

    clearProjectSlot(activeSlot);
    setProjectData(createBlankProjectData());
    setActiveTab("home");
    setSlotSummaries(getSlotSummaries());
    flashStatus(`Cleared ${slotName}`);
  };

  const handleDuplicateSlot = () => {
    const sourceSlot = slotSummaries.find((slot) => slot.id === activeSlot);

    if (!sourceSlot || sourceSlot.isEmpty) {
      flashStatus(`Slot ${activeSlot} is empty`);
      return;
    }

    const firstAvailable = getFirstAvailableSlot(activeSlot);

    let targetSlot = firstAvailable;

    if (!targetSlot) {
      const answer = window.prompt(
        "All other slots have content. Enter target slot number to overwrite: 1, 2, or 3"
      );

      const parsed = Number(answer);

      if (![1, 2, 3].includes(parsed) || parsed === activeSlot) {
        flashStatus("Duplicate cancelled");
        return;
      }

      const targetSummary = slotSummaries.find((slot) => slot.id === parsed);
      const targetName = targetSummary?.slotName || `Slot ${parsed}`;

      const confirmed = window.confirm(
        `Overwrite ${targetName} with a copy of ${sourceSlot.slotName}?`
      );

      if (!confirmed) {
        flashStatus("Duplicate cancelled");
        return;
      }

      targetSlot = parsed;
    }

    const result = duplicateProjectSlot(activeSlot, targetSlot);

    if (!result.ok) {
      flashStatus(result.message);
      return;
    }

    const loaded = loadProjectFromSlot(targetSlot);

    setActiveSlot(targetSlot);
    setProjectData(loaded?.projectData || createBlankProjectData());
    setActiveTab(loaded?.activeTab || "home");
    setSlotSummaries(getSlotSummaries());
    flashStatus(result.message);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <TopNav
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onSave={handleSave}
        onSelectSlot={handleSelectSlot}
        onRenameSlot={handleRenameSlot}
        onClearSlot={handleClearSlot}
        onDuplicateSlot={handleDuplicateSlot}
        activeSlot={activeSlot}
        slotSummaries={slotSummaries}
        saveStatus={saveStatus}
      />

      <main className="mx-auto max-w-7xl px-3 pb-16 pt-6 sm:px-6 lg:px-8">
		{activeTab !== "home" ? (
		  <div className="mb-6">
		    <NextStepBanner
		      projectData={projectData}
		      activeTab={activeTab}
		      onNavigate={setActiveTab}
		    />
		  </div>
		) : null}
        {activeTab === "home" ? (
         	<LandingPage
 		  projectData={projectData}
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
            onContinueToOutputs={() => setActiveTab("assumptions")}
            onContinueToAssumptions={() => setActiveTab("assumptions")}
          />
        ) : activeTab === "assumptions" ? (
          <AssumptionsWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToCost={() => setActiveTab("cost-estimate")}
            onContinueToOutputs={() => setActiveTab("outputs")}
          />
        ) : activeTab === "outputs" ? (
          <OutputsWorkspace
            projectData={projectData}
            setProjectData={setProjectData}
            onGoHome={() => setActiveTab("home")}
            onBackToCost={() => setActiveTab("assumptions")}
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