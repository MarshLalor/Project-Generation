import React from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";
import { deliverables } from "../../data/projectBuilderConfig";

export default function OutputsSection() {
  return (
    <SectionCard
      title="What this tool will produce"
      subtitle="The workspace is designed to continuously build reusable planning and estimation outputs."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {deliverables.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-5"
          >
            <div className="mb-3">
              <PillBadge tone="amber">{item.status}</PillBadge>
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}