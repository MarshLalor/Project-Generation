function safeText(value, fallback = "Untitled Project") {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

export function sanitizeFileName(value) {
  return safeText(value)
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

export function getProjectExportBaseName(projectData) {
  const title = projectData?.projectBasics?.title || "Project Builder Output";
  return sanitizeFileName(title);
}

export function downloadTextFile({
  content,
  fileName,
  extension = "txt",
  mimeType = "text/plain;charset=utf-8",
}) {
  const safeContent = content || "No content generated yet.";
  const safeFileName = sanitizeFileName(fileName || "project-output");
  const finalName = `${safeFileName}.${extension}`;

  const blob = new Blob([safeContent], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 500);
}

export function downloadMarkdownFile({ content, fileName }) {
  downloadTextFile({
    content,
    fileName,
    extension: "md",
    mimeType: "text/markdown;charset=utf-8",
  });
}

export function createExportFileName(projectData, sectionName) {
  const baseName = getProjectExportBaseName(projectData);
  const cleanSection = sanitizeFileName(sectionName);
  return `${baseName}-${cleanSection}`;
}