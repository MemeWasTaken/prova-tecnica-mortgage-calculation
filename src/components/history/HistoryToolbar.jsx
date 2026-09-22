export default function HistoryToolbar({ count, selectedCount, onClearAll, onDeselect }) {
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
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-normal text-white hover:bg-indigo-700"
            >
              Compare {selectedCount}
            </button>
          )}
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onDeselect}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-normal text-gray-600 hover:bg-gray-50"
            >
              Deselect
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-normal text-red-500"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
