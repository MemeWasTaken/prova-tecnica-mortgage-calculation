export function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

export function formatDate(isoString) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));
}

const PAYMENTS_LABELS = {
  12: 'Monthly',
  4: 'Quarterly',
  2: 'Semi-annual',
  1: 'Annual',
};

export function formatPaymentsFrequency(paymentsPerYear) {
  return PAYMENTS_LABELS[paymentsPerYear] ?? `${paymentsPerYear}/yr`;
}
