/**
 * Small colored badge showing the rate type: green for `Variable`, blue for
 * anything else (i.e. `Fixed`). Colors are set inline (not through Tailwind
 * classes) with fixed hex values.
 *
 * @param {Object} props
 * @param {string} props.type - Rate type, `'Fixed'` or `'Variable'`; it is also
 *   the displayed text.
 */
export default function TypeBadge({ type }) {
  return (
    <span
      className="rounded-md px-2 py-1 text-xs font-medium"
      style={
        type === 'Variable'
          ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
          : { backgroundColor: '#EFF6FF', color: '#1D4ED8' }
      }
    >
      {type}
    </span>
  );
}
