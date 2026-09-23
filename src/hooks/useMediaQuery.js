import { useSyncExternalStore } from 'react';

function canMatchMedia() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function subscribe(query, onChange) {
  if (!canMatchMedia()) return () => {};

  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener('change', onChange);
  return () => mediaQueryList.removeEventListener('change', onChange);
}

function getSnapshot(query) {
  return canMatchMedia() ? window.matchMedia(query).matches : false;
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    () => getSnapshot(query),
    () => false,
  );
}
