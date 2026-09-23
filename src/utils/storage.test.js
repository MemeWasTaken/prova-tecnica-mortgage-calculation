import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHistory,
  saveCalculation,
  addDummyEntries,
  removeCalculation,
  clearHistory,
} from './storage';

const HISTORY_KEY = 'mortgage-history';

beforeEach(() => {
  localStorage.clear();
});

describe('getHistory', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(getHistory()).toEqual([]);
  });

  it('returns the parsed history when valid JSON is stored', () => {
    const entries = [{ id: '1', amount: 1000 }];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));

    expect(getHistory()).toEqual(entries);
  });

  it('returns an empty array without throwing when the stored value is corrupted', () => {
    localStorage.setItem(HISTORY_KEY, '{not valid json');

    expect(getHistory()).toEqual([]);
  });

  it.each([
    ['an object', '{}'],
    ['a string', '"text"'],
    ['a number', '42'],
    ['null', 'null'],
  ])('returns an empty array when the stored value is valid JSON but %s, not an array', (_, stored) => {
    localStorage.setItem(HISTORY_KEY, stored);

    expect(getHistory()).toEqual([]);
  });

  it('lets a new entry be saved after a non-array value was stored', () => {
    localStorage.setItem(HISTORY_KEY, '{}');

    saveCalculation({ amount: 1000 });

    expect(getHistory()).toHaveLength(1);
  });
});

describe('saveCalculation', () => {
  it('creates the history with a single entry with a generated id', () => {
    saveCalculation({ amount: 1000, rate: 3.5 });

    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ amount: 1000, rate: 3.5 });
    expect(typeof history[0].id).toBe('string');
    expect(history[0].id.length).toBeGreaterThan(0);
  });

  it('prepends a new entry before the existing ones', () => {
    saveCalculation({ amount: 1000 });
    saveCalculation({ amount: 2000 });

    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({ amount: 2000 });
    expect(history[1]).toMatchObject({ amount: 1000 });
  });

  it('persists the entry to localStorage', () => {
    saveCalculation({ amount: 1000 });

    expect(JSON.parse(localStorage.getItem(HISTORY_KEY))).toHaveLength(1);
  });
});

describe('addDummyEntries', () => {
  it('adds multiple entries at once, each with a generated id', () => {
    const result = addDummyEntries([{ amount: 100 }, { amount: 200 }]);

    expect(result).toHaveLength(2);
    result.forEach((entry) => {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
    });
    expect(result[0].id).not.toBe(result[1].id);
  });

  it('places the new entries before the existing history', () => {
    saveCalculation({ amount: 1000 });
    addDummyEntries([{ amount: 100 }]);

    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({ amount: 100 });
    expect(history[1]).toMatchObject({ amount: 1000 });
  });

  it('returns only the newly added entries, not the full history', () => {
    saveCalculation({ amount: 1000 });
    const result = addDummyEntries([{ amount: 100 }]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ amount: 100 });
  });
});

describe('removeCalculation', () => {
  it('removes the entry matching the given id', () => {
    saveCalculation({ amount: 1000 });
    const [{ id }] = getHistory();

    removeCalculation(id);

    expect(getHistory()).toEqual([]);
  });

  it('leaves the history unchanged when the id does not exist', () => {
    saveCalculation({ amount: 1000 });

    removeCalculation('non-existent-id');

    expect(getHistory()).toHaveLength(1);
  });
});

describe('clearHistory', () => {
  it('makes getHistory return an empty array', () => {
    saveCalculation({ amount: 1000 });

    clearHistory();

    expect(getHistory()).toEqual([]);
  });

  it('removes the key from localStorage entirely', () => {
    saveCalculation({ amount: 1000 });

    clearHistory();

    expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
  });
});
