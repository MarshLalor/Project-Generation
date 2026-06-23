import React from "react";
import SectionCard from "../common/SectionCard";
import { tabGuideCards } from "../../data/projectBuilderConfig";

export default function TabGuideSection({ onNavigate }) {
  return (
    <SectionCard
      title="Tab guide"
      subtitle="Each tab has a distinct purpose, user action, and expected output."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {tabGuideCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onNavigate(card.id)}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 text-left transition hover:border-cyan-400/30 hover:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Purpose
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {card.purpose}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  User does
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {card.userAction}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Expected output
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {card.output}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
