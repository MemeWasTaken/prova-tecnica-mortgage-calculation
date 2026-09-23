import { formatCurrency, formatDate, formatPaymentsFrequency } from '../../utils/format';
import SelectionCheckbox from './SelectionCheckbox';
import TypeBadge from './TypeBadge';
import DeleteButton from './DeleteButton';

export default function SimulationCardList({ history, selectedIds, onToggleSelect, onDelete }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {selectedIds.length === 1 && (
        <div className="rounded-lg bg-indigo-50 px-4 py-2.5 text-center text-sm font-medium text-indigo-600">
          Select one more to compare
        </div>
      )}

      {history.map((entry, index) => {
        const isSelected = selectedIds.includes(entry.id);
        const label = `Select simulation ${index + 1} of ${history.length} from ${formatDate(entry.date)}`;
        const deleteLabel = `Delete simulation ${index + 1} of ${history.length} from ${formatDate(entry.date)}`;
        return (
          <div
            key={entry.id}
            onClick={() => onToggleSelect(entry.id)}
            className={`cursor-pointer rounded-lg border p-4 ${
              isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SelectionCheckbox
                  checked={isSelected}
                  onChange={() => onToggleSelect(entry.id)}
                  ariaLabel={label}
                />
                <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <TypeBadge type={entry.type} />
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  ariaLabel={deleteLabel}
                />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-indigo-600">€ {formatCurrency(entry.monthly)}</span>
              <span className="text-sm text-gray-500">
                {formatPaymentsFrequency(entry.payments).toLowerCase()}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                € {formatCurrency(entry.amount)}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {entry.rate}%
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {entry.duration} yr
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
