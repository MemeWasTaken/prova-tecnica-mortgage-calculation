import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

function createMatchMediaMock(initialMatches) {
  let matches = initialMatches;
  const listeners = new Set();

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    addEventListener: vi.fn((event, listener) => {
      if (event === 'change') listeners.add(listener);
    }),
    removeEventListener: vi.fn((event, listener) => {
      if (event === 'change') listeners.delete(listener);
    }),
  };

  return {
    mediaQueryList,
    setMatches(value) {
      matches = value;
      listeners.forEach((listener) => listener({ matches: value }));
    },
  };
}

describe('useMediaQuery', () => {
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('returns the initial match state from matchMedia', () => {
    const { mediaQueryList } = createMatchMediaMock(true);
    window.matchMedia = vi.fn(() => mediaQueryList);

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));

    expect(result.current).toBe(true);
  });

  it('returns false when the query does not currently match', () => {
    const { mediaQueryList } = createMatchMediaMock(false);
    window.matchMedia = vi.fn(() => mediaQueryList);

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));

    expect(result.current).toBe(false);
  });

  it('updates when the media query change event fires', () => {
    const { mediaQueryList, setMatches } = createMatchMediaMock(false);
    window.matchMedia = vi.fn(() => mediaQueryList);

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
    expect(result.current).toBe(false);

    act(() => setMatches(true));

    expect(result.current).toBe(true);
  });

  it('subscribes with the given query and unsubscribes on unmount', () => {
    const { mediaQueryList } = createMatchMediaMock(true);
    window.matchMedia = vi.fn(() => mediaQueryList);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 640px)'));

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 640px)');
    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

describe('useMediaQuery without matchMedia support', () => {
  it('falls back to false instead of throwing', () => {
    const originalMatchMedia = window.matchMedia;
    delete window.matchMedia;

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));

    expect(result.current).toBe(false);

    window.matchMedia = originalMatchMedia;
  });
});
