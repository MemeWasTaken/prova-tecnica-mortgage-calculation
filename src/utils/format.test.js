import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, formatPaymentsFrequency } from './format';

describe('formatCurrency', () => {
  it('formats a decimal value with thousands and decimal separators', () => {
    expect(formatCurrency(1234.5)).toBe('1.234,50');
  });

  it('formats an integer with two decimal places', () => {
    expect(formatCurrency(1000)).toBe('1.000,00');
  });

  it('rounds values with more than two decimal places', () => {
    expect(formatCurrency(1234.567)).toBe('1.234,57');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0,00');
  });

  it('keeps the sign for negative values', () => {
    expect(formatCurrency(-500)).toBe('-500,00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string with a numeric day, short month and year', () => {
    expect(formatDate('2026-03-15')).toBe('15 Mar 2026');
  });

  it('formats a date without a time component without shifting the day', () => {
    expect(formatDate('2026-01-01')).toBe('1 Jan 2026');
  });

  it('formats a leap-year February 29th correctly', () => {
    expect(formatDate('2024-02-29')).toBe('29 Feb 2024');
  });
});

describe('formatDateTime', () => {
  it('combines the formatted date and 24h time separated by a dash', () => {
    expect(formatDateTime('2026-03-15T14:30:00')).toBe('15 Mar 2026 - 14:30');
  });

  it('formats midnight as 00:00, not 12 AM or 24:00', () => {
    expect(formatDateTime('2026-03-15T00:00:00')).toBe('15 Mar 2026 - 00:00');
  });
});

describe('formatPaymentsFrequency', () => {
  it('maps 12 to Monthly', () => {
    expect(formatPaymentsFrequency(12)).toBe('Monthly');
  });

  it('maps 4 to Quarterly', () => {
    expect(formatPaymentsFrequency(4)).toBe('Quarterly');
  });

  it('maps 2 to Semi-annual', () => {
    expect(formatPaymentsFrequency(2)).toBe('Semi-annual');
  });

  it('maps 1 to Annual', () => {
    expect(formatPaymentsFrequency(1)).toBe('Annual');
  });

  it('falls back to "<value>/yr" for an unmapped frequency', () => {
    expect(formatPaymentsFrequency(6)).toBe('6/yr');
  });
});
