import { useState } from 'react';
import FormField from './FormField';
import ToggleGroup from './ToggleGroup';
import SegmentedToggle from './SegmentedToggle';
import {
  PAYMENT_FREQUENCIES,
  RATE_TYPES,
  LOAN_CONSTRAINTS,
  LOAN_DEFAULTS,
} from '../../config/loanDefaults';

/**
 * Loan parameters form: collects the inputs, validates them and reports the
 * result to the parent through callbacks.
 *
 * Fields: loan amount, annual interest rate, term (slider synchronized with
 * a numeric input), payments per year and rate type. The form is a
 * controlled component: values live in local state and the parent only
 * receives them on submit.
 *
 * Behavior:
 *   - Submit validates `amount` (> 0) and `rate` (>= 0). On errors they are
 *     shown next to the fields and `onCalculate(null)` is called; otherwise
 *     `onCalculate` receives the parsed values.
 *   - Any field change calls `onCalculate(null)` and resets the "saved"
 *     state: the displayed result would be stale, so it is cleared until the
 *     user calculates again.
 *   - The Save button only appears when a result exists (`hasResult`) and is
 *     disabled after a click, until the next change or submit.
 *   - If `onSave` throws (e.g. browser storage full or blocked), a dismissible
 *     error banner is shown above the buttons and Save stays available so
 *     the user can try again. The banner is cleared on dismiss, on any field
 *     change, on a new submit and on a successful save.
 *   - The form uses `noValidate`: validation is done in JS with custom
 *     messages instead of the browser's native bubbles.
 *
 * @param {Object} props
 * @param {(values: {
 *   amount: number,
 *   rate: number,
 *   termYears: number,
 *   paymentsPerYear: number,
 *   rateType: string,
 * } | null) => void} props.onCalculate - Receives the validated values, or
 *   `null` to clear the current result.
 * @param {() => void} props.onSave - Called when the user clicks Save. It may
 *   throw to signal that the simulation could not be saved.
 * @param {boolean} props.hasResult - Whether a result is currently displayed
 *   (controls the visibility of the Save button).
 */
