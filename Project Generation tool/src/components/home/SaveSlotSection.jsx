import React from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import { saveSlots } from "../../data/projectBuilderConfig";

export default function SaveSlotsSection() {
  return (
    <SectionCard
      title="Project save slots"
      subtitle="The tool is planned to support up to 3 project save slots so users can continue work over time."
    >
      <div className="space-y-4">
        {saveSlots.map((slot) => (
          <div
            key={slot.id}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {slot.title}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  {slot.projectName}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {slot.detail}
                </p>
              </div>

              <PillBadge tone="violet">{slot.status}</PillBadge>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}