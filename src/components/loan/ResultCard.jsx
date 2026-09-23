import { formatCurrency } from '../../utils/format';

/**
 * Displays the outcome of a mortgage calculation.
 *
 * Three states:
 *   - No result: a dashed placeholder inviting the user to run a calculation.
 *     It is hidden below the `sm` breakpoint, where an empty box would only
 *     add noise on small screens.
 *   - Result: a highlighted card with the estimated installment, plus the
 *     input parameters and the total payment and total interest.
 *   - Variable rate: the result is followed by a warning that the estimate
 *     may change with market rates.
 *
 * @param {Object} props
 * @param {{
 *   amount: number,
 *   rate: number,
 *   termYears: number,
 *   paymentsPerYear: number,
 *   rateType: string,
 *   installment: number,
 *   totalPayment: number,
 *   totalInterest: number,
 * } | null} props.result - Calculation result (form values plus computed
 *   figures, see `CalculatorPage`), or `null` when there is none.
 */
export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="hidden min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-center sm:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-400">
          +
        </div>
        <p className="text-sm font-medium text-gray-500">No result yet</p>
        <p className="text-xs text-gray-400">Fill in the form and press Calculate to see your estimate.</p>
      </div>
    );
  }

  // Form inputs echoed back, plus the computed figures.
  const { amount, rate, termYears, paymentsPerYear, rateType, installment, totalPayment, totalInterest } =
    result;

  return (
    <div>
      <div className="rounded-lg bg-indigo-600 p-4 text-white sm:p-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide text-indigo-100 uppercase sm:text-xs">
            Estimated installment
          </span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase sm:text-xs">
            {rateType}
          </span>
        </div>

        <p className="mt-2 text-2xl font-bold sm:text-3xl">€ {formatCurrency(installment)}</p>

        <div className="mt-6 grid grid-cols-2 gap-y-4 text-xs sm:text-sm">
          <div>
            <p className="text-xs text-indigo-200 uppercase">Principal</p>
            <p className="mt-0.5 font-semibold">€ {formatCurrency(amount)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase">Annual rate</p>
            <p className="mt-0.5 font-semibold">{rate}%</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase">Duration</p>
            <p className="mt-0.5 font-semibold">{termYears} years</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase">Payments/yr</p>
            <p className="mt-0.5 font-semibold">{paymentsPerYear}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase">Total payment</p>
            <p className="mt-0.5 font-semibold">€ {formatCurrency(totalPayment)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase">Total interest</p>
            <p className="mt-0.5 font-semibold">€ {formatCurrency(totalInterest)}</p>
          </div>
        </div>
      </div>

      {/* Variable-rate estimates are not reliable long term: warn the user. */}
      {rateType === 'Variable' && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          ⚠️ Variable rate estimates are indicative only. Your installment may change as market
          rates fluctuate.
        </div>
      )}
    </div>
  );
}
