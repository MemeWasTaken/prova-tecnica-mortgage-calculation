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
