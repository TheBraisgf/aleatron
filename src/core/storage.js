const STORAGE_KEY = "aleatron-saved";

export function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeSaved(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
