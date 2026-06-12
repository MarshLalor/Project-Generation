import React, { useMemo, useState } from "react";
import TopNav from "./components/layout/TopNav";
import LandingPage from "./components/home/LandingPage";
import PlaceholderWorkspace from "./components/workspace/PlaceholderWorkspace";
import { topNavTabs, tabGuideCards } from "./data/projectBuilderConfig";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const currentTab = useMemo(
    () => topNavTabs.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  const currentGuideCard = useMemo(
    () => tabGuideCards.find((card) => card.id === activeTab),
    [activeTab]
  );

  const handleStartNew = () => {
    setActiveTab("ideation");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {activeTab === "home" ? (
          <LandingPage
            onNavigate={setActiveTab}
            onStartNew={handleStartNew}
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