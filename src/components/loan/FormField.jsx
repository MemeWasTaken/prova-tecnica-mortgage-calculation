/**
 * Wrapper for a labelled form control with an optional validation error.
 *
 * Renders the label (with a red asterisk when required), the control passed
 * as `children`, and the error message below it.
 *
 * Accessibility conventions (the control must follow them):
 *   - the control's `id` must equal `htmlFor`, which links label and input;
 *   - the label gets the id `<htmlFor>-label`, usable with `aria-labelledby`;
 *   - the error gets the id `<htmlFor>-error` and `role="alert"`, so it is
 *     announced when it appears; the control should reference it through
 *     `aria-describedby`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.label - Label content.
 * @param {string} props.htmlFor - Id of the control this field labels.
 * @param {boolean} [props.required] - Shows the required asterisk (visual only;
 *   set `required`/`aria-required` on the control itself).
 * @param {string} [props.error] - Error message; nothing is shown when empty.
 * @param {React.ReactNode} props.children - The form control.
 */
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
