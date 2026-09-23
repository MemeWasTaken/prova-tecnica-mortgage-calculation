import { formatCurrency, formatDateTime } from '../../utils/format';

export default function ComparisonCardList({ entries, onClose }) {
  if (entries.length < 2) return null;

  const rows = [
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

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="font-semibold text-gray-900">Comparison</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comparison"
          className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 px-4">
        {rows.map((row) => (
          <div key={row.label} className="py-3">
            <p className="text-xs font-medium text-gray-400 uppercase">{row.label}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {entries.map((entry, index) => (
                <div key={entry.id} className="rounded-md bg-[#F8F9FB] px-3 py-2">
                  <p className="text-[11px] text-gray-400">Sim #{index + 1}</p>
                  <p
                    className={`text-sm ${row.highlight ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                  >
                    {row.render(entry)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
