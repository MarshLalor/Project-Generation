import React from "react";
import SectionCard from "../common/SectionCard";
import PillBadge from "../common/PillBadge";

export default function PlaceholderWorkspace({ tab, guide, onGoHome }) {
  return (
    <div className="space-y-6">
      <SectionCard className="border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <PillBadge tone="blue">Workspace Shell</PillBadge>
              <PillBadge tone="orange">Ready for Next Build Step</PillBadge>
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              {tab?.label || "Workspace"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              This is the placeholder workspace for the{" "}
              <span className="font-medium text-slate-900">
                {tab?.label || "selected"}
              </span>{" "}
              tab. The landing page shell, navigation, flow, and tab guide are
              already wired. This area is ready for the full section UI, prompt
              builder, copy controls, response paste box, parser, and state
              mapping.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 sm:w-auto"
          >
            Back to Home
          </button>
        </div>
      </SectionCard>

      {guide && (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Purpose">
            <p className="text-sm leading-7 text-slate-700">{guide.purpose}</p>
          </SectionCard>

          <SectionCard title="What the user does">
            <p className="text-sm leading-7 text-slate-700">
              {guide.userAction}
            </p>
          </SectionCard>

          <SectionCard title="Expected output">
            <p className="text-sm leading-7 text-slate-700">{guide.output}</p>
          </SectionCard>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Suggested next build step"
          subtitle="Recommended for this tab"
          className="bg-white"
        >
          <ul className="space-y-3 text-sm leading-7 text-slate-700">
            <li>• Add the core section form fields and editable text areas</li>
            <li>• Add a right-side AI prompt preview panel</li>
            <li>• Add Copy Prompt and Paste AI Response actions</li>
            <li>• Add a section parser to apply AI responses back to state</li>
            <li>• Add section-specific output summaries</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Future product behavior"
          subtitle="How this tab should evolve"
          className="bg-sky-50/50"
        >
          <ul className="space-y-3 text-sm leading-7 text-slate-700">
            <li>
              • Use the project charter as the minimum required source of truth
            </li>
            <li>
              • Pull in known information from other sections as they are filled
              out
            </li>
            <li>
              • Keep outputs usable even when only partial project detail exists
            </li>
            <li>
              • Improve AI prompt quality as assumptions, costs, and value
              drivers are added
            </li>
            <li>
              • Eventually support save slots and document downloads from the
              Outputs tab
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}