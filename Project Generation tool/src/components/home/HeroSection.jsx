import React from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";

export default function HeroSection({ onNavigate, onStartNew }) {
  return (
    <SectionCard className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40">
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <PillBadge tone="cyan">AI-Assisted Workflow</PillBadge>
            <PillBadge tone="violet">PMBOK-Aligned Planning</PillBadge>
            <PillBadge tone="emerald">Value + Cost Estimation</PillBadge>
          </div>

          <h2 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Project Charter, Planning &amp; Value Builder
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Turn an early idea into a structured project charter, a guided
            PMBOK-aligned project plan, and a high-level value estimate using
            AI-assisted prompts that continuously improve as the project becomes
            more defined.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStartNew}
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Start a New Project
            </button>

            <button
              type="button"
              onClick={() => onNavigate("ideation")}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Open Ideation
            </button>

            <button
              type="button"
              onClick={() => onNavigate("outputs")}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              View Outputs
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">
            What this workspace helps you do
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Brainstorm and shape an early project concept</li>
            <li>• Define goals, measurable outcomes, and scope</li>
            <li>• Generate a project charter from structured intake</li>
            <li>• Build planning content section by section</li>
            <li>• Estimate value, benefit logic, and rough cost</li>
            <li>• Export reusable project documents and summaries</li>
          </ul>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <p className="text-sm font-medium text-cyan-200">
              Product direction
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Start with ideas. Build the charter. Expand the plan. Estimate
              value. Export stakeholder-ready outputs.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}