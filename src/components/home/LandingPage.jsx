import React, { useMemo, useState } from "react";
import { tabGuideCards } from "../../data/projectBuilderConfig";

function FlowTile({ card, isActive, onClick, index }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-3xl border p-4 text-left transition",
        isActive
          ? "border-orange-300 bg-orange-50 shadow-sm"
          : "border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold",
            isActive
              ? "bg-orange-500 text-white"
              : "bg-sky-100 text-sky-700",
          ].join(" ")}
        >
          {index + 1}
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">
            {card.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
            {card.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function DetailPanel({ card, onNavigate }) {
  if (!card) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Select a section from the Tool Flow to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Section Overview
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {card.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {card.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(card.id)}
          className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Open Section
        </button>
      </div>

      {card.details?.length ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            What this section helps you do
          </h3>

          <ul className="mt-3 space-y-2">
            {card.details.map((detail) => (
              <li
                key={detail}
                className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {card.outputs?.length ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Expected outputs
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {card.outputs.map((output) => (
              <div
                key={output}
                className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {output}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function LandingPage({ onNavigate, onStartNew }) {
  const flowCards = useMemo(() => {
    return tabGuideCards.filter((card) => card.id !== "home");
  }, []);

  const [selectedId, setSelectedId] = useState(
    flowCards.length ? flowCards[0].id : null
  );

  const selectedCard = useMemo(() => {
    return flowCards.find((card) => card.id === selectedId) || flowCards[0];
  }, [flowCards, selectedId]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Project Builder
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Build a project from idea to executive-ready business case.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Move through the tool flow one section at a time: ideation,
              project basics, charter, planning, value, cost, assumptions, and
              outputs.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNew}
            className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Start New Project
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-[2rem] border border-sky-100 bg-sky-50/60 p-5">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Tool Flow
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Sections
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Select a section to view its purpose, details, and expected
              outputs.
            </p>
          </div>

          <div className="space-y-3">
            {flowCards.map((card, index) => (
              <FlowTile
                key={card.id}
                card={card}
                index={index}
                isActive={selectedCard?.id === card.id}
                onClick={() => setSelectedId(card.id)}
              />
            ))}
          </div>
        </div>

        <DetailPanel card={selectedCard} onNavigate={onNavigate} />
      </section>
    </div>
  );
}