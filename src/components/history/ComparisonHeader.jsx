export default function ComparisonHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h2 className="font-semibold text-gray-900">Comparison</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comparison"
        className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
}
