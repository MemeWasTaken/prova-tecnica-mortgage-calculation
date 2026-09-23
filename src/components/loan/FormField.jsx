export default function FormField({ label, htmlFor, required, error, children }) {
  return (
    <div className="mt-4">
      <label id={`${htmlFor}-label`} htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
