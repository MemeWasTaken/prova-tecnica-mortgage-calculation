import { formatCurrency, formatDateTime } from '../../utils/format';

export default function ComparisonPanel({ entries, onClose }) {
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

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#F8F9FB] text-xs text-gray-400 uppercase">
              <th className="sticky left-0 z-10 bg-[#F8F9FB] px-4 py-3 font-medium">
                Parameter
              </th>
              {entries.map((entry, index) => (
                <th key={entry.id} className="px-4 py-3 font-medium">
                  Sim #{index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-gray-500">
                  {row.label}
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className={`px-4 py-3 whitespace-nowrap ${
                      row.highlight ? 'font-semibold text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {row.render(entry)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
