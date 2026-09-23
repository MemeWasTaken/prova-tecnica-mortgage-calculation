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

export default function LoanForm({ onCalculate, onSave, hasResult }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [termYears, setTermYears] = useState(LOAN_DEFAULTS.termYears);
  const [paymentsPerYear, setPaymentsPerYear] = useState(LOAN_DEFAULTS.paymentsPerYear);
  const [rateType, setRateType] = useState(LOAN_DEFAULTS.rateType);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

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

  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setIsSaved(false);
    onCalculate(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="loan-parameters-heading"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 id="loan-parameters-heading" className="font-semibold text-gray-900">
        Loan parameters
      </h2>

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
            className="w-full bg-transparent px-2 py-2 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </FormField>

      <FormField label="Annual interest rate" htmlFor="rate" required error={errors.rate}>
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
            className="w-full bg-transparent py-2 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-gray-400">%</span>
        </div>
      </FormField>

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
                if (value === '') return;
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

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Calculate
        </button>

        {hasResult && (
          <button
            type="button"
            onClick={() => {
              onSave();
              setIsSaved(true);
            }}
            disabled={isSaved}
            aria-live="polite"
            className={`w-28 shrink-0 rounded-md border px-4 py-2.5 text-sm font-semibold ${
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
