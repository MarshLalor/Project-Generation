import React from "react";
import SectionCard from "../common/SectionCard";

function TextArea({ value, onChange, placeholder, rows = 16 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  );
}

export default function PromptPanel({
  promptTitle = "AI prompt preview",
  promptSubtitle = "Generate the prompt, then copy it into your AI partner tool.",
  promptText = "",
  onRefreshPrompt,
  onCopyPrompt,
  copyStatus = "idle",
  responseTitle = "Paste AI response",
  responseSubtitle = "Paste the AI response here using the exact requested headings.",
  responseValue = "",
  onResponseChange,
  responsePlaceholder = "",
  responseRows = 16,
  onParseResponse,
  onApplyResponse,
  parseLabel = "Parse AI Response",
  applyLabel = "Apply Response",
  helperTitle = "How to use this panel",
  helperSteps = [],
}) {
  const copyLabel =
    copyStatus === "copied"
      ? "Prompt Copied"
      : copyStatus === "failed"
      ? "Copy Failed"
      : "Copy Prompt";

  return (
    <div className="space-y-6 xl:sticky xl:top-24">
      <SectionCard title={promptTitle} subtitle={promptSubtitle}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {promptText}
            </pre>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {onRefreshPrompt ? (
              <button
                type="button"
                onClick={onRefreshPrompt}
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Refresh Prompt
              </button>
            ) : null}

            {onCopyPrompt ? (
              <button
                type="button"
                onClick={onCopyPrompt}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {copyLabel}
              </button>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard title={responseTitle} subtitle={responseSubtitle}>
        <div className="space-y-4">
          <TextArea
            value={responseValue}
            onChange={onResponseChange}
            placeholder={responsePlaceholder}
            rows={responseRows}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {onParseResponse ? (
              <button
                type="button"
                onClick={onParseResponse}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                {parseLabel}
              </button>
            ) : null}

            {onApplyResponse ? (
              <button
                type="button"
                onClick={onApplyResponse}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {applyLabel}
              </button>
            ) : null}
          </div>
        </div>
      </SectionCard>

      {helperSteps.length > 0 ? (
        <SectionCard
          title={helperTitle}
          subtitle="Recommended workflow for this AI-assisted section."
        >
          <div className="space-y-4">
            {helperSteps.map((step, index) => {
              const isLast = index === helperSteps.length - 1;
              const boxClasses = isLast
                ? "border-orange-200 bg-orange-50"
                : "border-sky-100 bg-sky-50/60";
              const headingClasses = isLast
                ? "text-orange-700"
                : "text-sky-700";

              return (
                <div
                  key={`${index}-${step.title}`}
                  className={`rounded-2xl border p-4 ${boxClasses}`}
                >
                  <p className={`text-sm font-semibold ${headingClasses}`}>
                    {step.title || `Step ${index + 1}`}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}