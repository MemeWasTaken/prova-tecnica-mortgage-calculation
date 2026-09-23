import { formatCurrency, formatDate, formatPaymentsFrequency } from '../../utils/format';
import SelectionCheckbox from './SelectionCheckbox';
import TypeBadge from './TypeBadge';
import DeleteButton from './DeleteButton';

/**
 * History as a table (desktop). The mobile counterpart is `SimulationCardList`.
 *
 * Each row is an entry and the whole row is clickable to toggle its selection
 * (for comparison); the checkbox and the delete button give the same actions
 * an explicit, keyboard-accessible control. When exactly one entry is
 * selected a hint row explains that another one is needed to compare.
 *
 * Accessible names for the checkbox and delete button include the position
 * and date of the entry ("simulation 2 of 10 from ..."), so each one is
 * unique for screen readers.
 *
 * Note: the "Monthly" column shows the installment per payment period, which
 * is only monthly when the payment frequency is monthly.
 *
 * @param {Object} props
 * @param {Array<Object>} props.history - Entries to display, in order.
 * @param {string[]} props.selectedIds - Ids of the selected entries.
 * @param {(id: string) => void} props.onToggleSelect - Toggles an entry's selection.
 * @param {(id: string) => void} props.onDelete - Deletes an entry.
 */
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
              // Row background: selected, or zebra striping with hover feedback.
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
            // colSpan matches the number of columns (checkbox + 7 data + delete).
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
