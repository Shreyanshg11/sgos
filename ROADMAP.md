# Roadmap

v1.0.0-RC covers everything in the README's Epic 1-5. This is what's next, roughly in the order I'd actually tackle it.

## Next up

- **Persisted window layout.** Right now closing a window loses its position/size. Worth persisting per-app position to `localStorage`, similar to how theme/wallpaper already work.

## Would like to add

- A notification system (toast-style, top-right) — mostly to give apps like the AI Assistant a way to surface errors without a blocking alert.
- More themes than just dark/light — the theme registry is already built to make this a one-file addition.
- A proper "resize from any edge" on windows, not just corners, if I get time to revisit `WindowControls`.

## Not planning to build (for now)

- A plugin/extension API for third-party apps — interesting, but overkill for a portfolio project with a fixed set of apps.
- Multi-user accounts / server-side persistence — this is a client-only simulation and I want to keep it that way.

## How this list changes

Anything that ships gets moved into `CHANGELOG.md` and removed from here — this file is only ever "what's not done yet," not a history.
