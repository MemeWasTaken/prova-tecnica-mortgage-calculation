/**
 * Centered, width-limited wrapper used to align page content consistently
 * (navbar, pages and footer all share it): max width of `6xl` with horizontal
 * padding.
 *
 * @param {Object} props
 * @param {string} [props.className] - Extra Tailwind classes appended to the
 *   base ones (e.g. vertical padding).
 * @param {React.ReactNode} props.children - Content to wrap.
 */
export default function Container({ className = '', children }) {
  return (
    <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>
  );
}
