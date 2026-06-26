export const scenarioTemplates = [
  {
    id: "conservative",
    title: "Conservative",
    description:
      "Use when benefits are uncertain, adoption may be slow, or costs may run higher than expected.",
    valueNotes:
      "Conservative scenario template applied. Benefits are intentionally discounted to reflect adoption, timing, or validation uncertainty.",
    costNotes:
      "Conservative scenario template applied. Costs are increased to reflect delivery, implementation, and contingency uncertainty.",
    scenarios: {
      low: {
        benefitFactor: "0.50",
        costFactor: "1.25",
        notes:
          "Very conservative case with reduced benefit realization and higher cost uncertainty.",
      },
      expected: {
        benefitFactor: "0.75",
        costFactor: "1.15",
        notes:
          "Conservative expected case assuming partial adoption and some cost overrun.",
      },
      high: {
        benefitFactor: "1.00",
        costFactor: "1.05",
        notes:
          "Best conservative case where benefits materialize close to baseline with minor cost pressure.",
      },
    },
  },
  {
    id: "balanced",
    title: "Balanced / Expected",
    description:
      "Use as the default planning case when inputs are reasonable but still preliminary.",
    valueNotes:
      "Balanced scenario template applied. Benefits are modeled around current expected assumptions.",
    costNotes:
      "Balanced scenario template applied. Costs are modeled around current expected assumptions.",
    scenarios: {
      low: {
        benefitFactor: "0.70",
        costFactor: "1.15",
        notes:
          "Lower case with conservative benefit realization and moderate cost pressure.",
      },
      expected: {
        benefitFactor: "1.00",
        costFactor: "1.00",
        notes:
          "Expected case based on current planning assumptions and most likely execution path.",
      },
      high: {
        benefitFactor: "1.30",
        costFactor: "0.95",
        notes:
          "Higher case with stronger adoption, better execution, or greater benefit realization.",
      },
    },
  },
  {
    id: "aggressive",
    title: "Aggressive",
    description:
      "Use when the project has strong sponsor support, high adoption confidence, and meaningful upside.",
    valueNotes:
      "Aggressive scenario template applied. Benefits assume strong adoption and meaningful upside.",
    costNotes:
      "Aggressive scenario template applied. Costs assume effective execution and limited overrun.",
    scenarios: {
      low: {
        benefitFactor: "0.90",
        costFactor: "1.05",
        notes:
          "Aggressive low case where benefits still approach baseline and cost overrun is limited.",
      },
      expected: {
        benefitFactor: "1.25",
        costFactor: "0.95",
        notes:
          "Aggressive expected case with strong adoption and efficient delivery.",
      },
      high: {
        benefitFactor: "1.60",
        costFactor: "0.85",
        notes:
          "High upside case with strong adoption, strong execution, and expanded value capture.",
      },
    },
  },
  {
    id: "labor-savings",
    title: "Labor Savings Focus",
    description:
      "Use when the primary value story is reduced manual effort, capacity creation, or productivity improvement.",
    valueNotes:
      "Labor savings scenario template applied. Emphasis should be placed on role-based hours saved and weighted labor rates.",
    costNotes:
      "Labor savings scenario template applied. Internal labor cost should be validated against implementation effort assumptions.",
    scenarios: {
      low: {
        benefitFactor: "0.65",
        costFactor: "1.10",
        notes:
          "Low case assumes limited automation adoption or partial manual effort reduction.",
      },
      expected: {
        benefitFactor: "1.00",
        costFactor: "1.00",
        notes:
          "Expected case assumes labor savings align with role-weighted model assumptions.",
      },
      high: {
        benefitFactor: "1.40",
        costFactor: "0.95",
        notes:
          "High case assumes strong adoption and larger-than-expected manual effort reduction.",
      },
    },
  },
  {
    id: "quality-rework",
    title: "Quality / Rework Focus",
    description:
      "Use when value is driven by fewer errors, lower rework, better quality, or risk reduction.",
    valueNotes:
      "Quality / rework scenario template applied. Benefits should include error reduction, rework avoidance, and quality-risk reduction where possible.",
    costNotes:
      "Quality / rework scenario template applied. Costs should include testing, training, controls, and change management.",
    scenarios: {
      low: {
        benefitFactor: "0.60",
        costFactor: "1.10",
        notes:
          "Low case assumes quality improvements are real but limited by inconsistent adoption or incomplete controls.",
      },
      expected: {
        benefitFactor: "1.00",
        costFactor: "1.00",
        notes:
          "Expected case assumes measurable error reduction and moderate rework avoidance.",
      },
      high: {
        benefitFactor: "1.35",
        costFactor: "0.95",
        notes:
          "High case assumes significant quality lift, reduced rework, and stronger risk avoidance.",
      },
    },
  },
  {
    id: "cost-conservative",
    title: "Cost Conservative",
    description:
      "Use when investment uncertainty is high and you want to pressure-test the business case against higher costs.",
    valueNotes:
      "Cost conservative scenario template applied. Benefit assumptions remain moderate while cost assumptions are pressure-tested.",
    costNotes:
      "Cost conservative scenario template applied. Costs are intentionally increased to reflect implementation and support uncertainty.",
    scenarios: {
      low: {
        benefitFactor: "0.70",
        costFactor: "1.35",
        notes:
          "Low case assumes reduced benefits and significant cost pressure.",
      },
      expected: {
        benefitFactor: "1.00",
        costFactor: "1.20",
        notes:
          "Expected case assumes baseline benefits but higher implementation or support cost.",
      },
      high: {
        benefitFactor: "1.20",
        costFactor: "1.05",
        notes:
          "High case assumes stronger benefits while still preserving some cost conservatism.",
      },
    },
  },
];

export function getScenarioTemplateById(templateId) {
  return scenarioTemplates.find((template) => template.id === templateId) || null;
}

export function buildTemplateApplicationNotes(template) {
  if (!template) {
    return "";
  }

  return [
    "Scenario Template Applied:",
    `- Template: ${template.title}`,
    `- Description: ${template.description}`,
  ].join("\n");
}