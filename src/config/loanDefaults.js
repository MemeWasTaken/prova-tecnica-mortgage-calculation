/**
 * Configuration for the loan form: selectable options, input constraints and
 * initial values. Centralized here so the form (`LoanForm`) contains no
 * hard-coded magic numbers or labels.
 */

/**
 * Selectable payment frequencies. `value` is the number of payments per year
 * (this is what `calculateMortgage` receives as `paymentsPerYear`), `label`
 * is the text shown to the user.
 *
 * @type {Array<{ label: string, value: number }>}
 */
export const PAYMENT_FREQUENCIES = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Semi-annual', value: 2 },
  { label: 'Annual', value: 1 },
];

/**
 * Selectable interest rate types. The rate type is informational: it is
 * stored with the calculation but does not affect the computed result.
 *
 * @type {Array<{ label: string, value: string }>}
 */
export const RATE_TYPES = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'Variable', value: 'Variable' },
];

/**
 * HTML input constraints for the loan form fields.
 *
 *   - `amount`:    loan principal; minimum only, no upper limit.
 *   - `rate`:      annual interest rate in percent; `step` is the input
 *                  increment and `placeholder` is an example value shown
 *                  when the field is empty.
 *   - `termYears`: loan duration in years; used both as the input bounds and
 *                  to clamp the value typed by the user.
 */
export const LOAN_CONSTRAINTS = {
  amount: { min: 0 },
  rate: { min: 0, step: 0.01, placeholder: 3.75 },
  termYears: { min: 1, max: 40 },
};

/**
 * Initial values of the form fields for the ones that are pre-filled.
 * `amount` and `rate` are intentionally not listed: they start empty.
 */
export const LOAN_DEFAULTS = {
  termYears: 20,
  paymentsPerYear: 12,
  rateType: 'Fixed',
};
