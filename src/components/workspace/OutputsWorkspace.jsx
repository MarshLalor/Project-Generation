import React, { useMemo, useState } from "react";
import BuilderLayout from "./BuilderLayout";
import SectionCard from "../common/SectionCard";
import PromptPanel from "./PromptPanel";
import OutputSummaryCard from "./OutputSummaryCard";
import {
  buildOutputsPayload,
  getOutputsReadiness,
} from "../../utils/outputsHelpers";
import {
  buildExecutiveSummaryPrompt,
  parseExecutiveSummaryResponse,
} from "../../utils/executiveSummaryHelpers";
import {
  createExportFileName,
  downloadMarkdownFile,
  downloadTextFile,
} from "../../utils/exportHelpers";

function OutputPreviewCard({ title, value, onCopy, copyLabel, accent = "sky" }) {
  const borderClasses =
    accent === "orange"
      ? "border-orange-200 bg-orange-50"
      : "border-sky-100 bg-sky-50/60";

  return (
    <div className={`rounded-3xl border p-5 ${borderClasses}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            Preview of the compiled output text.
          </p>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-sky-200 transition hover:bg-sky-50"
        >
          {copyLabel}
        </button>
      </div>

      <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-white/70 bg-white p-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {value || "No output generated yet."}
        </pre>
      </div>
    </div>
  );
}

function StatusPill({ ready }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-medium",
        ready ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {ready ? "Ready" : "In progress"}
    </span>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
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

function FieldLabel({ label, helper }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function DownloadButton({ label, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-5 py-3 text-left text-sm transition",
        primary
          ? "bg-orange-500 font-semibold text-white hover:bg-orange-600"
          : "border border-sky-200 bg-white font-medium text-slate-700 hover:bg-sky-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function OutputsWorkspace({
  projectData,
  setProjectData,
  onGoHome,
  onBackToCost,
}) {
  const [copyState, setCopyState] = useState("idle");
  const [promptCopyStatus, setPromptCopyStatus] = useState("idle");
  const [downloadStatus, setDownloadStatus] = useState("No recent download.");

  const outputs = useMemo(() => buildOutputsPayload(projectData), [projectData]);

  const readiness = useMemo(
    () => getOutputsReadiness(projectData),
    [projectData]
  );

  const executiveSummary = projectData.executiveSummary || {};

  const executivePrompt = useMemo(() => {
    return executiveSummary.promptText && executiveSummary.promptText.trim()
      ? executiveSummary.promptText
      : buildExecutiveSummaryPrompt(projectData, outputs);
  }, [executiveSummary.promptText, projectData, outputs]);

  const updateExecutiveSummaryField = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        [field]: value,
      },
    }));
  };

  const buildAndSaveExecutivePrompt = () => {
    const promptText = buildExecutiveSummaryPrompt(projectData, outputs);

    setProjectData((prev) => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        promptText,
      },
    }));
  };

  const handleCopyExecutivePrompt = async () => {
    try {
      await navigator.clipboard.writeText(executivePrompt || "");
      setPromptCopyStatus("copied");
      window.setTimeout(() => setPromptCopyStatus("idle"), 1800);
    } catch (error) {
      setPromptCopyStatus("failed");
      window.setTimeout(() => setPromptCopyStatus("idle"), 2200);
    }
  };

  const handleParseExecutiveSummary = () => {
    const parsed = parseExecutiveSummaryResponse(executiveSummary.aiResponse);

    setProjectData((prev) => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        ...parsed,
      },
    }));
  };

  const copyText = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopyState(label);
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch (error) {
      setCopyState("Copy Failed");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  };

  const downloadOutput = (sectionName, content, extension = "txt") => {
    const fileName = createExportFileName(projectData, sectionName);

    if (extension === "md") {
      downloadMarkdownFile({
        content,
        fileName,
      });
    } else {
      downloadTextFile({
        content,
        fileName,
      });
    }

    setDownloadStatus(`Downloaded ${sectionName}`);
    window.setTimeout(() => setDownloadStatus("No recent download."), 2200);
  };

  const handleRefreshOutputs = () => {
    setProjectData((prev) => ({ ...prev }));
  };

  return (
    <BuilderLayout
      badges={[
        { label: "Outputs Studio", tone: "blue" },
        { label: "Real Downloads", tone: "softBlue" },
        { label: "Export-Ready Foundation", tone: "orange" },
      ]}
      title="Outputs Workspace"
      description="Compile and download the executive summary, project charter, plan summary, value summary, cost summary, scenario summary, assumptions register, open questions, and full output pack."
      actions={
        <>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 sm:w-auto"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={onBackToCost}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 sm:w-auto"
          >
            Back to Assumptions
          </button>

          <button
            type="button"
            onClick={handleRefreshOutputs}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Refresh Outputs
          </button>
        </>
      }
      progress={{
        percent: readiness.percent,
        completed: readiness.completed,
        total: readiness.total,
        metricLabel: "Deliverable completeness",
        detail: `${readiness.completed} of ${readiness.total} core outputs ready`,
        secondaryLabel: "Export-ready package",
        secondaryText:
          "The final package can now be copied or downloaded as text/markdown files. This prepares the app for future DOCX/PDF export.",
      }}
      left={
        <>
          <SectionCard
            title="Output readiness"
            subtitle="This shows how complete the current deliverables are based on work completed across the tool."
          >
            <div className="space-y-3">
              {readiness.checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3"
                >
                  <span className="text-sm text-slate-700">{check.label}</span>
                  <StatusPill ready={check.ready} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Executive summary fields"
            subtitle="Use these fields to refine the sponsor-ready decision summary."
          >
            <div className="grid gap-5">
              <div>
                <FieldLabel label="Executive Summary" />
                <TextArea
                  value={executiveSummary.summaryText || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField("summaryText", e.target.value)
                  }
                  rows={5}
                  placeholder="Concise sponsor-ready overview of the project, outcome, and business case."
                />
              </div>

              <div>
                <FieldLabel label="Decision Ask" />
                <TextArea
                  value={executiveSummary.decisionAsk || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField("decisionAsk", e.target.value)
                  }
                  rows={3}
                  placeholder="What decision, approval, funding, or next step is being requested?"
                />
              </div>

              <div>
                <FieldLabel label="Recommendation" />
                <TextArea
                  value={executiveSummary.recommendation || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField("recommendation", e.target.value)
                  }
                  rows={3}
                  placeholder="Recommended direction based on current facts and assumptions."
                />
              </div>

              <div>
                <FieldLabel label="Key Benefits" />
                <TextArea
                  value={executiveSummary.keyBenefits || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField("keyBenefits", e.target.value)
                  }
                  rows={4}
                  placeholder="Summarize major benefits, value drivers, and outcome improvements."
                />
              </div>

              <div>
                <FieldLabel label="Key Costs / Investment" />
                <TextArea
                  value={executiveSummary.keyCosts || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryFields", e.target.value)
                  }
                  rows={4}
                  placeholder="Summarize investment, Year 1 cost, recurring cost, and cost confidence."
                />
              </div>

              <div>
                <FieldLabel label="Scenario Takeaway" />
                <TextArea
                  value={executiveSummary.scenarioTakeaway || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField(
                      "scenarioTakeaway",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Summarize low / expected / high scenario implications."
                />
              </div>

              <div>
                <FieldLabel label="Key Risks / Assumptions" />
                <TextArea
                  value={executiveSummary.risksAssumptions || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField(
                      "risksAssumptions",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Summarize important assumptions, risks, and open validation needs."
                />
              </div>

              <div>
                <FieldLabel label="Recommended Next Steps" />
                <TextArea
                  value={executiveSummary.nextSteps || ""}
                  onChange={(e) =>
                    updateExecutiveSummaryField("nextSteps", e.target.value)
                  }
                  rows={4}
                  placeholder="List practical next steps for approval, validation, planning, or pilot."
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Quick copy actions"
            subtitle="Use these to copy the compiled outputs without scrolling through each preview."
          >
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  copyText(outputs.executiveSummary, "Executive Summary Copied")
                }
                className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-left text-sm font-medium text-orange-700 transition hover:bg-orange-100"
              >
                Copy Executive Summary
              </button>

              <button
                type="button"
                onClick={() => copyText(outputs.charterText, "Charter Copied")}
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Charter
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.projectPlanSummary, "Plan Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Project Plan Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.valueSummary, "Value Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Value Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.costSummary, "Cost Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Cost Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.scenarioSummary, "Scenario Summary Copied")
                }
                className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Copy Scenario Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(outputs.fullOutputPack, "Full Output Pack Copied")
                }
                className="rounded-2xl bg-orange-500 px-5 py-3 text-left text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Copy Full Output Pack
              </button>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-sm font-semibold text-sky-700">Copy status</p>
                <p className="mt-2 text-sm text-slate-700">
                  {copyState === "idle" ? "No recent copy action." : copyState}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Download outputs"
            subtitle="Download individual deliverables or the full output pack as text or markdown files."
          >
            <div className="grid gap-3">
              <DownloadButton
                label="Download Executive Summary (.txt)"
                onClick={() =>
                  downloadOutput(
                    "Executive Summary",
                    outputs.executiveSummary,
                    "txt"
                  )
                }
              />

              <DownloadButton
                label="Download Charter (.txt)"
                onClick={() =>
                  downloadOutput("Project Charter", outputs.charterText, "txt")
                }
              />

              <DownloadButton
                label="Download Project Plan Summary (.txt)"
                onClick={() =>
                  downloadOutput(
                    "Project Plan Summary",
                    outputs.projectPlanSummary,
                    "txt"
                  )
                }
              />

              <DownloadButton
                label="Download Value Summary (.txt)"
                onClick={() =>
                  downloadOutput("Value Summary", outputs.valueSummary, "txt")
                }
              />

              <DownloadButton
                label="Download Cost Summary (.txt)"
                onClick={() =>
                  downloadOutput("Cost Summary", outputs.costSummary, "txt")
                }
              />

              <DownloadButton
                label="Download Scenario Summary (.txt)"
                onClick={() =>
                  downloadOutput(
                    "Scenario Summary",
                    outputs.scenarioSummary,
                    "txt"
                  )
                }
              />

              <DownloadButton
                label="Download Assumptions Register (.txt)"
                onClick={() =>
                  downloadOutput(
                    "Assumptions Register",
                    outputs.assumptionsRegister,
                    "txt"
                  )
                }
              />

              <DownloadButton
                label="Download Full Output Pack (.md)"
                primary
                onClick={() =>
                  downloadOutput("Full Output Pack", outputs.fullOutputPack, "md")
                }
              />

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">
                  Download status
                </p>
                <p className="mt-2 text-sm text-slate-700">{downloadStatus}</p>
              </div>
            </div>
          </SectionCard>
        </>
      }
      right={
        <>
          <PromptPanel
            promptTitle="Executive summary AI prompt"
            promptSubtitle="Generate a sponsor-ready executive summary using the compiled outputs."
            promptText={executivePrompt}
            onRefreshPrompt={buildAndSaveExecutivePrompt}
            onCopyPrompt={handleCopyExecutivePrompt}
            copyStatus={promptCopyStatus}
            responseTitle="Paste executive summary AI response"
            responseSubtitle="Paste the AI response here using the exact headings requested in the prompt."
            responseValue={executiveSummary.aiResponse || ""}
            onResponseChange={(e) =>
              updateExecutiveSummaryField("aiResponse", e.target.value)
            }
            responsePlaceholder={`Paste the AI response here.

Required structure:
A. Executive Summary
B. Decision Ask
C. Recommendation
D. Key Benefits
E. Key Costs / Investment
F. Scenario Takeaway
G. Key Risks / Assumptions
H. Recommended Next Steps`}
            responseRows={14}
            onParseResponse={handleParseExecutiveSummary}
            onApplyResponse={handleParseExecutiveSummary}
            parseLabel="Parse Executive Summary"
            applyLabel="Apply Executive Summary"
            helperTitle="How to use Executive Summary"
            helperSteps={[
              {
                title: "Step 1",
                body: "Refresh the prompt after the charter, value, cost, scenario, and assumptions sections are updated.",
              },
              {
                title: "Step 2",
                body: "Copy the prompt into your AI tool and ask it to create a sponsor-ready executive summary.",
              },
              {
                title: "Step 3",
                body: "Paste the AI response back into this panel and parse it into structured fields.",
              },
              {
                title: "Step 4",
                body: "Review and edit the fields before copying or downloading the full output pack.",
              },
            ]}
          />

          <OutputPreviewCard
            title="Executive Summary"
            value={outputs.executiveSummary}
            onCopy={() =>
              copyText(outputs.executiveSummary, "Executive Summary Copied")
            }
            copyLabel="Copy Executive Summary"
            accent="orange"
          />

          <OutputPreviewCard
            title="Project Charter"
            value={outputs.charterText}
            onCopy={() => copyText(outputs.charterText, "Charter Copied")}
            copyLabel="Copy Charter"
          />

          <OutputPreviewCard
            title="Project Plan Summary"
            value={outputs.projectPlanSummary}
            onCopy={() =>
              copyText(outputs.projectPlanSummary, "Plan Summary Copied")
            }
            copyLabel="Copy Plan"
          />

          <OutputPreviewCard
            title="Value Summary"
            value={outputs.valueSummary}
            onCopy={() => copyText(outputs.valueSummary, "Value Summary Copied")}
            copyLabel="Copy Value"
          />

          <OutputPreviewCard
            title="Cost Summary"
            value={outputs.costSummary}
            onCopy={() => copyText(outputs.costSummary, "Cost Summary Copied")}
            copyLabel="Copy Cost"
          />

          <OutputPreviewCard
            title="Scenario Summary"
            value={outputs.scenarioSummary}
            onCopy={() =>
              copyText(outputs.scenarioSummary, "Scenario Summary Copied")
            }
            copyLabel="Copy Scenario"
            accent="orange"
          />

          <OutputPreviewCard
            title="Assumptions Register"
            value={outputs.assumptionsRegister}
            onCopy={() =>
              copyText(outputs.assumptionsRegister, "Assumptions Copied")
            }
            copyLabel="Copy Assumptions"
          />

          <OutputPreviewCard
            title="Open Questions & Assumptions"
            value={outputs.openQuestionsAndAssumptions}
            onCopy={() =>
              copyText(
                outputs.openQuestionsAndAssumptions,
                "Open Questions Copied"
              )
            }
            copyLabel="Copy Open Questions"
          />

          <OutputPreviewCard
            title="Full Output Pack"
            value={outputs.fullOutputPack}
            onCopy={() =>
              copyText(outputs.fullOutputPack, "Full Output Pack Copied")
            }
            copyLabel="Copy Full Pack"
            accent="orange"
          />
        </>
      }
    />
  );
}