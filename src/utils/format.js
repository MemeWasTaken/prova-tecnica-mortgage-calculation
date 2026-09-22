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

export function formatDateTime(isoString) {
  const date = formatDate(isoString);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(isoString));
  return `${date} - ${time}`;
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
