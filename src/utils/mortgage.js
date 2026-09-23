/**
 * Calculates the installment and totals of a fixed-rate amortizing loan
 * (French amortization: constant installment, interest computed on the
 * outstanding balance).
 *
 * Formula, with:
 *   P = amount
 *   i = periodic rate = rate / 100 / paymentsPerYear
 *   n = total number of payments = termYears * paymentsPerYear
 *
 *   installment = P * i * (1 + i)^n / ((1 + i)^n - 1)
 *
 * When the rate is 0 the formula is undefined (division by zero), so the
 * installment is simply the amount split evenly across all payments.
 *
 * Results are not rounded; rounding is left to the presentation layer.
 * No input validation is performed here: callers are expected to pass
 * positive values (`termYears` and `paymentsPerYear` must be > 0 to avoid
 * `Infinity`/`NaN` results).
 *
 * @param {Object} params
 * @param {number} params.amount - Loan principal.
 * @param {number} params.rate - Annual interest rate in percent (e.g. 3.5 for 3.5%).
 * @param {number} params.termYears - Loan duration in years.
 * @param {number} params.paymentsPerYear - Payments per year (12 monthly, 4 quarterly, 2 semi-annual, 1 annual).
 * @returns {{
 *   installment: number,   // Amount of each periodic payment
 *   totalPayment: number,  // Sum of all payments (principal + interest)
 *   totalInterest: number, // Total interest paid (totalPayment - amount)
 * }}
 */
export function calculateMortgage({ amount, rate, termYears, paymentsPerYear }) {
  // Convert the annual percentage rate into the rate applied per payment period.
  const periodicRate = rate / 100 / paymentsPerYear;
  const totalPayments = termYears * paymentsPerYear;

  // Zero-interest case: the standard formula would divide by zero.
  const installment =
    periodicRate === 0
      ? amount / totalPayments
      : (amount * periodicRate * (1 + periodicRate) ** totalPayments) /
        ((1 + periodicRate) ** totalPayments - 1);

  const totalPayment = installment * totalPayments;
  const totalInterest = totalPayment - amount;

  return { installment, totalPayment, totalInterest };
}
