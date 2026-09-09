# ADR-0003: Pin Vite to classic (non-Rolldown) bundler

## Status
Accepted — 2026-09-09

## Context
`npm create vite@latest` scaffolded Vite 8, which defaults to the Rolldown-based bundler.
Rolldown ships platform-specific native binding packages as optional deps
(`@rolldown/binding-darwin-arm64`, etc.) gated by an `engines` field requiring Node
`^20.19.0 || >=22.12.0`. Dev machine runs Node v22.0.0 — just under that floor — so npm
silently skipped installing the binding, and `vite`/`vite build` failed at startup with
`Cannot find native binding`.

## Decision
Pinned `vite` to `^6.3.5` (classic Rollup/esbuild bundler, no native binding requirement)
and `@vitejs/plugin-react` to the matching `^4.3.4`. Confirmed dev server starts clean on
Node v22.0.0 with no engine warnings for these two packages.

## Consequences
- Slightly older Vite major, but stable and widely used — no functional loss for this app.
- `oxlint` still warns on the same engine mismatch (needs Node ^20.19/>=22.12) but doesn't
  block dev/build since it's a separate CLI invoked only via `npm run lint`.
- Revisit this pin if/when the dev machine's Node is upgraded to >=22.12 — Rolldown-Vite
  can be re-adopted then for its faster build times.
