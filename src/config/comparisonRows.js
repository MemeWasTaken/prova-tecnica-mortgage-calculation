import { formatCurrency, formatDateTime } from '../utils/format';

/**
 * Configuration of the rows shown when comparing saved simulations.
 *
 * It is shared by both comparison views (`ComparisonPanel` on desktop and
 * `ComparisonCardList` on mobile), so the two always show the same fields in
 * the same order. To add, remove or reorder a comparison field, edit this
 * list only.
 *
 * Each row has the following shape:
 *   - `label`      {string}   Text displayed as the row/parameter name.
 *   - `render`     {Function} Receives a history entry and returns the
 *                             formatted value to display.
 *   - `highlight`  {boolean}  Optional. When true, the row is visually
 *                             emphasized by the views (used for the key
 *                             figure, the installment).
 *
 * @type {Array<{
 *   label: string,
 *   render: (entry: Object) => string | number,
 *   highlight?: boolean,
 * }>}
 */
export const COMPARISON_ROWS = [
  { label: 'Date', render: (entry) => formatDateTime(entry.date) },
  { label: 'Amount', render: (entry) => `€ ${formatCurrency(entry.amount)}` },
  { label: 'Rate', render: (entry) => `${entry.rate}%` },
  { label: 'Duration', render: (entry) => `${entry.duration} yr` },
  // Raw number of payments per year (not the "Monthly"/"Quarterly" label).
  { label: 'Payments/yr', render: (entry) => entry.payments },
  { label: 'Type', render: (entry) => entry.type.toLowerCase() },
  {
    label: 'Installment',
    // `entry.monthly` is the installment per payment period, whatever the
    // payment frequency is.
    render: (entry) => `€ ${formatCurrency(entry.monthly)}`,
    highlight: true,
  },
  { label: 'Total', render: (entry) => `€ ${formatCurrency(entry.total)}` },
  { label: 'Interest', render: (entry) => `€ ${formatCurrency(entry.interest)}` },
];
