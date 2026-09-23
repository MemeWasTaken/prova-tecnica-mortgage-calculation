export default function FormField({ label, htmlFor, required, error, children }) {
  return (
    <div className="mt-4">
      <label
        id={`${htmlFor}-label`}
        htmlFor={htmlFor}
        className="text-xs font-medium text-gray-700 sm:text-sm"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-[11px] text-red-500 sm:text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
