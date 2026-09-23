import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** CSS selector matching the elements that can receive keyboard focus. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog.
 *
 * Renders its children in a centered dialog over a dimmed backdrop, through a
 * portal attached to `document.body` (so it is not affected by the stacking
 * or overflow of its parents).
 *
 * Accessibility and behavior:
 *   - `role="dialog"` and `aria-modal="true"`, labelled by the element whose
 *     id is passed in `labelledBy`.
 *   - On open, focus moves to the dialog; on close, focus returns to the
 *     element that had it before opening.
 *   - Focus trap: Tab and Shift+Tab cycle among the focusable elements inside
 *     the dialog and cannot leave it.
 *   - Closes on Escape and on click on the backdrop (clicks inside the dialog
 *     do not bubble to the backdrop).
 *
 * The modal does not style its content: the children provide their own
 * panel/background. It does not lock the page scroll.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible. When false,
 *   nothing is rendered.
 * @param {() => void} props.onClose - Called on Escape or backdrop click; the
 *   parent is responsible for setting `isOpen` to false.
 * @param {string} props.labelledBy - Id of the element (usually the title
 *   inside `children`) that gives the dialog its accessible name.
 * @param {React.ReactNode} props.children - Dialog content.
 */
export default function Modal({ isOpen, onClose, labelledBy, children }) {
  const dialogRef = useRef(null);

  // Focus management: remember the previously focused element, move focus into
  // the dialog and restore it when the modal closes or unmounts.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  // Keyboard handling: Escape to close and Tab focus trap.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
      // Nothing to focus inside: block Tab so focus does not escape.
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // Focus is on the dialog container itself (right after opening) or
      // somewhere outside it: treat it like being at a boundary.
      const isOutside = !dialogRef.current.contains(active) || active === dialogRef.current;

      // Wrap around: Shift+Tab from the first goes to the last, Tab from the
      // last goes to the first.
      if (e.shiftKey && (active === first || isOutside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || isOutside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    // Backdrop: clicking it closes the modal.
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
    >
      {/* tabIndex -1 lets the container receive programmatic focus without
          being part of the Tab order. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="outline-none"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
