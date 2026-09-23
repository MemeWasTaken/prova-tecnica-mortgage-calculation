import { COMPARISON_ROWS } from '../../config/comparisonRows';
import ComparisonHeader from './ComparisonHeader';

/**
 * Comparison of two or more simulations as a list of cards (mobile).
 * The desktop counterpart is `ComparisonPanel`.
 *
 * Content is grouped by parameter (defined in `COMPARISON_ROWS`): each card
 * shows one parameter and, below it, the value for every simulation, labelled
 * "Sim #n" following the order of `entries`. Reading a single parameter across
 * simulations is easier than scrolling a wide table on a small screen.
 *
 * Renders nothing with fewer than two entries, as there is nothing to compare.
 *
 * @param {Object} props
 * @param {Array<Object>} props.entries - History entries to compare (2 or more).
 * @param {() => void} props.onClose - Called when the user closes the comparison.
 */
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
