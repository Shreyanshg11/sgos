# SG-OS Architecture

> Technical architecture documentation for SG-OS.

---

# Overview

SG-OS is a desktop operating system simulation built using React, TypeScript and Vite.

The project follows a modular architecture where each layer has a single responsibility.

The primary design goal is to keep business logic separated from presentation logic.

---

# High-Level Architecture

```
App
│
├── Boot Screen
│
├── Mission Screen
│
└── Desktop
      │
      ▼
 WindowManager
      │
      ▼
 WindowEngine
      │
      ▼
 Window Components
```

---

# Project Structure

```
src/

app/
    Application lifecycle

core/
    Window engine
    Registry
    Managers
    Shared types

features/
    Desktop
    Windows
    Applications
    Boot
    Mission

assets/
    Images
    Wallpapers

styles/
    Global styling
```

---

# Window System

The Window Engine is the single source of truth for every application window.

Responsibilities include:

- Opening windows
- Closing windows
- Focus management
- Window bounds
- Minimize
- Restore
- Maximize
- Resize
- Z-index ordering

---

# WindowManager

The WindowManager connects the engine to the user interface.

Responsibilities:

- Render open windows
- Pass events to WindowEngine
- Launch applications
- Synchronize Taskbar

---

# Desktop

Desktop is presentation-only.

Responsibilities:

- Wallpaper
- Desktop icons
- Desktop layout

Desktop never owns window state.

---

# Taskbar

Responsibilities:

- Display running applications
- Restore minimized windows
- Focus existing windows

Taskbar does not own application state.

---

# Start Menu

Responsibilities:

- Search applications
- Launch applications
- Keyboard navigation

The Start Menu is UI only.

Application state remains inside WindowEngine.

---

# State Ownership

| Component | Responsibility |
|-----------|----------------|
| WindowEngine | Window lifecycle |
| WindowManager | Controller |
| Desktop | Presentation |
| Taskbar | Running app UI |
| StartMenu | Launcher UI |
| Window | Rendering |

---

# Engineering Principles

SG-OS follows these principles:

- Single Source of Truth
- Separation of Concerns
- Modular Components
- RFC Driven Development
- Milestone Based Releases
- Production Build Validation

---

# Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

---

# Applications Built On Top

These all shipped without any changes to the Window Engine itself, which was the point of building it this way:

- File Explorer (backed by the Virtual File System, see below)
- Terminal
- Settings
- Calculator
- Notepad
- Gallery
- AI Assistant

---

# Virtual File System

`core/vfs` is the in-memory file system used by File Explorer, Terminal, and Notepad. It's split by responsibility:

- `tree/` — pure functions for creating, navigating, querying, and mutating the file tree
- `service/` — the stateful layer other features talk to
- `mock/` — seed data so the OS has files in it out of the box
- `utils/` — path handling and input validation

Nothing here touches the DOM or React — it's testable in isolation from the UI.

---

# Theming & Wallpaper

Both themes and wallpapers follow the same registry pattern: a typed definition object, a small registry array, and lookup helpers (`getThemeById`, `getWallpaperById`). Adding a new theme or wallpaper means adding one file and one line in the registry — no provider changes needed. See `docs/architecture/DESIGN_SYSTEM.md` for the actual color tokens.

---

# Not Built Yet

Ideas that would fit this architecture without reworking it, if there's ever a reason to:

- Notification system
- Plugin/extension API for third-party apps
- Persisted window layout across sessions

---

# A Note on These Docs

This file and `docs/architecture/DESIGN_SYSTEM.md` used to disagree with the README about which apps were done — they'd said "Terminal, Settings, Calculator" were still planned, weeks after they'd actually shipped. That's fixed now, but it's a reminder to update this file in the same PR that ships a feature, not after.