export default function ToggleGroup({ label, required, labelId, options, value, onChange }) {
  return (
    <div className="mt-4">
      <span id={labelId} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              onClick={() => onChange(option.value)}
              aria-checked={selected}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                selected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
