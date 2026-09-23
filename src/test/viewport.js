import { vi } from 'vitest';

export function mockViewportWidth(width) {
  window.matchMedia = vi.fn((query) => {
    const minWidth = /min-width:\s*(\d+)px/.exec(query);
    return {
      matches: minWidth ? width >= Number(minWidth[1]) : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  });
}
