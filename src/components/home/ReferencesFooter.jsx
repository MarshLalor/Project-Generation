import React from "react";
import SectionCard from "../common/SectionCard";
import { referenceLinks } from "../../data/projectBuilderConfig";

export default function ReferencesFooter() {
  return (
    <SectionCard
      title="Reference sources & planning foundations"
      subtitle="These links help explain the frameworks, delivery approaches, and estimation sources that can support the tool."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {referenceLinks.map((group) => (
          <div
            key={group.group}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-5"
          >
            <h3 className="text-base font-semibold text-white">{group.group}</h3>

            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-cyan-300 transition hover:text-cyan-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}