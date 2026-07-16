# SG-OS Changelog

## v1.0.0-rc.1

### Fixed
- `vite.config.ts` used `/// <reference types="vitest/config" />` to get TypeScript to accept the `test` block alongside Vite's own config. That works when Vitest itself loads the file, but `tsc -b` (part of `npm run build`) didn't pick up the ambient reference the same way, and failed the production build with `TS2769` — passed locally because nobody had run a clean `tsc -b` against it, but surfaced immediately on Netlify's CI. Switched to Vitest's own `defineConfig` from `vitest/config`, which is the officially documented approach and resolves the type through normal module resolution instead of an ambient reference.
- Ran a manual accessibility audit rather than take the README's "Accessibility (ARIA, Focus States)" claim at face value. Verdict: mostly true (`WindowControls`, `Taskbar`, and File Explorer's grid all had genuinely solid ARIA work already) but with real gaps:
  - **No focus management on window open** — opening an app never moved keyboard focus into it, so a keyboard-only or screen-reader user had to manually tab through the whole page to reach content they just opened. `Window.tsx` now moves focus into the window when it becomes active (opened, restored, Alt+Tabbed to) — but not if focus already landed on something inside it, e.g. an input clicked directly. 3 new tests.
  - `AIChatSidebar.tsx` — each conversation row was a bare `<div onClick>` with no `role`, `tabIndex`, or keyboard handler, unreachable without a mouse. Its delete button had only a `title` (not a reliable accessible name) and was `opacity-0` until `:hover` with no `:focus` equivalent, so a keyboard user tabbing to it couldn't even see it existed. Fixed both, plus explicit `aria-label`s so the row and its nested delete button don't have overlapping accessible names. 4 new tests.
  - Zero `prefers-reduced-motion` support anywhere despite Framer Motion driving every animation. Fixed app-wide with `<MotionConfig reducedMotion="user">` in `App.tsx` rather than scattering media-query checks through each component.
  - Added `vitest.setup.ts` polyfilling `ResizeObserver` and `matchMedia`, which jsdom doesn't implement — needed once tests started rendering `Window.tsx`, since Framer Motion's `layout` prop depends on the former and reduced-motion detection depends on the latter.
- `index.html` linked to `/favicon.svg`, but there was no `public/` folder and no favicon file anywhere in the repo — every browser tab showed a broken icon. Added one (simple window-chrome mark, matches the new amber accent).
- Removed `src/assets/hero.png` — a 16K image nothing in the codebase imported. Dead weight left over from an earlier iteration.
- File Explorer — a fully built app (its own VFS-backed components/hooks/types, 56K of code) — had no desktop icon or Start Menu entry, so it could never actually be opened. It was registered in `windowData.tsx` but missing from `desktopData.ts`, which is what both the desktop grid and the Start Menu/taskbar launcher list are driven by. Added the missing entry.

### Added
- Window snapping — drag a window's title bar to the left or right edge to snap it to that half of the screen, or to the top edge to maximize. Shows a live preview outline before you release. The bounds math (`core/window/windowSnap.ts`) is shared between the engine and the preview so they can't drift apart from each other. 4 new tests covering left/right/top snap bounds and that a snapped window (unlike a maximized one) can still be dragged away.
- Right-click context menus — desktop icons ("Open"), empty desktop ("Open Settings"), and window title bars (Minimize / Maximize-Restore / Close). Built as a reusable `useContextMenu` hook + `ContextMenu` component (`src/shared/`) rather than three one-off implementations. Renders via a portal to `document.body`, which matters more than it sounds: nesting a `position: fixed` menu inside `Window.tsx`'s animated wrapper would've had it positioned relative to that wrapper's transform instead of the viewport, and clipped by `overflow-hidden`.
- Keyboard shortcuts: **Alt+Tab** cycles focus through open windows in z-order, **Win key** toggles the Start Menu, **Escape** closes it while open. Worth knowing: on most desktop OSes, the browser never actually receives the real Windows key or a system-level Alt+Tab — the OS intercepts those first. These work when the page itself has keyboard focus, same as any web app's keyboard shortcuts; not a full replacement for real OS-level bindings.
- Proper `<meta name="description">`, Open Graph, and Twitter Card tags in `index.html` — previously there were none, so sharing the repo/site link anywhere showed no preview. Browser tab title also fixed from lowercase `sg-os` to `SG-OS — Desktop OS Simulation`.
- Settings → AI Assistant section — the chat UI has said "Set your OpenAI API key in Settings to get started" since it shipped, but that field never actually existed anywhere. It does now, plus a model picker. Also states plainly, right next to the key field, that it's stored in this browser's `localStorage` and sent directly to OpenAI — no backend of ours sits in between, because there isn't one.
- GitHub Actions CI (`.github/workflows/ci.yml`) — runs `npm run lint`, `npm run test`, and `npm run build` on every push and PR to `main`. README now shows a live status badge instead of the old static one.
- Test suite for the Window Engine (`core/window/__tests__/useWindowEngine.test.ts`) — 16 tests covering open/close, focus & z-index ordering, minimize/restore focus handoff, and maximize/toggle bounds restoration. First tests in the project; set up with Vitest + Testing Library. Run with `npm run test`.
- Accent color picker in Settings — Blue, Amber (new default), Teal, Rose. Follows the same registry pattern as themes and wallpapers, persists per-user via `localStorage`. Previously the accent was hardcoded blue and baked into each theme file; it's now its own system (`core/accent`) so the choice survives switching dark/light.

