function safeText(value, fallback = "Not yet provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function compactLine(label, value, fallback = "Not yet provided") {
  return `${label}: ${safeText(value, fallback)}`;
}

function listFromMultiline(value) {
  if (!value || !String(value).trim()) return [];
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function bulletsFromText(value) {
  const items = listFromMultiline(value);
  if (!items.length) return "• Not yet provided";
  return items.map((item) => `• ${item}`).join("\n");
}

export function getProjectBasicsReadiness(projectBasics) {
  const checks = [
    { key: "title", label: "Project title", value: projectBasics.title },
    {
      key: "businessProblem",
      label: "Business problem / opportunity",
      value: projectBasics.businessProblem,
    },
    {
      key: "projectObjective",
      label: "Project objective",
      value: projectBasics.projectObjective,
    },
    {
      key: "expectedBusinessOutcome",
      label: "Expected business outcome",
      value: projectBasics.expectedBusinessOutcome,
    },
    {
      key: "deliveryApproach",
      label: "Delivery approach",
      value: projectBasics.deliveryApproach,
    },
    {
      key: "scopeIn",
      label: "In scope",
      value: projectBasics.scopeIn,
    },
    {
      key: "keyStakeholders",
      label: "Key stakeholders",
      value: projectBasics.keyStakeholders,
    },
    {
      key: "successCriteria",
      label: "Success criteria",
      value: projectBasics.successCriteria,
    },
  ];

  const completed = checks.filter((item) => item.value && String(item.value).trim()).length;
  const total = checks.length;
  const percent = Math.round((completed / total) * 100);

  return {
    completed,
    total,
    percent,
    checks,
  };
}

export function generateCharterSections(projectData) {
  const basics = projectData?.projectBasics || {};
  const ideation = projectData?.ideation?.parsedSections || {};
  const rawIdeation = projectData?.ideation || {};

  const backgroundParts = [
    safeText(ideation.problemStatement || basics.businessProblem),
    rawIdeation.businessContext ? `Business context: ${rawIdeation.businessContext}` : "",
    rawIdeation.spark ? `What sparked the project: ${rawIdeation.spark}` : "",
  ].filter(Boolean);

  const stakeholderLines = [
    basics.sponsor ? `• Project Sponsor: ${basics.sponsor}` : "",
    basics.businessOwner ? `• Business Owner: ${basics.businessOwner}` : "",
    basics.projectManager ? `• Project Manager: ${basics.projectManager}` : "",
    basics.department ? `• Department / Business Unit: ${basics.department}` : "",
    bulletsFromText(basics.keyStakeholders),
  ].filter(Boolean);

  const timelineParts = [
    basics.targetTimeline ? `Target timeline: ${basics.targetTimeline}` : "",
    basics.estimatedBudgetRange
      ? `Estimated budget range: ${basics.estimatedBudgetRange}`
      : "",
    basics.deliveryApproach
      ? `Delivery approach: ${basics.deliveryApproach}`
      : "",
  ].filter(Boolean);

  const nextSteps = [];
  if (!basics.scopeIn) nextSteps.push("Confirm the detailed in-scope work and deliverables.");
  if (!basics.scopeOut) nextSteps.push("Clarify what is explicitly out of scope.");
  if (!basics.successCriteria) nextSteps.push("Define measurable success criteria and target outcomes.");
  if (!basics.risksDependencies) nextSteps.push("Capture the major risks, dependencies, and early mitigations.");
  if (!basics.initialValueHypothesis)
    nextSteps.push("Expand the value hypothesis to support the future value estimate.");
  if (!nextSteps.length)
    nextSteps.push("Review the charter with sponsor and stakeholders, then begin the PMBOK-aligned planning sections.");

  const sections = {
    backgroundBusinessNeed: backgroundParts.join("\n\n"),
    problemStatement: safeText(ideation.problemStatement || basics.businessProblem),
    projectObjectives: [
      safeText(ideation.projectObjective || basics.projectObjective),
      basics.expectedBusinessOutcome
        ? `Outcome focus: ${basics.expectedBusinessOutcome}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    scopeSummary: [
      "In Scope",
      bulletsFromText(ideation.scopeIn || basics.scopeIn),
      "",
      "Out of Scope",
      bulletsFromText(ideation.scopeOut || basics.scopeOut),
      "",
      compactLine("Delivery approach", basics.deliveryApproach, "Hybrid"),
    ].join("\n"),
    keyStakeholders: stakeholderLines.join("\n"),
    timelineMilestones: timelineParts.length
      ? timelineParts.map((item) => `• ${item}`).join("\n")
      : "• Target timeline, budget range, and milestone expectations still need to be confirmed.",
    assumptions: bulletsFromText(ideation.assumptions || basics.keyAssumptions),
    constraints: bulletsFromText(basics.keyConstraints),
    risksDependencies: bulletsFromText(
      ideation.risksConstraints || basics.risksDependencies
    ),
    successCriteria: bulletsFromText(basics.successCriteria),
    initialValueHypothesis: bulletsFromText(
      ideation.valueDrivers || basics.initialValueHypothesis
    ),
    recommendedNextSteps: nextSteps.map((item) => `• ${item}`).join("\n"),
  };

  return sections;
}

export function charterSectionsToText(sections, projectTitle = "") {
  const title = projectTitle && projectTitle.trim()
    ? `${projectTitle.trim()} — Project Charter`
    : "Project Charter";

  return [
    title,
    "",
    "1. Background / Business Need",
    sections.backgroundBusinessNeed || "Not yet provided",
    "",
    "2. Problem Statement",
    sections.problemStatement || "Not yet provided",
    "",
    "3. Project Objectives",
    sections.projectObjectives || "Not yet provided",
    "",
    "4. Scope Summary",
    sections.scopeSummary || "Not yet provided",
    "",
    "5. Key Stakeholders",
    sections.keyStakeholders || "Not yet provided",
    "",
    "6. Timeline / Milestones",
    sections.timelineMilestones || "Not yet provided",
    "",
    "7. Assumptions",
    sections.assumptions || "Not yet provided",
    "",
    "8. Constraints",
    sections.constraints || "Not yet provided",
    "",
    "9. Risks / Dependencies",
    sections.risksDependencies || "Not yet provided",
    "",
    "10. Success Criteria",
    sections.successCriteria || "Not yet provided",
    "",
    "11. Initial Value Hypothesis",
    sections.initialValueHypothesis || "Not yet provided",
    "",
    "12. Recommended Next Steps",
    sections.recommendedNextSteps || "Not yet provided",
  ].join("\n");
}

export function buildCharterRefinementPrompt(projectData, sections) {
  const basics = projectData?.projectBasics || {};

  return `You are an expert project management and business transformation assistant with strong experience creating concise, business-ready project charters.

Your task is to review and refine the draft project charter below.

Instructions:
1. Keep the writing practical, concise, and suitable for project sponsors, PMs, or business leaders.
2. Improve clarity where the charter is vague.
3. Preserve known facts.
4. Clearly distinguish confirmed facts from assumptions when needed.
5. Do not invent precise details that are not supported by the source information.
6. If information is missing, identify open questions instead of fabricating answers.
7. Keep the charter aligned to the selected delivery approach: ${safeText(
    basics.deliveryApproach,
    "hybrid"
  )}.

Project basics:
${compactLine("Project Title", basics.title)}
${compactLine("Business Problem", basics.businessProblem)}
${compactLine("Project Objective", basics.projectObjective)}
${compactLine("Expected Business Outcome", basics.expectedBusinessOutcome)}
${compactLine("Delivery Approach", basics.deliveryApproach, "Hybrid")}
${compactLine("Target Timeline", basics.targetTimeline)}
${compactLine("Budget Range", basics.estimatedBudgetRange)}
${compactLine("Sponsor", basics.sponsor)}
${compactLine("Business Owner", basics.businessOwner)}
${compactLine("Project Manager", basics.projectManager)}

Draft charter:
${charterSectionsToText(sections, basics.title)}

Please return:
A. Refined Charter
B. Open Questions
C. Areas that still need confirmation
D. Suggested next actions`;
}

export function generateCharterPayload(projectData) {
  const sections = generateCharterSections(projectData);
  const charterText = charterSectionsToText(
    sections,
    projectData?.projectBasics?.title || ""
  );
  const aiPrompt = buildCharterRefinementPrompt(projectData, sections);

  return {
    ...sections,
    charterText,
    aiPrompt,
  };
}
