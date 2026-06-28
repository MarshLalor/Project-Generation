import React, { useState } from "react";
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
  onRenameSlot,
  onClearSlot,
  onDuplicateSlot,
  activeSlot = 1,
  slotSummaries = [],
  saveStatus = "Ready",
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeSlotSummary = slotSummaries.find(
    (slot) => slot.id === activeSlot
  );

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-bold text-sky-700 ring-1 ring-sky-200">
              PB
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Project Builder
              </h1>
              <p className="truncate text-xs text-slate-600 sm:text-sm">
                {activeSlotSummary?.slotName || `Slot ${activeSlot}`} ·{" "}
                {activeSlotSummary?.isEmpty
                  ? "Empty"
                  : activeSlotSummary?.projectTitle || "Untitled Project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 lg:hidden"
          >
            {isMobileOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={onSave}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Save to Slot {activeSlot}
            </button>

            <button
              type="button"
              onClick={onRenameSlot}
              className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
            >
              Rename
            </button>

            <button
              type="button"
              onClick={onDuplicateSlot}
              className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
            >
              Duplicate
            </button>

            <button
              type="button"
              onClick={onClearSlot}
              className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
            >
              Clear
            </button>

            <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
              {saveStatus}
            </div>
          </div>
        </div>

        <div className="mt-3 hidden lg:block">
          <div className="flex flex-wrap justify-end gap-2">
            {slotSummaries.map((slot) => {
              const isActive = slot.id === activeSlot;

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(slot.id)}
                  title={
                    slot.isEmpty
                      ? `${slot.slotName} is empty`
                      : `${slot.slotName}: ${slot.projectTitle} · ${formatSavedAt(
                          slot.savedAt
                        )}`
                  }
                  className={[
                    "min-w-[120px] rounded-2xl border px-3 py-2 text-left transition",
                    isActive
                      ? "border-sky-300 bg-sky-100 text-sky-800"
                      : "border-sky-200 bg-sky-50 text-slate-700 hover:bg-sky-100",
                  ].join(" ")}
                >
                  <div className="truncate text-xs font-semibold">
                    {slot.slotName}
                  </div>
                  <div className="mt-1 truncate text-[11px] text-slate-600">
                    {slot.isEmpty ? "Empty" : slot.projectTitle}
                  </div>
                  <div className="mt-1 truncate text-[10px] text-slate-500">
                    {formatSavedAt(slot.savedAt)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <nav className="mt-3 hidden overflow-x-auto pb-1 lg:block">
          <div className="flex min-w-max gap-2">
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

        {isMobileOpen ? (
          <div className="mt-4 space-y-4 lg:hidden">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onSave}
                className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Save to Slot {activeSlot}
              </button>

              <button
                type="button"
                onClick={onRenameSlot}
                className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Rename Slot
              </button>

              <button
                type="button"
                onClick={onDuplicateSlot}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Duplicate Slot
              </button>

              <button
                type="button"
                onClick={onClearSlot}
                className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
              >
                Clear Slot
              </button>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-medium text-orange-700">
              {saveStatus}
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {slotSummaries.map((slot) => {
                const isActive = slot.id === activeSlot;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    className={[
                      "rounded-2xl border px-3 py-3 text-left transition",
                      isActive
                        ? "border-sky-300 bg-sky-100 text-sky-800"
                        : "border-sky-200 bg-white text-slate-700 hover:bg-sky-50",
                    ].join(" ")}
                  >
                    <div className="truncate text-xs font-semibold">
                      {slot.slotName}
                    </div>
                    <div className="mt-1 truncate text-[11px] text-slate-600">
                      {slot.isEmpty ? "Empty" : slot.projectTitle}
                    </div>
                    <div className="mt-1 truncate text-[10px] text-slate-500">
                      {formatSavedAt(slot.savedAt)}
                    </div>
                  </button>
                );
              })}
            </div>

            <nav className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {topNavTabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        onNavigate(tab.id);
                        setIsMobileOpen(false);
                      }}
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
        ) : null}
      </div>
    </header>
  );
}