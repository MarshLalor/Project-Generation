import React from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import { plannedExports } from "../../data/projectBuilderConfig";

export default function PlannedExportsSection() {
  return (
    <SectionCard
      title="Planned export options"
      subtitle="Final outputs will be downloadable as stakeholder-ready documents."
    >
      <div className="space-y-4">
        {plannedExports.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-300">{item.format}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>

              <PillBadge tone="emerald">{item.status}</PillBadge>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}