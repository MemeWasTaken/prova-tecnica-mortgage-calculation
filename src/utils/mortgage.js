export function calculateMortgage({ amount, rate, termYears, paymentsPerYear }) {
  const periodicRate = rate / 100 / paymentsPerYear;
  const totalPayments = termYears * paymentsPerYear;

  const installment =
    periodicRate === 0
      ? amount / totalPayments
      : (amount * periodicRate * (1 + periodicRate) ** totalPayments) /
        ((1 + periodicRate) ** totalPayments - 1);

  const totalPayment = installment * totalPayments;
  const totalInterest = totalPayment - amount;

  return { installment, totalPayment, totalInterest };
}
