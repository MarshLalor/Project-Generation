import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { createExportFileName } from "./exportHelpers";

function safeText(value, fallback = "No content generated yet.") {
  return value && String(value).trim() ? String(value).trim() : fallback;
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

  return isAllCaps || hasTitleDash || isNumberedHeading;
}

function createParagraphFromLine(line) {
  const trimmed = line.trim();

  if (!trimmed) {
    return new Paragraph({
      text: "",
      spacing: { after: 120 },
    });
  }

  if (isLikelyHeading(trimmed)) {
    return new Paragraph({
      text: trimmed,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
    });
  }

  if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
    return new Paragraph({
      children: [
        new TextRun({
          text: trimmed.replace(/^[-•]\s*/, ""),
          size: 22,
        }),
      ],
      bullet: {
        level: 0,
      },
      spacing: { after: 80 },
    });
  }

  return new Paragraph({
    children: [
      new TextRun({
        text: trimmed,
        size: 22,
      }),
    ],
    spacing: { after: 120 },
  });
}

function buildDocxDocument({ title, content }) {
  const safeTitle = safeText(title, "Project Output");
  const safeContent = safeText(content);

  const lines = safeContent.split("\n");

  return new Document({
    creator: "Project Builder",
    title: safeTitle,
    description: "Generated from Project Builder outputs.",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: safeTitle,
                bold: true,
                size: 34,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
          }),
          ...lines.map((line) => createParagraphFromLine(line)),
        ],
      },
    ],
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 500);
}

export async function downloadDocxFile({
  projectData,
  sectionName,
  content,
}) {
  const fileBaseName = createExportFileName(projectData, sectionName);
  const doc = buildDocxDocument({
    title: sectionName,
    content,
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${fileBaseName}.docx`);
}