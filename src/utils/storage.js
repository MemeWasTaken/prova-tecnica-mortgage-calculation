/**
 * Persistence layer for the calculation history, backed by `localStorage`.
 *
 * The whole history is stored as a single JSON array under `HISTORY_KEY`,
 * ordered from newest to oldest. Every write reads the current array,
 * modifies it and writes it back, so there is no in-memory cache.
 *
 * Each stored entry is the calculation data plus a generated `id`
 * (see `generateDummyEntries` for the entry shape).
 */

/** `localStorage` key under which the history array is saved. */
const HISTORY_KEY = 'mortgage-history';

/**
 * Reads the saved history.
 *
 * Fails safe: if nothing is stored, the stored JSON is corrupted, or
 * `localStorage` is unavailable (e.g. blocked by browser privacy settings),
 * an empty array is returned instead of throwing.
 *
 * @returns {Array<Object>} History entries, newest first.
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new calculation at the top of the history.
 *
 * A unique `id` is generated and assigned to the entry. Note that `id` is
 * spread first, so an `id` already present in `entry` takes precedence.
 * Unlike reads, writes are not wrapped in try/catch: a full or unavailable
 * storage will throw (e.g. `QuotaExceededError`).
 *
 * @param {Object} entry - Calculation data to store (without `id`).
 * @returns {void}
 */
export function saveCalculation(entry) {
  const history = getHistory();
  history.unshift({ id: crypto.randomUUID(), ...entry });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Prepends a batch of entries (typically from `generateDummyEntries`) to the
 * history, assigning each a unique `id`. Existing entries are preserved.
 *
 * @param {Array<Object>} entries - Entries to add (without `id`).
 * @returns {Array<Object>} The newly added entries, including their ids, so
 *   the caller can update its state without re-reading the storage.
 */
export function addDummyEntries(entries) {
  const history = getHistory();
  const withIds = entries.map((entry) => ({ id: crypto.randomUUID(), ...entry }));
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...withIds, ...history]));
  return withIds;
}

/**
 * Removes a single entry from the history. Does nothing if no entry with the
 * given id exists.
 *
 * @param {string} id - Id of the entry to remove.
 * @returns {void}
 */
export function removeCalculation(id) {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Deletes the whole history from `localStorage`.
 *
 * @returns {void}
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
