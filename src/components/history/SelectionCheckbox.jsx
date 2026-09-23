/** Tailwind classes for the box, by `size` prop. */
const BOX_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

/** Tailwind classes for the check icon, by `size` prop. */
const ICON_SIZES = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
};

/**
 * Custom-styled checkbox used to select history entries.
 *
 * The native input is visually hidden (`sr-only`, so it stays accessible to
 * keyboards and screen readers) and a styled box is drawn next to it. The
 * check mark is shown through the Tailwind `peer-checked` variant, which
 * reacts to the state of the hidden input.
 *
 * The click is stopped from bubbling because the checkbox sits inside a
 * clickable row/card that toggles the selection itself; otherwise the click
 * would toggle it twice.
 *
 * @param {Object} props
 * @param {boolean} props.checked - Whether the entry is selected.
 * @param {() => void} props.onChange - Called when the checkbox changes.
 * @param {string} props.ariaLabel - Accessible name of the checkbox.
 * @param {'sm' | 'md'} [props.size='md'] - Box size (`sm` for the dense table).
 */
export default function SelectionCheckbox({ checked, onChange, ariaLabel, size = 'md' }) {
  return (
    <label
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center justify-center overflow-hidden rounded-sm border border-gray-300 bg-white ${BOX_SIZES[size]}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span className="hidden h-full w-full items-center justify-center bg-indigo-600 peer-checked:flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={ICON_SIZES[size]}
        >
          <path d="M3 8l3 3 7-7" />
        </svg>
      </span>
    </label>
  );
}
