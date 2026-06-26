import {
  createBlankProjectData,
  getProjectTitle,
  normalizeProjectData,
} from "./projectDataHelpers";

const STORAGE_KEY = "project-builder-workspace-v3";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function createDefaultSlotMeta() {
  return {
    "1": { slotName: "Slot 1" },
    "2": { slotName: "Slot 2" },
    "3": { slotName: "Slot 3" },
  };
}

export function createEmptyStorageState() {
  return {
    version: 3,
    lastActiveSlot: 1,
    slotMeta: createDefaultSlotMeta(),
    slots: {
      "1": null,
      "2": null,
      "3": null,
    },
  };
}

function normalizeStorageState(parsedState) {
  const empty = createEmptyStorageState();

  if (!parsedState || typeof parsedState !== "object") {
    return empty;
  }

  const normalized = {
    version: 3,
    lastActiveSlot: Number(parsedState.lastActiveSlot) || 1,
    slotMeta: {
      ...createDefaultSlotMeta(),
      ...(parsedState.slotMeta || {}),
    },
    slots: {
      "1": null,
      "2": null,
      "3": null,
    },
  };

  ["1", "2", "3"].forEach((slotId) => {
    const slot = parsedState?.slots?.[slotId];

    if (!slot?.projectData) {
      normalized.slots[slotId] = null;
      return;
    }

    const normalizedProjectData = normalizeProjectData(slot.projectData);

    normalized.slots[slotId] = {
      savedAt: slot.savedAt || new Date().toISOString(),
      projectTitle: slot.projectTitle || getProjectTitle(normalizedProjectData),
      activeTab: slot.activeTab || "home",
      projectData: normalizedProjectData,
    };
  });

  return normalized;
}

export function readStorageState() {
  if (!canUseStorage()) {
    return createEmptyStorageState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyStorageState();
    }

    const parsed = JSON.parse(raw);
    return normalizeStorageState(parsed);
  } catch (error) {
    return createEmptyStorageState();
  }
}

export function writeStorageState(state) {
  if (!canUseStorage()) return;

  const normalized = normalizeStorageState(state);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function setLastActiveSlot(slotId) {
  const state = readStorageState();
  state.lastActiveSlot = Number(slotId) || 1;
  writeStorageState(state);
}

export function saveProjectToSlot(slotId, projectData, activeTab = "home") {
  const state = readStorageState();
  const normalizedSlotId = String(slotId || 1);
  const normalizedProjectData = normalizeProjectData(projectData);

  state.lastActiveSlot = Number(slotId) || 1;
  state.slots[normalizedSlotId] = {
    savedAt: new Date().toISOString(),
    projectTitle: getProjectTitle(normalizedProjectData),
    activeTab: activeTab || "home",
    projectData: normalizedProjectData,
  };

  writeStorageState(state);
  return readStorageState();
}

export function loadProjectFromSlot(slotId) {
  const state = readStorageState();
  const slot = state.slots[String(slotId)] || null;

  if (!slot?.projectData) {
    return null;
  }

  return {
    ...slot,
    projectData: normalizeProjectData(slot.projectData),
  };
}

export function clearProjectSlot(slotId) {
  const state = readStorageState();
  const normalizedSlotId = String(slotId || 1);

  state.slots[normalizedSlotId] = null;
  state.lastActiveSlot = Number(slotId) || 1;

  writeStorageState(state);
  return readStorageState();
}

export function renameProjectSlot(slotId, slotName) {
  const state = readStorageState();
  const normalizedSlotId = String(slotId || 1);
  const cleanedName =
    slotName && String(slotName).trim()
      ? String(slotName).trim()
      : `Slot ${normalizedSlotId}`;

  state.slotMeta[normalizedSlotId] = {
    ...(state.slotMeta[normalizedSlotId] || {}),
    slotName: cleanedName,
  };

  writeStorageState(state);
  return readStorageState();
}

export function duplicateProjectSlot(sourceSlotId, targetSlotId) {
  const state = readStorageState();
  const sourceId = String(sourceSlotId || 1);
  const targetId = String(targetSlotId || 1);
  const sourceSlot = state.slots[sourceId];

  if (!sourceSlot?.projectData) {
    return {
      ok: false,
      message: `Slot ${sourceId} has no project to duplicate.`,
      state,
    };
  }

  const normalizedProjectData = normalizeProjectData(sourceSlot.projectData);

  state.slots[targetId] = {
    savedAt: new Date().toISOString(),
    projectTitle: getProjectTitle(normalizedProjectData),
    activeTab: sourceSlot.activeTab || "home",
    projectData: normalizedProjectData,
  };

  state.slotMeta[targetId] = {
    ...(state.slotMeta[targetId] || {}),
    slotName: `${state.slotMeta[sourceId]?.slotName || `Slot ${sourceId}`} Copy`,
  };

  state.lastActiveSlot = Number(targetId) || 1;

  writeStorageState(state);

  return {
    ok: true,
    message: `Duplicated Slot ${sourceId} to Slot ${targetId}.`,
    state: readStorageState(),
  };
}

export function getFirstAvailableSlot(excludeSlotId) {
  const state = readStorageState();
  const excluded = String(excludeSlotId || "");

  const available = ["1", "2", "3"].find((slotId) => {
    return slotId !== excluded && !state.slots[slotId];
  });

  return available ? Number(available) : null;
}

export function getSlotSummaries() {
  const state = readStorageState();

  return [1, 2, 3].map((slotId) => {
    const slot = state.slots[String(slotId)];
    const meta = state.slotMeta[String(slotId)] || {};

    return {
      id: slotId,
      slotName: meta.slotName || `Slot ${slotId}`,
      isEmpty: !slot,
      projectTitle: slot?.projectTitle || "Empty slot",
      savedAt: slot?.savedAt || null,
      activeTab: slot?.activeTab || "home",
    };
  });
}

export function getInitialHydratedState() {
  const storageState = readStorageState();
  const activeSlot = storageState.lastActiveSlot || 1;
  const slot = storageState.slots[String(activeSlot)];

  return {
    activeSlot,
    activeTab: slot?.activeTab || "home",
    projectData: slot?.projectData
      ? normalizeProjectData(slot.projectData)
      : createBlankProjectData(),
    slotSummaries: getSlotSummaries(),
  };
}

export function createNewProjectForSlot(slotId) {
  const state = readStorageState();
  const normalizedSlotId = String(slotId || 1);

  state.lastActiveSlot = Number(slotId) || 1;
  state.slots[normalizedSlotId] = null;

  writeStorageState(state);

  return {
    activeSlot: Number(slotId) || 1,
    activeTab: "home",
    projectData: createBlankProjectData(),
    slotSummaries: getSlotSummaries(),
  };
}