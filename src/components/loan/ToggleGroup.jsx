/**
 * Single-choice selector rendered as a grid of buttons (two per row).
 *
 * Implements the ARIA radio group pattern: a `radiogroup` container labelled
 * by the element with id `labelId`, and one `role="radio"` button per option,
 * with `aria-checked` reflecting the selection. Use `SegmentedToggle` for the
 * compact single-row variant.
 *
 * Note: only the click interaction is implemented; arrow-key navigation
 * between options (expected of a full radio group) is not.
 *
 * @param {Object} props
 * @param {string} props.label - Text of the group label.
 * @param {boolean} [props.required] - Shows a required asterisk (visual only).
 * @param {string} props.labelId - Id given to the label, referenced by `aria-labelledby`.
 * @param {Array<{ label: string, value: string | number }>} props.options -
 *   Available choices. `label` is displayed and also used as React key, so
 *   labels must be unique.
 * @param {string | number} props.value - Value of the currently selected option.
 * @param {(value: string | number) => void} props.onChange - Called with the
 *   `value` of the clicked option.
 */
export default function ToggleGroup({ label, required, labelId, options, value, onChange }) {
  return (
    <div className="mt-4">
      <span id={labelId} className="text-xs font-medium text-gray-700 sm:text-sm">
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
              className={`rounded-md border px-3 py-2 text-xs font-medium sm:text-sm ${
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
