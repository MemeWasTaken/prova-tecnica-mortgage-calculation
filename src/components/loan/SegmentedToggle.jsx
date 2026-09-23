/**
 * Single-choice selector rendered as a segmented control: options sit side by
 * side in one row inside a rounded container, and the selected one is
 * highlighted. Best suited for a few short options (e.g. Fixed / Variable);
 * use `ToggleGroup` for a grid of buttons.
 *
 * Implements the ARIA radio group pattern (`radiogroup` labelled by
 * `labelId`, one `role="radio"` button per option with `aria-checked`). As in
 * `ToggleGroup`, arrow-key navigation is not implemented.
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
export default function SegmentedToggle({ label, required, labelId, options, value, onChange }) {
  return (
    <div className="mt-4">
      <span id={labelId} className="text-xs font-medium text-gray-700 sm:text-sm">
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
              className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors sm:text-sm ${
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
