const STORAGE_KEY = "project-builder-workspace-v1";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function cloneInitialProjectData(initialProjectData) {
  return JSON.parse(JSON.stringify(initialProjectData));
}

export function createEmptyStorageState() {
  return {
    version: 1,
    lastActiveSlot: 1,
    slots: {
      "1": null,
      "2": null,
      "3": null,
    },
  };
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

    return {
      version: 1,
      lastActiveSlot: parsed?.lastActiveSlot || 1,
      slots: {
        "1": parsed?.slots?.["1"] || null,
        "2": parsed?.slots?.["2"] || null,
        "3": parsed?.slots?.["3"] || null,
      },
    };
  } catch (error) {
    return createEmptyStorageState();
  }
}

export function writeStorageState(state) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setLastActiveSlot(slotId) {
  const state = readStorageState();
  state.lastActiveSlot = Number(slotId) || 1;
  writeStorageState(state);
}

export function saveProjectToSlot(slotId, projectData, activeTab = "home") {
  const state = readStorageState();
  const normalizedSlotId = String(slotId || 1);

  state.lastActiveSlot = Number(slotId) || 1;
  state.slots[normalizedSlotId] = {
    savedAt: new Date().toISOString(),
    projectTitle:
      projectData?.projectBasics?.title?.trim() || "Untitled Project",
    activeTab: activeTab || "home",
    projectData,
  };

  writeStorageState(state);
  return state;
}

export function loadProjectFromSlot(slotId) {
  const state = readStorageState();
  return state.slots[String(slotId)] || null;
}

export function clearProjectSlot(slotId) {
  const state = readStorageState();
  state.slots[String(slotId)] = null;
  writeStorageState(state);
  return state;
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

export function getInitialHydratedState(initialProjectData) {
  const state = readStorageState();
  const activeSlot = state.lastActiveSlot || 1;
  const slot = state.slots[String(activeSlot)];

  return {
    activeSlot,
    activeTab: slot?.activeTab || "home",
    projectData: slot?.projectData
      ? slot.projectData
      : cloneInitialProjectData(initialProjectData),
    slotSummaries: getSlotSummaries(),
  };
}