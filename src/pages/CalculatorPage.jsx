import { useEffect, useEffectEvent, useRef, useState } from 'react';
import Container from '../components/Container';
import LoanForm from '../components/loan/LoanForm';
import ResultCard from '../components/loan/ResultCard';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SIMULATED_SAVE_ERROR } from '../config/loanDefaults';
import { calculateMortgage } from '../utils/mortgage';
import { saveCalculation } from '../utils/storage';

/**
 * Home page: the mortgage calculator.
 *
 * Composes `LoanForm` (input) and `ResultCard` (output) and owns the
 * calculation `result` state. The two components do not know each other: the
 * form reports its values through callbacks and this page computes and stores
 * the result, then passes it down to the card.
 *
 * `result` is `null` until a valid calculation is made, otherwise it holds the
 * form values plus `installment`, `totalPayment` and `totalInterest`.
 *
 * Layout: form and result are side by side from the `lg` breakpoint (1024px)
 * and stacked below it.
 */
export default function CalculatorPage() {
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  // Must match the `lg:` breakpoint used for the grid layout below.
  const isSideBySide = useMediaQuery('(min-width: 1024px)');

  // Effect Event: reads the latest `isSideBySide` without making the effect
  // below re-run when the viewport is resized.
  const scrollToResult = useEffectEvent(() => {
    // When the result is already visible next to the form there is no need to scroll.
    if (isSideBySide) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // On stacked (mobile/tablet) layouts the result appears below the fold, so
  // bring it into view whenever a new result is produced.
  useEffect(() => {
    if (result) scrollToResult();
  }, [result]);

  /**
   * Called by `LoanForm` when the user submits the form.
   *
   * @param {{ amount: number, rate: number, termYears: number,
   *   paymentsPerYear: number, rateType: string } | null} formValues
   *   Validated form values, or a falsy value to clear the current result.
   */
  const handleCalculate = (formValues) => {
    if (!formValues) {
      setResult(null);
      return;
    }

    const { installment, totalPayment, totalInterest } = calculateMortgage(formValues);
    setResult({ ...formValues, installment, totalPayment, totalInterest });
  };

  /**
   * Called by `LoanForm` when the user saves the current calculation.
   * Converts the result into the history entry shape (see `generateDummyEntries`)
   * and persists it. Does nothing if there is no result yet.
   *
   * Throws if the simulation cannot be saved (e.g. the browser storage is full
   * or blocked); `LoanForm` catches it and shows an error banner. For demo and
   * testing purposes, a calculation matching `SIMULATED_SAVE_ERROR`
   * (amount 1 and rate 1) fails on purpose to trigger that banner.
   */
  const handleSave = () => {
    if (!result) return;

    if (
      result.amount === SIMULATED_SAVE_ERROR.amount &&
      result.rate === SIMULATED_SAVE_ERROR.rate
    ) {
      throw new Error('Simulated save error (demo trigger: amount 1, rate 1)');
    }

    saveCalculation({
      date: new Date().toISOString(),
      amount: result.amount,
      rate: result.rate,
      duration: result.termYears,
      payments: result.paymentsPerYear,
      type: result.rateType,
      monthly: result.installment,
      total: result.totalPayment,
      interest: result.totalInterest,
    });
  };

  return (
    <main className="flex-1">
      <Container className="py-6 sm:py-10">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Mortgage Calculator</h1>
        <p className="mt-2 text-xs text-gray-500 sm:text-base">
          <span className="sm:hidden">Estimate your monthly repayment.</span>
          <span className="hidden sm:inline">
            Enter your loan parameters below to estimate your repayment schedule.
          </span>
        </p>

        <div className="mt-6 grid items-start gap-6 sm:mt-8 lg:grid-cols-2">
          <LoanForm onCalculate={handleCalculate} onSave={handleSave} hasResult={Boolean(result)} />
          <div ref={resultRef}>
            <ResultCard result={result} />
          </div>
        </div>
      </Container>
    </main>
  );
}
