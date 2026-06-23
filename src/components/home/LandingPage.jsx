import React from "react";
import HeroSection from "./HeroSection";
import FlowSection from "./FlowSection";
import TabGuideSection from "./TabGuideSection";
import OutputsSection from "./OutputsSection";
import SaveSlotsSection from "./SaveSlotsSection";
import PlannedExportsSection from "./PlannedExportsSection";
import ReferencesFooter from "./ReferencesFooter";
 
export default function LandingPage({ onNavigate, onStartNew }) {
  return (
    <div className="space-y-8">
      <HeroSection onNavigate={onNavigate} onStartNew={onStartNew} />
      <FlowSection onNavigate={onNavigate} />
      <TabGuideSection onNavigate={onNavigate} />
      <OutputsSection />
      <div className="grid gap-8 lg:grid-cols-2">
        <SaveSlotsSection />
        <PlannedExportsSection />
      </div>
      <ReferencesFooter />
    </div>
  );
}