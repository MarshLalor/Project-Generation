export const topNavTabs = [
  { id: "home", label: "Home" },
  { id: "ideation", label: "Ideation" },
  { id: "project-basics", label: "Project Basics" },
  { id: "charter", label: "Charter" },
  { id: "plan-studio", label: "Plan Studio" },
  { id: "value-estimate", label: "Value Estimate" },
  { id: "cost-estimate", label: "Cost Estimate" },
  { id: "assumptions", label: "Assumptions" },
  { id: "outputs", label: "Outputs" },
];

export const flowSteps = [
  {
    id: "ideation",
    title: "Ideation",
    description:
      "Use AI-assisted brainstorming to shape a rough idea into a clearer project concept, problem statement, and measurable outcomes.",
  },
  {
    id: "project-basics",
    title: "Project Basics",
    description:
      "Capture the core intake details needed to generate a starting charter and support future planning prompts.",
  },
  {
    id: "charter",
    title: "Project Charter",
    description:
      "Transform the intake into a structured charter with scope, objectives, stakeholders, assumptions, constraints, and success criteria.",
  },
  {
    id: "plan-studio",
    title: "Plan Studio",
    description:
      "Generate PMBOK-aligned section prompts and build out the project plan step by step with AI partner guidance.",
  },
  {
    id: "value-estimate",
    title: "Value Estimate",
    description:
      "Identify benefit drivers, gather known variables, and create a high-level estimate of business value and expected outcomes.",
  },
  {
    id: "cost-estimate",
    title: "Cost Estimate",
    description:
      "Develop rough implementation and recurring cost estimates using known inputs, assumptions, and guided questions.",
  },
  {
    id: "assumptions",
    title: "Assumptions",
    description:
      "Centralize reusable assumptions, benchmark inputs, effort estimates, salary assumptions, and open questions.",
  },
  {
    id: "outputs",
    title: "Outputs",
    description:
      "Compile final artifacts for export, including the project charter, project plan summary, and value summary.",
  },
];

export const tabGuideCards = [
  {
    id: "ideation",
    title: "Ideation",
    purpose:
      "Helps the user brainstorm and shape an early project idea before the charter is fully defined.",
    userAction:
      "Describe a rough concept, pain point, opportunity, or desired outcome. Use the AI ideation prompt to clarify the problem, define goals, and identify solution directions.",
    output:
      "Problem statement, draft objective, desired outcomes, possible approaches, initial scope thoughts, value drivers, and open questions.",
  },
  {
    id: "project-basics",
    title: "Project Basics",
    purpose:
      "Captures the minimum project information required to start generating structured outputs.",
    userAction:
      "Enter project title, business problem, objective, expected business outcome, delivery approach, scope, stakeholders, timeline, and other essential intake items.",
    output:
      "A reusable project intake profile that powers the charter and downstream AI prompts.",
  },
  {
    id: "charter",
    title: "Charter",
    purpose:
      "Transforms the intake and ideation outputs into a working project charter.",
    userAction:
      "Review, refine, and edit the generated charter content to improve clarity, scope, outcomes, assumptions, risks, and success criteria.",
    output:
      "A concise, business-ready project charter suitable for sponsor review, kickoff, or project framing.",
  },
  {
    id: "plan-studio",
    title: "Plan Studio",
    purpose:
      "Builds PMBOK-aligned project planning content using section-specific AI prompts.",
    userAction:
      "Generate prompts for scope, schedule, risks, communications, resources, governance, and other planning sections. Paste AI responses back into the tool and refine them.",
    output:
      "Draft project planning content, open questions, planning assumptions, and recommended next actions by section.",
  },
  {
    id: "value-estimate",
    title: "Value Estimate",
    purpose:
      "Supports high-level benefit estimation tied to project outcomes and value drivers.",
    userAction:
      "Identify sources of value, answer guided questions, fill in known variables, and optionally use salary/benchmark assumptions when exact data is unavailable.",
    output:
      "A high-level value model, benefit summary, confidence notes, assumptions, and key gaps still needing validation.",
  },
  {
    id: "cost-estimate",
    title: "Cost Estimate",
    purpose:
      "Develops a rough cost view for implementation and ongoing operation.",
    userAction:
      "Capture likely one-time and recurring costs such as software, labor, implementation, training, integration, and support.",
    output:
      "Year 1 estimate, recurring annual estimate, assumption-backed cost summary, and open cost questions.",
  },
  {
    id: "assumptions",
    title: "Assumptions",
    purpose:
      "Acts as the shared source of planning and estimation assumptions across the tool.",
    userAction:
      "Track rates, salary assumptions, effort estimates, benchmark inputs, productivity assumptions, and unresolved items.",
    output:
      "A reusable assumptions log that strengthens the value and cost sections while improving consistency across prompts.",
  },
  {
    id: "outputs",
    title: "Outputs",
    purpose:
      "Compiles polished deliverables and export options for stakeholder use.",
    userAction:
      "Review the collected outputs, check for completeness, and prepare documents for download or sharing.",
    output:
      "Project charter, value summary, project plan document, assumptions support content, and reusable AI prompt outputs.",
  },
];

