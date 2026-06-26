import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

function safeText(value, fallback = "Not provided") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function getCurrentDateLabel() {
  return new Date().toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createBodyText(text, options = {}) {
  return new TextRun({
    text,
    size: options.size || 22,
    bold: !!options.bold,
    italics: !!options.italics,
    color: options.color || "334155",
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [
      createBodyText(text, {
        size: options.size || 22,
        bold: options.bold,
        italics: options.italics,
        color: options.color,
      }),
    ],
    spacing: {
      before: options.before || 0,
      after: options.after || 120,
      line: options.line || 300,
    },
    alignment: options.alignment || AlignmentType.LEFT,
  });
}

function createHeading(text, level = HeadingLevel.HEADING_2) {
  return new Paragraph({
    text,
    heading: level,
    spacing: {
      before: 260,
      after: 140,
    },
  });
}

function createBullet(text) {
  return new Paragraph({
    children: [
      createBodyText(text.replace(/^[-•]\s*/, ""), {
        size: 22,
        color: "334155",
      }),
    ],
    bullet: {
      level: 0,
    },
    spacing: {
      after: 80,
      line: 280,
    },
  });
}

function createTableCell(text, options = {}) {
  return new TableCell({
    shading: options.shading
      ? {
          fill: options.shading,
        }
      : undefined,
    margins: {
      top: 120,
      bottom: 120,
      left: 160,
      right: 160,
    },
    children: [
      new Paragraph({
        children: [
          createBodyText(text, {
            bold: options.bold,
            color: options.color || "334155",
            size: 20,
          }),
        ],
      }),
    ],
    borders: {
      top: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "D8E8F8",
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "D8E8F8",
      },
      left: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "D8E8F8",
      },
      right: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "D8E8F8",
      },
    },
  });
}

function createMetadataTable(projectData, sectionName) {
  const basics = projectData?.projectBasics || {};

  const rows = [
    ["Document", sectionName],
    ["Project", safeText(basics.title, "Untitled Project")],
    ["Delivery Approach", safeText(basics.deliveryApproach, "Hybrid")],
    ["Target Timeline", safeText(basics.targetTimeline)],
    ["Budget Range", safeText(basics.estimatedBudgetRange)],
    ["Generated", getCurrentDateLabel()],
  ];

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            createTableCell(label, {
              bold: true,
              shading: "EFF6FF",
              color: "075985",
            }),
            createTableCell(value),
          ],
        })
    ),
  });
}

function isDividerLine(line) {
  return /^={5,}$/.test(line.trim()) || /^-{5,}$/.test(line.trim());
}

function isLikelyHeading(line) {
  const trimmed = line.trim();

  if (!trimmed) return false;

  const isAllCaps =
    trimmed.length > 3 &&
    trimmed === trimmed.toUpperCase() &&
    /[A-Z]/.test(trimmed);

  const hasTitleDash = trimmed.includes("—");

  const isNumberedHeading = /^\d+\.\s+/.test(trimmed);

  const isSectionLabel =
    [
      "EXECUTIVE SUMMARY",
      "DECISION ASK",
      "RECOMMENDATION",
      "KEY BENEFITS",
      "KEY COSTS / INVESTMENT",
      "SCENARIO TAKEAWAY",
      "KEY RISKS / ASSUMPTIONS",
      "RECOMMENDED NEXT STEPS",
      "PROJECT CONTEXT",
      "SCOPE SECTION",
      "SCHEDULE SECTION",
      "RISK SECTION",
      "COMMUNICATIONS SECTION",
      "BASE VALUE SUMMARY",
      "BASE COST SUMMARY",
      "LOW / EXPECTED / HIGH SCENARIOS",
      "LABOR RATE ASSUMPTIONS",
      "EFFORT ASSUMPTIONS",
      "VOLUME ASSUMPTIONS",
      "BENCHMARK ASSUMPTIONS",
      "CALCULATION SETTINGS",
      "OPEN QUESTIONS",
    ].includes(trimmed);

  return isAllCaps || hasTitleDash || isNumberedHeading || isSectionLabel;
}

function convertLineToDocxElement(line) {
  const trimmed = line.trim();

  if (isDividerLine(trimmed)) {
    return createParagraph("", {
      after: 80,
    });
  }

  if (!trimmed) {
    return createParagraph("", {
      after: 80,
    });
  }

  if (isLikelyHeading(trimmed)) {
    return createHeading(trimmed, HeadingLevel.HEADING_2);
  }

  if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
    return createBullet(trimmed);
  }

  return createParagraph(trimmed);
}

function createCoverSection(projectData, sectionName) {
  const basics = projectData?.projectBasics || {};
  const projectTitle = safeText(basics.title, "Untitled Project");

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: sectionName,
          bold: true,
          size: 42,
          color: "0F172A",
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: {
        after: 220,
      },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: projectTitle,
          bold: true,
          size: 28,
          color: "075985",
        }),
      ],
      spacing: {
        after: 160,
      },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: safeText(
            basics.projectObjective,
            "Project objective has not yet been provided."
          ),
          size: 22,
          color: "334155",
          italics: true,
        }),
      ],
      spacing: {
        after: 260,
        line: 320,
      },
    }),

    createMetadataTable(projectData, sectionName),

    createParagraph("", {
      after: 180,
    }),

    createHeading("Generated Content", HeadingLevel.HEADING_1),
  ];
}

export function buildStyledDocxDocument({ projectData, sectionName, content }) {
  const safeSectionName = safeText(sectionName, "Project Output");
  const safeContent = safeText(content, "No content generated yet.");

  const contentLines = safeContent.split("\n");

  const children = [
    ...createCoverSection(projectData, safeSectionName),
    ...contentLines.map((line) => convertLineToDocxElement(line)),
  ];

  return new Document({
    creator: "Project Builder",
    title: safeSectionName,
    description: "Generated from Project Builder outputs.",
    styles: {
      default: {
        document: {
          run: {
            font: "Aptos",
            size: 22,
            color: "334155",
          },
          paragraph: {
            spacing: {
              after: 120,
              line: 300,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });
}