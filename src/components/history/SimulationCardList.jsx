import { formatCurrency, formatDate, formatPaymentsFrequency } from '../../utils/format';

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
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm border border-gray-300 bg-white"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(entry.id)}
                    aria-label={label}
                    className="peer sr-only"
                  />
                  <span className="hidden h-full w-full items-center justify-center bg-indigo-600 peer-checked:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-2.5 w-2.5"
                    >
                      <path d="M3 8l3 3 7-7" />
                    </svg>
                  </span>
                </label>
                <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="rounded-md px-2 py-1 text-xs font-medium"
                  style={
                    entry.type === 'Variable'
                      ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
                      : { backgroundColor: '#EFF6FF', color: '#1D4ED8' }
                  }
                >
                  {entry.type}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  aria-label={deleteLabel}
                  className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
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
