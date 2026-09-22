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

