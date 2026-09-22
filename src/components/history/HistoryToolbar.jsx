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
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {count} simulation{count === 1 ? '' : 's'}
          {selectedCount > 0 && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              {selectedCount} selected
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
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
