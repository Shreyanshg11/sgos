# Contributing to SG-OS

This started as a personal project, so there's no formal process — but if you want to poke around, fix something, or add an app, here's what's useful to know.

## Getting set up

```bash
npm install
npm run dev
```

Before opening a PR:

```bash
npm run test
npm run lint
npm run build
```

`build` runs `tsc -b` first, so it'll catch type errors even if lint doesn't.

CI runs these same three commands on every push and PR to `main` (`.github/workflows/ci.yml`), so a broken build will get flagged there even if you forget to run them locally.

## Adding a new app

Every app under `src/features/apps/` follows the same shape:

```
apps/your-app/
  YourApp.tsx        # entry component
  components/
  hooks/
  types/
  data/               # if it needs mock/seed data
  utils/              # if it needs pure helpers
```

Two places to wire it up:

1. Add an entry to the `windows` array in `src/features/window/windowData.tsx` (id, title, and the component itself) — this is what `appRegistry.ts` derives from.
2. Add a matching entry (same `id`) to `desktopIcons` in `src/features/desktop/desktopData.ts` if you want it launchable from a desktop icon, not just the Start Menu.

Either way, the Window Engine itself doesn't need to change — it just operates on whatever `id` it's given.

## Adding a theme or wallpaper

Same pattern for both: add a file next to the existing ones in `core/theme/` or `core/wallpaper/`, add it to the registry array in that folder's `index.ts`. See `docs/architecture/DESIGN_SYSTEM.md` for the actual token list a theme needs to define.

## Code style

- TypeScript strict mode is on — no `any` unless there's genuinely no better option
- Business logic lives in `core/`, UI lives in `features/`. If a hook doesn't touch the DOM, it probably belongs in `core/`
- Keep the Window Engine (`core/window/useWindowEngine.ts`) as the single source of truth for window state — don't let a component keep its own copy of "is this window open"
- If you're touching logic in `core/`, check for a `__tests__/` folder next to it first — `core/window` has one, more will likely follow as other `core/` modules get coverage
- Need a right-click menu somewhere? Use `shared/hooks/useContextMenu` + `shared/components/ContextMenu` rather than building another one — see `Window.tsx`, `DesktopIcon.tsx`, or `Desktop.tsx` for how they're wired up. It renders via a portal to `document.body` on purpose — anything `position: fixed` nested inside Window's animated wrapper needs that, or it gets clipped/mispositioned by the transform Framer Motion applies for the open/close animation.
- Bounds math that more than one thing needs (e.g. "what does a left-snap look like") belongs in a shared pure-function module like `core/window/windowSnap.ts`, not duplicated between the engine and whatever's rendering a preview of it. If the drag preview and the actual snap ever disagree, it's because someone computed the same bounds two different ways instead of importing one.

## If you find a bug

Open an issue, or just fix it and open a PR — whatever's faster.
