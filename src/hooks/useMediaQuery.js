import { useSyncExternalStore } from 'react';

/**
 * Checks whether `window.matchMedia` is available. It is not during
 * server-side rendering or in environments that do not implement it
 * (e.g. some test runners).
 *
 * @returns {boolean}
 */
function canMatchMedia() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/**
 * Subscribes to changes of a media query, in the form expected by
 * `useSyncExternalStore`.
 *
 * @param {string} query - CSS media query (e.g. `'(min-width: 640px)'`).
 * @param {() => void} onChange - Callback invoked when the query result changes.
 * @returns {() => void} Cleanup function that removes the listener. It is a
 *   no-op when `matchMedia` is unavailable.
 */
function subscribe(query, onChange) {
  if (!canMatchMedia()) return () => {};

  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener('change', onChange);
  return () => mediaQueryList.removeEventListener('change', onChange);
}

/**
 * Reads the current result of a media query.
 *
 * @param {string} query - CSS media query.
 * @returns {boolean} `true` if the query currently matches; `false` if it
 *   does not or if `matchMedia` is unavailable.
 */
function getSnapshot(query) {
  return canMatchMedia() ? window.matchMedia(query).matches : false;
}

/**
 * React hook that tells whether a CSS media query currently matches and
 * re-renders the component when the result changes (e.g. on window resize or
 * device rotation).
 *
 * Used to switch between layouts in JavaScript, for example table vs. card
 * views, when CSS alone is not enough.
 *
 * Built on `useSyncExternalStore`, which keeps the value consistent during
 * concurrent rendering. The server snapshot is always `false`, so the
 * "query does not match" layout is rendered on the server and during
 * hydration; on the client the real value is used right after.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 640px)');
 *
 * @param {string} query - CSS media query to evaluate.
 * @returns {boolean} Whether the query currently matches.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    () => getSnapshot(query),
    // Server snapshot: no window available, assume the query does not match.
    () => false,
  );
}
