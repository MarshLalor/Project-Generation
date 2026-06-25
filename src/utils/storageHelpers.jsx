import {
  cloneProjectData,
  createBlankProjectData,
  getProjectTitle,
  normalizeProjectData,
} from "./projectDataHelpers";

const STORAGE_KEY = "project-builder-workspace-v2";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function createEmptyStorageState() {
  return {
    version: 2,
    lastActiveSlot: 1,
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
    version: 2,
    lastActiveSlot: Number(parsedState.lastActiveSlot) || 1,
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
  state.slots[String(slotId)] = null;
  writeStorageState(state);
  return readStorageState();
}

export function getSlotSummaries() {
  const state = readStorageState();

  return [1, 2, 3].map((slotId) => {
    const slot = state.slots[String(slotId)];

    return {
      id: slotId,
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

export function cloneStoredProject(projectData) {
  return cloneProjectData(normalizeProjectData(projectData));
}