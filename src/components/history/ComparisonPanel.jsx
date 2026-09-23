import { COMPARISON_ROWS } from '../../config/comparisonRows';
import ComparisonHeader from './ComparisonHeader';

export default function ComparisonPanel({ entries, onClose }) {
  if (entries.length < 2) return null;

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-white shadow-sm">
      <ComparisonHeader onClose={onClose} />

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
            {COMPARISON_ROWS.map((row, index) => {
              const isOdd = index % 2 === 1;
              return (
                <tr
                  key={row.label}
                  className={`border-t border-gray-100 ${isOdd ? 'bg-[#F8F9FB]' : 'bg-white'}`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-3 whitespace-nowrap text-gray-500 ${
                      isOdd ? 'bg-[#F8F9FB]' : 'bg-white'
                    }`}
                  >
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
