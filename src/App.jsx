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
import {
  createNewProjectForSlot,
  getInitialHydratedState,
  getSlotSummaries,
  loadProjectFromSlot,
  saveProjectToSlot,
  setLastActiveSlot,
} from "./utils/storageHelpers";
import {
  createBlankProjectData,
  hasAnyMeaningfulData,
  normalizeProjectData,
} from "./utils/projectDataHelpers";

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
    if (!hasAnyMeaningfulData(projectData)) {
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