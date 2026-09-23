/**
 * Toolbar above the history list: shows the counters and the bulk actions.
 *
 * Buttons depend on the selection:
 *   - "Compare n": only with two or more selected entries.
 *   - "Deselect":  only with at least one selected entry.
 *   - "+ Add 10 dummy" and "Clear all": always available.
 *
 * It is purely presentational: every action is delegated to the parent.
 *
 * @param {Object} props
 * @param {number} props.count - Total number of saved simulations.
 * @param {number} props.selectedCount - Number of selected simulations.
 * @param {() => void} props.onClearAll - Called on "Clear all" (the parent
 *   asks for confirmation).
 * @param {() => void} props.onDeselect - Called on "Deselect".
 * @param {() => void} props.onCompare - Called on "Compare n".
 * @param {() => void} props.onAddDummy - Called on "+ Add 10 dummy".
 */
export default function HistoryToolbar({
  count,
  selectedCount,
  onClearAll,
  onDeselect,
  onCompare,
  onAddDummy,
}) {
  return (
    <div className="mt-8 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-gray-500">
          {/* Singular/plural label, plus the selection counter when relevant. */}
          {count} simulation{count === 1 ? '' : 's'}
          {selectedCount > 0 && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              {selectedCount} selected
            </>
          )}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {selectedCount > 1 && (
            <button
              type="button"
              onClick={onCompare}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-normal text-white hover:opacity-90"
            >
              Compare {selectedCount}
            </button>
          )}
          <button
            type="button"
            onClick={onAddDummy}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-normal text-gray-600 hover:border-gray-400 hover:bg-gray-50"
          >
            + Add 10 dummy
          </button>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onDeselect}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-normal text-gray-600 hover:border-gray-400 hover:bg-gray-50"
            >
              Deselect
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-normal text-red-500 hover:border-red-300 hover:bg-red-50"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