### Fixed
- Default wallpaper ("Aurora") was pointing at a corrupted/empty image file — the whole wallpaper system now uses CSS gradients instead of raster images, so this can't happen again. Added two more (Nebula, Midnight) while I was in there.
- Removed two dead files (`TerminalApp.tsx`, `SettingsApp.tsx`) left over from an earlier refactor — the real components are `Terminal.tsx` and `Settings.tsx`.
- `docs/architecture/ARCHITECTURE.md` was a byte-for-byte duplicate of the root `SG-OS_ARCHITECTURE.md`, and both still listed File Explorer/Terminal/Settings/Calculator as "future" work despite them shipping in Epic 3. Consolidated into one doc and updated it.
- `package.json` still said `0.0.0` despite this being tagged as a release candidate everywhere else. Bumped to `1.0.0-rc.1`.
- Filled in `LICENSE`, `CONTRIBUTING.md`, and `ROADMAP.md`, which existed as empty files.
- Added `docs/architecture/DESIGN_SYSTEM.md` documenting the actual theme tokens (previously an empty file).

---

## v1.0.0-RC (Release Candidate)

### File Explorer
- Added keyboard navigation (Arrow keys, Enter, Home, End)
- Added keyboard shortcuts (Alt+← Back, Alt+→ Forward, Alt+↑ Up, Alt+Home, F5 Refresh)
- Added enhanced empty state with icon
- Improved toolbar with ARIA labels and focus states
- Added `role="grid"`, `aria-selected`, `gridcell` roles for accessibility

### Window Manager
- Fixed minimize/restore component unmount bug — windows are now hidden via CSS opacity instead of DOM removal, preserving component state
- Removed inactive window opacity dimming (was 80% opacity) — windows remain fully readable
- Added close button on taskbar running app items (appears on hover)
- Added middle-click-to-close on taskbar apps
- Improved WindowControls with focus rings and hover brightness effects
- Added ARIA labels to all window controls

### Taskbar
- Added `role="toolbar"`, `role="list"`, `role="listitem"` ARIA attributes
- Added `aria-label` to start button, search, system tray icons
- Added focus ring styles on all interactive elements
- Search bar is now keyboard accessible with pointer cursor
- System tray icons have `title` attributes

### Desktop
- Desktop icons respond to single-click (open) and double-click
- Added `aria-label`, `title` on desktop icons
- Added focus ring styles

### Calculator
- Added `type="button"` and `aria-label` on all keypad buttons
- Added focus ring styles on keypad buttons

### Globals
- Added `transition-shadow` utility in theme
- Improved consistent spacing (px-3 → px-4 normalization)
- All interactive elements now have focus-visible ring styles

### Documentation
- Updated CHANGELOG with v1.0.0-RC
- Updated SG-OS_ARCHITECTURE.md with current system status
- Updated README with Release Candidate badge

---

## v0.9

- Multi Window Support
- Window Focus
- Drag Windows
- Live Taskbar
- Minimize / Restore

---

## v0.8

- Window Engine Foundation
- About Application
- Resume Application
- Projects Application
- Analytics Application

---

## v0.7

- Desktop
- Taskbar
- Window UI