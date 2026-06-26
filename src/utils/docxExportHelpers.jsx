import { Packer } from "docx";
import { createExportFileName } from "./exportHelpers";
import { buildStyledDocxDocument } from "./docxTemplateHelpers";

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

  const doc = buildStyledDocxDocument({
    projectData,
    sectionName,
    content,
  });

  const blob = await Packer.toBlob(doc);

  downloadBlob(blob, `${fileBaseName}.docx`);
}