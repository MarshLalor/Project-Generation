import React, { useMemo, useState } from "react";
import { tabGuideCards } from "../../data/projectBuilderConfig";
import {
  getFlowStatusMap,
  getNextRecommendedStep,
} from "../../utils/flowHelpers";

function StatusBadge({ status }) {
  const classes =
    status === "completed"
      ? "bg-sky-100 text-sky-700"
      : status === "next"
      ? "bg-orange-100 text-orange-700"
      : status === "needs-work"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-slate-100 text-slate-600";

  const label =
    status === "completed"
      ? "Completed"
      : status === "next"
      ? "Next best step"
      : status === "needs-work"
      ? "Needs work"
      : "Not started";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

function FlowTile({ card, flowStatus, isActive, onClick, index }) {
  const isNext = flowStatus?.status === "next";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-3xl border p-4 text-left transition",
        isActive || isNext
          ? "border-orange-300 bg-orange-50 shadow-sm"
          : "border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold",
            isActive || isNext
              ? "bg-orange-500 text-white"
              : flowStatus?.status === "completed"
              ? "bg-sky-600 text-white"
              : "bg-sky-100 text-sky-700",
          ].join(" ")}
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              {card.title}
            </h3>

            {flowStatus ? <StatusBadge status={flowStatus.status} /> : null}
          </div>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
            {card.description}
          </p>

          {flowStatus ? (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={[
                  "h-full rounded-full",
                  flowStatus.status === "completed"
                    ? "bg-sky-500"
                    : flowStatus.status === "next"
                    ? "bg-orange-500"
                    : "bg-yellow-400",
                ].join(" ")}
                style={{ width: `${flowStatus.score.percent}%` }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function DetailPanel({ card, flowStatus, onNavigate }) {
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
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              Section Overview
            </p>

            {flowStatus ? <StatusBadge status={flowStatus.status} /> : null}
          </div>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {card.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {card.description}
          </p>

          {flowStatus?.reason ? (
            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <span className="font-semibold text-orange-700">
                Recommended focus:
              </span>{" "}
              {flowStatus.reason}
            </div>
          ) : null}
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

export default function LandingPage({ projectData, onNavigate, onStartNew }) {
  const flowStatuses = useMemo(
    () => getFlowStatusMap(projectData),
    [projectData]
  );

  const nextStep = useMemo(
    () => getNextRecommendedStep(projectData),
    [projectData]
  );

  const flowCards = useMemo(() => {
    return tabGuideCards.filter((card) => card.id !== "home");
  }, []);

  const [selectedId, setSelectedId] = useState(nextStep?.id || flowCards[0]?.id);

  const selectedCard = useMemo(() => {
    return flowCards.find((card) => card.id === selectedId) || flowCards[0];
  }, [flowCards, selectedId]);

  const selectedStatus = useMemo(() => {
    return flowStatuses.find((item) => item.id === selectedCard?.id);
  }, [flowStatuses, selectedCard]);

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
              Move through the tool flow one section at a time. Nothing is
              locked — the app highlights the next best step while letting you
              move freely.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {nextStep ? (
              <button
                type="button"
                onClick={() => onNavigate(nextStep.id)}
                className="rounded-2xl border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                Continue: {nextStep.shortLabel}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onStartNew}
              className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Start New Project
            </button>
          </div>
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
              Select a section to view its purpose, progress, and expected
              outputs.
            </p>
          </div>

          <div className="space-y-3">
            {flowCards.map((card, index) => {
              const flowStatus = flowStatuses.find(
                (status) => status.id === card.id
              );

              return (
                <FlowTile
                  key={card.id}
                  card={card}
                  flowStatus={flowStatus}
                  index={index}
                  isActive={selectedCard?.id === card.id}
                  onClick={() => setSelectedId(card.id)}
                />
              );
            })}
          </div>
        </div>

        <DetailPanel
          card={selectedCard}
          flowStatus={selectedStatus}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
}