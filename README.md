# SG-OS

An interactive desktop operating system simulation built with React and TypeScript — draggable windows, a virtual file system, a taskbar and Start Menu, and a set of built-in apps (File Explorer, Terminal, Settings, Calculator, Notepad, Gallery, AI Assistant), all running entirely in the browser.

> **v1.0.0-RC** — Release Candidate

---

[![CI](https://github.com/Shreyanshg11/SG-OS/actions/workflows/ci.yml/badge.svg)](https://github.com/Shreyanshg11/SG-OS/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/Status-Release%20Candidate-blue)]()

---

# Current Version

**v1.0.0-RC**

Status:

🟢 Release Candidate — Stable

---

# Completed

## Epic 1 — Desktop Foundation ✅

- Boot Screen
- Mission Screen
- Desktop Environment
- Wallpaper
- Desktop Icons
- Taskbar

---

## Epic 2 — Window Experience ✅

- Window Engine
- Window Manager
- Multi Window Support
- Running Applications
- Start Menu
- Keyboard Navigation
- Window Dragging
- Window Resize
- Window Minimize
- Window Restore
- Window Maximize
- Window Animations

---

## Epic 3 — System Applications ✅

- File Explorer
- Terminal
- Settings
- Calculator
- Notepad
- Gallery
- AI Assistant

---

## Epic 4 — Desktop Experience ✅

- Themes (Dark/Light)
- Wallpaper Engine
- Virtual File System
- Taskbar Close Buttons
- Accessibility (ARIA, Focus States)

---

## Epic 5 — Release Candidate ✅

- Performance Optimization
- Documentation
- Accessibility Audit
- Keyboard Navigation
- Final Polish

---

# Architecture

SG-OS follows:

- Modular Architecture
- RFC Driven Development
- Milestone Based Releases
- Production Builds
- Clean Engineering Practices

See [SG-OS_ARCHITECTURE.md](SG-OS_ARCHITECTURE.md) for full documentation.

---

# Development

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

Every push and PR to `main` runs the same test/lint/build steps via GitHub Actions (`.github/workflows/ci.yml`).

---

# License

MIT