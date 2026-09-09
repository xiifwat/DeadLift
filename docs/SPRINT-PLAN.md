# Sprint Plan

Milestone-based (no fixed calendar cadence) — each sprint ends with a working demo.

## Sprint 1 — Auth + Core CRUD
Goal: signed-in user can add/view/edit/delete/complete tasks (no priority calc yet).
- US-1.1, US-1.2 (Google OAuth sign-in/out)
- US-2.1 – US-2.5 (task CRUD)
- Setup: Firebase project, Firestore rules, project scaffold
Demo: live app, sign in, manage a task list.

## Sprint 2 — Gross Priority & Sort
Goal: list auto-sorts by gross priority, visually communicates urgency.
- US-3.1 (formula, ADR-0002)
- US-3.2 (color urgency indicator)
- US-3.3 (manual pin override)
Demo: add tasks w/ varying priority/deadlines, watch list reorder correctly.

## Sprint 3 — Usability enhancements
Goal: find tasks faster as the list grows.
- US-4.1 (tags + filter)
- US-4.2 (search)
- Deferred: dark mode, reminders, recurring tasks — future sprint
Demo: tag a few tasks, filter by tag, search by title/details, confirm both combine.

## Sprint 4 — Professional UI + PWA
Goal: app looks polished, installable on desktop/mobile as a PWA.
- UI redesign: consistent visual system (color, type, spacing) over current functional-only styling — mockup first, code after sign-off
- PWA: manifest, icons, service worker (`vite-plugin-pwa`), installable + basic offline shell
- Both in one sprint — PWA conversion is small for this stack, no conflict with existing Firebase Auth popup flow
Demo: install app from browser (desktop + mobile), confirm it opens standalone; visual review against mockup.

## Retro notes
(filled in after each sprint)
