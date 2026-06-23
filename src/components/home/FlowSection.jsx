import React from "react";
import SectionCard from "../common/SectionCard";
import { flowSteps } from "../../data/projectBuilderConfig";

export default function FlowSection({ onNavigate }) {
  return (
    <SectionCard
      title="How the tool flows"
      subtitle="Move from an initial idea to a structured charter, guided planning, and exportable project outputs."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {flowSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onNavigate(step.id)}
            className="group rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-left transition hover:border-cyan-400/30 hover:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/15 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-400/20">
                {index + 1}
              </span>
              {index < flowSteps.length - 1 && (
                <span className="text-slate-500 transition group-hover:text-cyan-300">
                  →
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {step.description}
            </p>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