export default function LoanForm({ onCalculate, onSave, hasResult }) {
  // Amount and rate are kept as strings so the inputs can be empty; they are
  // converted to numbers on submit.
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [termYears, setTermYears] = useState(LOAN_DEFAULTS.termYears);
  const [paymentsPerYear, setPaymentsPerYear] = useState(LOAN_DEFAULTS.paymentsPerYear);
  const [rateType, setRateType] = useState(LOAN_DEFAULTS.rateType);
  // Validation messages keyed by field name (`amount`, `rate`).
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  // Whether the last attempt to save failed (shows the error banner).
  const [saveError, setSaveError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    const numericRate = Number(rate);
    const nextErrors = {};

    if (!amount || numericAmount <= 0) {
      nextErrors.amount = 'Enter a valid loan amount greater than 0';
    }
    if (rate === '' || numericRate < 0) {
      nextErrors.rate = 'Enter a valid interest rate (0% or above)';
    }

    setErrors(nextErrors);
    setIsSaved(false);
    setSaveError(false);
    if (Object.keys(nextErrors).length > 0) {
      onCalculate(null);
      return;
    }

    onCalculate({
      amount: numericAmount,
      rate: numericRate,
      termYears,
      paymentsPerYear,
      rateType,
    });
  };

  // Builds a change handler for a field: updates its state and invalidates the
  // current result, which no longer matches the inputs.
  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setIsSaved(false);
    setSaveError(false);
    onCalculate(null);
  };

  // Saving can fail (e.g. storage full or blocked): on failure show the banner
  // and leave the Save button in its default state so the user can retry.
  const handleSaveClick = () => {
    try {
      onSave();
      setIsSaved(true);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="loan-parameters-heading"
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 id="loan-parameters-heading" className="sr-only font-semibold text-gray-900 sm:not-sr-only">
        Loan parameters
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:block">
        <FormField label="Loan amount" htmlFor="amount" required error={errors.amount}>
          <div
            className={`mt-1 flex items-center rounded-md border px-3 ${
              errors.amount ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <span className="text-gray-400">€</span>
            <input
              id="amount"
              type="number"
              min={LOAN_CONSTRAINTS.amount.min}
              value={amount}
              onChange={(e) => handleFieldChange(setAmount)(e.target.value)}
              placeholder="200,000"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className="w-full bg-transparent px-2 py-2 text-xs outline-none sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </FormField>

        <FormField
          label={
            <>
              <span className="sm:hidden">Interest rate</span>
              <span className="hidden sm:inline">Annual interest rate</span>
            </>
          }
          htmlFor="rate"
          required
          error={errors.rate}
        >
          <div
            className={`mt-1 flex items-center rounded-md border px-3 ${
              errors.rate ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <input
              id="rate"
              type="number"
              min={LOAN_CONSTRAINTS.rate.min}
              step={LOAN_CONSTRAINTS.rate.step}
              value={rate}
              onChange={(e) => handleFieldChange(setRate)(e.target.value)}
              placeholder={String(LOAN_CONSTRAINTS.rate.placeholder)}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.rate)}
              aria-describedby={errors.rate ? 'rate-error' : undefined}
              className="w-full bg-transparent py-2 text-xs outline-none sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-gray-400">%</span>
          </div>
        </FormField>
      </div>

      {/* Term: slider and numeric input edit the same value. */}
      <FormField label="Loan term" htmlFor="term" required>
        <div className="mt-2 flex items-center gap-4">
          <input
            id="term"
            type="range"
            min={LOAN_CONSTRAINTS.termYears.min}
            max={LOAN_CONSTRAINTS.termYears.max}
            value={termYears}
            onChange={(e) => handleFieldChange(setTermYears)(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-600"
          />
          <div className="flex w-16 shrink-0 items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm">
            <input
              type="number"
              min={LOAN_CONSTRAINTS.termYears.min}
              max={LOAN_CONSTRAINTS.termYears.max}
              value={termYears}
              onChange={(e) => {
                const { value } = e.target;
                // Ignore an empty input so the user can retype the number.
                if (value === '') return;
                // Keep the typed value inside the allowed term range.
                const clamped = Math.min(
                  LOAN_CONSTRAINTS.termYears.max,
                  Math.max(LOAN_CONSTRAINTS.termYears.min, Number(value)),
                );
                handleFieldChange(setTermYears)(clamped);
              }}
              aria-labelledby="term-label term-unit"
              className="w-6 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span id="term-unit" className="text-gray-400">yr</span>
          </div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{LOAN_CONSTRAINTS.termYears.min} yr</span>
          <span>{LOAN_CONSTRAINTS.termYears.max} yr</span>
        </div>
      </FormField>

      <ToggleGroup
        label="Payments per year"
        required
        labelId="payments-label"
        options={PAYMENT_FREQUENCIES}
        value={paymentsPerYear}
        onChange={handleFieldChange(setPaymentsPerYear)}
      />
      {/* Read-only recap of the chosen frequency, announced when it changes. */}
      <div
        aria-live="polite"
        className="mt-2 flex items-center justify-end rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500"
      >
        <span>{paymentsPerYear}</span>
        <span className="ml-1 text-gray-400">/yr</span>
      </div>

      <SegmentedToggle
        label="Rate type"
        labelId="rate-type-label"
        options={RATE_TYPES}
        value={rateType}
        onChange={handleFieldChange(setRateType)}
      />

      {saveError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="flex-1">
            Unable to save this simulation. Your browser storage may be full or blocked. Try
            disabling private browsing or freeing up space.
          </p>
          <button
            type="button"
            onClick={() => setSaveError(false)}
            aria-label="Dismiss error"
            className="shrink-0 rounded hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 sm:text-sm"
        >
          Calculate
        </button>

        {hasResult && (
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaved}
            aria-live="polite"
            className={`w-28 shrink-0 rounded-md border px-4 py-2.5 text-xs font-semibold sm:text-sm ${
              isSaved
                ? 'border-green-300 bg-green-50 text-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isSaved ? '✓ Saved' : '+ Save'}
          </button>
        )}
      </div>
    </form>
  );
}