export const deliverables = [
  {
    title: "Project Charter",
    description:
      "A concise, editable charter that summarizes the project problem, objectives, scope, stakeholders, assumptions, risks, and success criteria.",
    status: "Planned / Core Output",
  },
  {
    title: "Project Plan Summary",
    description:
      "PMBOK-aligned planning content built section by section with AI-assisted prompts and editable outputs.",
    status: "Planned / Core Output",
  },
  {
    title: "Value Summary",
    description:
      "A high-level estimate of expected business benefit with assumptions, confidence notes, and variable tracking.",
    status: "Planned / Core Output",
  },
  {
    title: "Cost Summary",
    description:
      "A rough Year 1 and recurring annual cost estimate using known data and assumptions.",
    status: "Planned / Supporting Output",
  },
  {
    title: "Assumptions Log",
    description:
      "A centralized record of assumptions, open questions, benchmark inputs, salary estimates, and calculation drivers.",
    status: "Planned / Supporting Output",
  },
  {
    title: "AI Prompt Pack",
    description:
      "Reusable prompts that allow the user to continue working with an AI partner outside the tool.",
    status: "Planned / Supporting Output",
  },
];

export const saveSlots = [
  {
    id: 1,
    title: "Save Slot 1",
    projectName: "Empty Slot",
    status: "Coming Soon",
    detail: "Save and resume one project workspace in this slot.",
  },
  {
    id: 2,
    title: "Save Slot 2",
    projectName: "Empty Slot",
    status: "Coming Soon",
    detail: "Save and resume a second project workspace in this slot.",
  },
  {
    id: 3,
    title: "Save Slot 3",
    projectName: "Empty Slot",
    status: "Coming Soon",
    detail: "Save and resume a third project workspace in this slot.",
  },
];

export const plannedExports = [
  {
    title: "Download Charter",
    format: "DOCX / PDF",
    description:
      "Export the current project charter in a business-friendly document format.",
    status: "Coming Soon",
  },
  {
    title: "Download Value Summary",
    format: "DOCX / PDF",
    description:
      "Export the current business value estimate and benefit summary for review or presentation.",
    status: "Coming Soon",
  },
  {
    title: "Download Project Plan",
    format: "DOCX / PDF",
    description:
      "Export the current project plan summary built from PMBOK-aligned planning sections.",
    status: "Coming Soon",
  },
];

export const referenceLinks = [
  {
    group: "Project / Planning Foundations",
    links: [
      {
        label: "PMBOK and Project Management Standards",
        href: "https://www.pmi.org/",
      },
      {
        label: "Agile Practice and Delivery References",
        href: "https://www.agilealliance.org/",
      },
      {
        label: "Hybrid Delivery and Product Thinking References",
        href: "https://www.scrum.org/",
      },
    ],
  },
  {
    group: "Estimation / Value Inputs",
    links: [
      {
        label: "Labor Market and Salary Benchmark Sources",
        href: "https://www.bls.gov/",
      },
      {
        label: "Salary and Compensation Reference Source",
        href: "https://www.salary.com/",
      },
      {
        label: "General Professional Benchmark Source",
        href: "https://www.glassdoor.com/",
      },
    ],
  },
];
