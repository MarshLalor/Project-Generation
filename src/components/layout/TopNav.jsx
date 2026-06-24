import React from "react";
import { topNavTabs } from "../../data/projectBuilderConfig";

function formatSavedAt(value) {
  if (!value) return "Empty";

  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (error) {
    return "Saved";
  }
}

export default function TopNav({
  activeTab,
  onNavigate,
  onSave,
  onSelectSlot,
  activeSlot = 1,
  slotSummaries = [],
  saveStatus = "Ready",
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 ring-1 ring-sky-200">
              PB
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                Project Builder
              </h1>
              <p className="truncate text-sm text-slate-600">
                Charter · Planning · Value · Cost
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onSave}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Save to Slot {activeSlot}
            </button>

            <div className="flex flex-wrap gap-2">
              {slotSummaries.map((slot) => {
                const isActive = slot.id === activeSlot;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    title={
                      slot.isEmpty
                        ? `Slot ${slot.id} is empty`
                        : `${slot.projectTitle} • ${formatSavedAt(slot.savedAt)}`
                    }
                    className={[
                      "min-w-[98px] rounded-2xl border px-3 py-2 text-left transition",
                      isActive
                        ? "border-sky-300 bg-sky-100 text-sky-800"
                        : "border-sky-200 bg-sky-50 text-slate-700 hover:bg-sky-100",
                    ].join(" ")}
                  >
                    <div className="text-xs font-semibold">Slot {slot.id}</div>
                    <div className="mt-1 truncate text-[11px] text-slate-600">
                      {slot.isEmpty ? "Empty" : slot.projectTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
              {saveStatus}
            </div>
          </div>
        </div>

        <nav className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-1">
            {topNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className={[
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : "border border-sky-200 bg-white text-slate-700 hover:bg-sky-50",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
