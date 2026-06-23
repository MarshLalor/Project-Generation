import React from "react";

import SectionCard from "../common/SectionCard";

import PillBadge from "../common/PillBadge";

 

export default function HeroSection({ onNavigate, onStartNew }) {

  return (

    <SectionCard className="overflow-hidden border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-100">

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

        <div>

          <div className="mb-4 flex flex-wrap items-center gap-2">

            <PillBadge tone="blue">AI-Assisted Workflow</PillBadge>

            <PillBadge tone="softBlue">PMBOK-Aligned Planning</PillBadge>

            <PillBadge tone="orange">Value + Cost Estimation</PillBadge>

          </div>

 

          <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">

            Project Charter, Planning &amp; Value Builder

          </h2>

 

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">

            Turn an early idea into a structured project charter, a guided

            PMBOK-aligned project plan, and a high-level value estimate using

            AI-assisted prompts that continuously improve as the project becomes

            more defined.

          </p>

 

          <div className="mt-6 flex flex-wrap gap-3">

            <button

              type="button"

              onClick={onStartNew}

              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"

            >

              Start a New Project

            </button>

 

            <button

              type="button"

              onClick={() => onNavigate("ideation")}

              className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"

            >

              Open Ideation

            </button>

 

            <button

              type="button"

              onClick={() => onNavigate("outputs")}

              className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"

            >

              View Outputs

            </button>

          </div>

        </div>

 

        <div className="rounded-3xl border border-sky-200 bg-white/90 p-5 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">

            What this workspace helps you do

          </h3>

 

          <ul className="mt-4 space-y-3 text-sm text-slate-700">

            <li>• Brainstorm and shape an early project concept</li>

            <li>• Define goals, measurable outcomes, and scope</li>

            <li>• Generate a project charter from structured intake</li>

            <li>• Build planning content section by section</li>

            <li>• Estimate value, benefit logic, and rough cost</li>

            <li>• Export reusable project documents and summaries</li>

          </ul>

 

          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">

            <p className="text-sm font-medium text-orange-700">

              Product direction

            </p>

            <p className="mt-1 text-sm text-slate-700">

              Start with ideas. Build the charter. Expand the plan. Estimate

              value. Export stakeholder-ready outputs.

            </p>

          </div>

        </div>

      </div>

    </SectionCard>

  );

}

