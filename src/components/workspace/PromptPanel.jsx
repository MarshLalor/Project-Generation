import React, { useMemo, useState } from "react";
import { buildFollowUpFirstPrompt } from "../../utils/aiPromptModeHelpers";

function PanelButton({ children, onClick, variant = "default" }) {
  const classes =
    variant === "primary"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "border border-sky-200 bg-white text-slate-700 hover:bg-sky-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${classes}`}
    >
      {children}
    </button>
  );
}

export default function PromptPanel({
  promptTitle = "AI Prompt",
  promptSubtitle = "Generate, preview, and copy the prompt.",
  promptSectionName = "Current Section",
  promptText = "",
  onRefreshPrompt,
  responseTitle = "Paste AI response",
  responseSubtitle = "Paste the AI response here.",
  responseValue = "",
  onResponseChange,
  responsePlaceholder = "",
  responseRows = 12,
  onParseResponse,
  onApplyResponse,
  parseLabel = "Parse Response",
  applyLabel = "Apply Response",
  helperTitle = "How to use this section",
  helperSteps = [],
  useFollowUpFirstMode = true,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const [isPromptPreviewOpen, setIsPromptPreviewOpen] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(true);

  const effectivePromptText = useMemo(() => {
    if (!useFollowUpFirstMode) {
      return promptText || "";
    }

    return buildFollowUpFirstPrompt({
      sectionName: promptSectionName,
      basePrompt: promptText || "",
    });
  }, [promptText, promptSectionName, useFollowUpFirstMode]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(effectivePromptText);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  const copyLabel =
    copyStatus === "copied"
      ? "Prompt Copied"
      : copyStatus === "failed"
      ? "Copy Failed"
      : "Copy Prompt";

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {promptTitle}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {promptSubtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <PanelButton onClick={onRefreshPrompt} variant="primary">
              Generate Prompt for {promptSectionName}
            </PanelButton>

            <PanelButton
              onClick={() => setIsPromptPreviewOpen((prev) => !prev)}
            >
              {isPromptPreviewOpen ? "Hide Prompt Preview" : "Show Prompt Preview"}
            </PanelButton>

            <PanelButton onClick={handleCopyPrompt}>{copyLabel}</PanelButton>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-700">
            Follow-up-first mode enabled
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            The copied prompt asks the AI to review previous context and ask
            follow-up questions before generating the full final output.
          </p>
        </div>

        {isPromptPreviewOpen ? (
          <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {effectivePromptText || "No prompt generated yet."}
            </pre>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {responseTitle}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {responseSubtitle}
          </p>
        </div>

        <textarea
          value={responseValue || ""}
          onChange={onResponseChange}
          placeholder={responsePlaceholder}
          rows={responseRows}
          className="mt-4 w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {onParseResponse ? (
            <PanelButton onClick={onParseResponse}>{parseLabel}</PanelButton>
          ) : null}

          {onApplyResponse ? (
            <PanelButton onClick={onApplyResponse} variant="primary">
              {applyLabel}
            </PanelButton>
          ) : null}
        </div>
      </section>

      {helperSteps.length ? (
        <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setIsHelperOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {helperTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                View recommended workflow steps.
              </p>
            </div>

            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
              {isHelperOpen ? "Hide" : "Show"}
            </span>
          </button>

          {isHelperOpen ? (
            <div className="mt-4 space-y-3">
              {helperSteps.map((step) => (
                <div
                  key={`${step.title}-${step.body}`}
                  className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4"
                >
                  <p className="text-sm font-semibold text-sky-700">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}