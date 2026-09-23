export default function SegmentedToggle({ label, required, labelId, options, value, onChange }) {
  return (
    <div className="mt-4">
      <span id={labelId} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className="mt-2 flex rounded-lg bg-gray-100 p-1">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              onClick={() => onChange(option.value)}
              aria-checked={selected}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                selected ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
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
