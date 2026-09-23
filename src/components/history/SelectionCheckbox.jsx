const BOX_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

const ICON_SIZES = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
};

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
