import { buildOutputsPayload } from "./outputsHelpers";

function divider() {
  return "\n\n============================================================\n\n";
}

function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function getProjectTitle(projectData) {
  return projectData?.projectBasics?.title?.trim() || "Untitled Project";
}

function buildBundleContent(title, sections) {
  return [
    title,
    "",
    `Generated Bundle`,
    divider(),
    ...sections.flatMap((section, index) => {
      const sectionContent = [
        section.title,
        "",
        safeText(section.content),
      ].join("\n");

      if (index === sections.length - 1) {
        return [sectionContent];
      }

      return [sectionContent, divider()];
    }),
  ].join("\n");
}

export function buildExportBundles(projectData) {
  const outputs = buildOutputsPayload(projectData);
  const projectTitle = getProjectTitle(projectData);

  const executivePack = buildBundleContent(
    `${projectTitle} — Executive Pack`,
    [
      {
        title: "Executive Summary",
        content: outputs.executiveSummary,
      },
      {
        title: "Scenario Summary",
        content: outputs.scenarioSummary,
      },
      {
        title: "Value Summary",
        content: outputs.valueSummary,
      },
      {
        title: "Cost Summary",
        content: outputs.costSummary,
      },
      {
        title: "Open Questions & Assumptions",
        content: outputs.openQuestionsAndAssumptions,
      },
    ]
  );

  const planningPack = buildBundleContent(
    `${projectTitle} — Planning Pack`,
    [
      {
        title: "Project Charter",
        content: outputs.charterText,
      },
      {
        title: "Project Plan Summary",
        content: outputs.projectPlanSummary,
      },
      {
        title: "Assumptions Register",
        content: outputs.assumptionsRegister,
      },
      {
        title: "Open Questions & Assumptions",
        content: outputs.openQuestionsAndAssumptions,
      },
    ]
  );

  const businessCasePack = buildBundleContent(
    `${projectTitle} — Business Case Pack`,
    [
      {
        title: "Executive Summary",
        content: outputs.executiveSummary,
      },
      {
        title: "Value Summary",
        content: outputs.valueSummary,
      },
      {
        title: "Cost Summary",
        content: outputs.costSummary,
      },
      {
        title: "Scenario Summary",
        content: outputs.scenarioSummary,
      },
      {
        title: "Assumptions Register",
        content: outputs.assumptionsRegister,
      },
    ]
  );

  const fullProjectPack = outputs.fullOutputPack;

  return {
    executivePack,
    planningPack,
    businessCasePack,
    fullProjectPack,
  };
}