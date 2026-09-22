const HISTORY_KEY = 'mortgage-history';

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCalculation(entry) {
  const history = getHistory();
  history.unshift({ id: crypto.randomUUID(), ...entry });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addDummyEntries(entries) {
  const history = getHistory();
  const withIds = entries.map((entry) => ({ id: crypto.randomUUID(), ...entry }));
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...withIds, ...history]));
  return withIds;
}

export function removeCalculation(id) {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
