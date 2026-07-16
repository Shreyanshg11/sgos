import { vi } from "vitest";

// jsdom doesn't implement ResizeObserver, but Framer Motion's `layout`
// prop (used on Window.tsx) relies on it. Without this, any test that
// renders a `layout`-animated component throws immediately.
if (!("ResizeObserver" in window)) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// jsdom also doesn't implement matchMedia, which Framer Motion's
// reduced-motion support (and any future CSS-media-query-based code)
// reads via window.matchMedia(...).
if (!("matchMedia" in window)) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
