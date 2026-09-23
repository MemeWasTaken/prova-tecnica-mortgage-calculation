import { formatCurrency, formatDateTime } from '../utils/format';

export const COMPARISON_ROWS = [
  { label: 'Date', render: (entry) => formatDateTime(entry.date) },
  { label: 'Amount', render: (entry) => `€ ${formatCurrency(entry.amount)}` },
  { label: 'Rate', render: (entry) => `${entry.rate}%` },
  { label: 'Duration', render: (entry) => `${entry.duration} yr` },
  { label: 'Payments/yr', render: (entry) => entry.payments },
  { label: 'Type', render: (entry) => entry.type.toLowerCase() },
  {
    label: 'Installment',
    render: (entry) => `€ ${formatCurrency(entry.monthly)}`,
    highlight: true,
  },
  { label: 'Total', render: (entry) => `€ ${formatCurrency(entry.total)}` },
  { label: 'Interest', render: (entry) => `€ ${formatCurrency(entry.interest)}` },
];
