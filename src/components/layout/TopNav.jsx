import React from "react";
import { topNavTabs } from "../../data/projectBuilderConfig";

export default function TopNav({ activeTab, onNavigate }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20">
            PB
          </div>
          <div>
            <h1 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Project Builder
            </h1>
            <p className="text-sm text-slate-400">
              Charter · Planning · Value · Cost
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {topNavTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-500/20"
          >
            Save
          </button>

          <button
            type="button"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10"
          >
            Slot 1
          </button>

          <button
            type="button"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10"
          >
            Slot 2
          </button>

          <button
            type="button"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10"
          >
            Slot 3
          </button>

          <button
            type="button"
            className="rounded-full bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-300 ring-1 ring-violet-400/20 hover:bg-violet-500/20"
          >
            Export
          </button>
        </div>
      </div>
    </header>
  );
}