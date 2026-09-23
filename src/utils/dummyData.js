/**
 * Dummy data generator for the calculation history.
 *
 * Produces a list of random but realistic mortgage entries, used to
 * pre-populate the history page for demo/testing purposes. Each entry has the
 * same shape as a real history entry saved by the calculator.
 */
import { calculateMortgage } from './mortgage';

/** Loan amount bounds (currency units, inclusive). */
const AMOUNT_RANGE = { min: 50000, max: 520000 };

/** Annual interest rate bounds, in percent (e.g. 1.99 means 1.99%). */
const RATE_RANGE = { min: 1.99, max: 5 };

/** Loan duration bounds, in years (inclusive). */
const DURATION_RANGE = { min: 5, max: 40 };

/**
 * Allowed payment frequencies, expressed as payments per year:
 * 12 = monthly, 4 = quarterly, 2 = semi-annual, 1 = annual.
 */
const PAYMENT_FREQUENCIES = [12, 4, 2, 1];

/** Allowed interest rate types. */
const RATE_TYPES = ['Fixed', 'Variable'];

/** Entry dates are randomly picked within this many days before today. */
const MAX_DAYS_BACK = 45;

/** Number of entries produced by each call to `generateDummyEntries`. */
const ENTRIES_COUNT = 10;

/**
 * Returns a random floating-point number in the range [min, max).
 *
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (exclusive).
 * @returns {number}
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer in the range [min, max] (both inclusive).
 *
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number}
 */
function randomIntInRange(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

/**
 * Picks a random element from an array.
 *
 * @template T
 * @param {T[]} options - Non-empty array to pick from.
 * @returns {T}
 */
function randomFromArray(options) {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generates a list of random mortgage history entries.
 *
 * For each entry, random inputs (amount, rate, duration, payment frequency and
 * rate type) are drawn from the ranges defined above, and the resulting
 * installment and totals are computed with `calculateMortgage` so the data is
 * internally consistent. The date is set to a random day within the last
 * `MAX_DAYS_BACK` days.
 *
 * The output is non-deterministic: every call returns different data.
 *
 * @returns {Array<{
 *   date: string,     // ISO 8601 timestamp of the calculation
 *   amount: number,   // Loan amount
 *   rate: number,     // Annual interest rate in percent, 2 decimals
 *   duration: number, // Loan duration in years
 *   payments: number, // Payments per year (12, 4, 2 or 1)
 *   type: string,     // Rate type: 'Fixed' or 'Variable'
 *   monthly: number,  // Installment amount per payment period
 *   total: number,    // Total amount repaid over the whole loan
 *   interest: number, // Total interest paid over the whole loan
 * }>}
 */
export function generateDummyEntries() {
  return Array.from({ length: ENTRIES_COUNT }, () => {
    const amount = randomIntInRange(AMOUNT_RANGE.min, AMOUNT_RANGE.max);
    // Rounded to 2 decimals to mimic a rate typed by a user.
    const rate = Number(randomInRange(RATE_RANGE.min, RATE_RANGE.max).toFixed(2));
    const duration = randomIntInRange(DURATION_RANGE.min, DURATION_RANGE.max);
    const payments = randomFromArray(PAYMENT_FREQUENCIES);
    const type = randomFromArray(RATE_TYPES);

    const { installment, totalPayment, totalInterest } = calculateMortgage({
      amount,
      rate,
      termYears: duration,
      paymentsPerYear: payments,
    });

    // Random date between today and MAX_DAYS_BACK days ago.
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * MAX_DAYS_BACK));

    return {
      date: date.toISOString(),
      amount,
      rate,
      duration,
      payments,
      type,
      // `monthly` holds the installment per payment period, which is only
      // monthly when `payments` is 12.
      monthly: installment,
      total: totalPayment,
      interest: totalInterest,
    };
  });
}
