import { calculateMortgage } from '../../utils/mortgage';
import { formatCurrency } from '../../utils/format';

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-400">
          +
        </div>
        <p className="text-sm font-medium text-gray-500">No result yet</p>
        <p className="text-xs text-gray-400">Fill in the form and press Calculate to see your estimate.</p>
      </div>
    );
  }

  const { amount, rate, termYears, paymentsPerYear, rateType } = result;
  const { installment, totalPayment, totalInterest } = calculateMortgage({
    amount,
    rate,
    termYears,
    paymentsPerYear,
  });

  return (
    <div>
      <div className="rounded-lg bg-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-indigo-100 uppercase">
            Estimated monthly installment
          </span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase">
            {rateType}
          </span>
        </div>

        <p className="mt-2 text-3xl font-bold">€ {formatCurrency(installment)}</p>

        <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
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

      {rateType === 'Variable' && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          ⚠️ Variable rate estimates are indicative only. Your installment may change as market
          rates fluctuate.
        </div>
      )}
    </div>
  );
}
