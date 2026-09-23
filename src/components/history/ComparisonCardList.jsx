import { COMPARISON_ROWS } from '../../config/comparisonRows';
import ComparisonHeader from './ComparisonHeader';

export default function ComparisonCardList({ entries, onClose }) {
  if (entries.length < 2) return null;

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-white shadow-sm">
      <ComparisonHeader onClose={onClose} />

      <div className="flex flex-col divide-y divide-gray-100 px-4">
        {COMPARISON_ROWS.map((row) => (
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
