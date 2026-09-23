import { formatCurrency, formatDate, formatPaymentsFrequency } from '../../utils/format';
import SelectionCheckbox from './SelectionCheckbox';
import TypeBadge from './TypeBadge';
import DeleteButton from './DeleteButton';

export default function SimulationTable({ history, selectedIds, onToggleSelect, onDelete }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-[#F8F9FB] text-xs text-gray-400 uppercase">
            <th className="w-10 px-4 py-3">
              <span className="sr-only">Select</span>
            </th>
            <th className="px-2 py-3 font-medium">Date</th>
            <th className="px-2 py-3 font-medium">Amount</th>
            <th className="px-2 py-3 font-medium">Rate</th>
            <th className="px-2 py-3 font-medium">Duration</th>
            <th className="px-2 py-3 font-medium">Payments</th>
            <th className="px-2 py-3 font-medium">Type</th>
            <th className="px-2 py-3 font-medium">Monthly</th>
            <th className="w-10 px-4 py-3">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => {
            const isSelected = selectedIds.includes(entry.id);
            const label = `Select simulation ${index + 1} of ${history.length} from ${formatDate(entry.date)}`;
            const deleteLabel = `Delete simulation ${index + 1} of ${history.length} from ${formatDate(entry.date)}`;
            return (
              <tr
                key={entry.id}
                onClick={() => onToggleSelect(entry.id)}
                className={`cursor-pointer border-t border-gray-100 ${
                  isSelected
                    ? 'bg-indigo-50'
                    : index % 2 === 1
                      ? 'bg-[#F8F9FB] hover:bg-gray-100'
                      : 'bg-white hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <SelectionCheckbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(entry.id)}
                    ariaLabel={label}
                    size="sm"
                  />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-400">
                  {formatDate(entry.date)}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-gray-700">
                  € {formatCurrency(entry.amount)}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-gray-700">{entry.rate}%</td>
                <td className="px-2 py-3 whitespace-nowrap text-gray-700">{entry.duration} yr</td>
                <td className="px-2 py-3 whitespace-nowrap text-gray-700">
                  {formatPaymentsFrequency(entry.payments)}
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <TypeBadge type={entry.type} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap font-semibold text-indigo-600">
                  € {formatCurrency(entry.monthly)}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    ariaLabel={deleteLabel}
                    size="sm"
                  />
                </td>
              </tr>
            );
          })}
          {selectedIds.length === 1 && (
            <tr className="border-t border-gray-100">
              <td colSpan={9} className="px-4 py-3 text-xs text-gray-400">
                Select one more entry to enable comparison.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
