/** Tailwind classes for the icon, by `size` prop. */
const ICON_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

/**
 * Icon-only trash button used to delete a history entry.
 *
 * Since it has no visible text, `ariaLabel` is required for screen readers.
 * It does not stop event propagation: when placed inside a clickable row or
 * card, the caller's `onClick` must call `e.stopPropagation()` (as the
 * history lists do) to avoid also toggling the selection.
 *
 * @param {Object} props
 * @param {(e: React.MouseEvent) => void} props.onClick - Click handler.
 * @param {string} props.ariaLabel - Accessible name describing what is deleted.
 * @param {'sm' | 'md'} [props.size='md'] - Icon size (`sm` for the dense table).
 */
export default function DeleteButton({ onClick, ariaLabel, size = 'md' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={ICON_SIZES[size]}
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  );
}
