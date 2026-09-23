/**
 * Formatting helpers for displaying currency, dates and payment frequencies
 * in the UI. All functions are pure and rely on the built-in `Intl` APIs.
 */

/**
 * Formats a number as a currency-style string using the Italian locale:
 * dot as thousands separator, comma as decimal separator, always two
 * decimals (e.g. `1234.5` -> `"1.234,50"`).
 *
 * The currency symbol is intentionally not included; the caller adds it.
 *
 * @param {number} value - Amount to format.
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

/**
 * Formats an ISO 8601 date string as a short, human-readable date using the
 * en-GB locale (e.g. `"2025-03-07T10:15:00.000Z"` -> `"7 Mar 2025"`).
 *
 * The date is rendered in the user's local time zone.
 *
 * @param {string} isoString - ISO 8601 date/timestamp.
 * @returns {string}
 */
export function formatDate(isoString) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));
}

/**
 * Formats an ISO 8601 date string as date and 24-hour time, separated by
 * " - " (e.g. `"7 Mar 2025 - 10:15"`). The date part is produced by
 * `formatDate`; the time is rendered in the user's local time zone.
 *
 * @param {string} isoString - ISO 8601 date/timestamp.
 * @returns {string}
 */
export function formatDateTime(isoString) {
  const date = formatDate(isoString);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(isoString));
  return `${date} - ${time}`;
}

/** Display labels for the supported payment frequencies (payments per year). */
const PAYMENTS_LABELS = {
  12: 'Monthly',
  4: 'Quarterly',
  2: 'Semi-annual',
  1: 'Annual',
};

/**
 * Converts a number of payments per year into a readable label
 * (e.g. `12` -> `"Monthly"`). Unsupported values fall back to a generic
 * `"<n>/yr"` format (e.g. `6` -> `"6/yr"`).
 *
 * @param {number} paymentsPerYear - Number of payments made each year.
 * @returns {string}
 */
export function formatPaymentsFrequency(paymentsPerYear) {
  return PAYMENTS_LABELS[paymentsPerYear] ?? `${paymentsPerYear}/yr`;
}
