# ADR 0003 — PWA Strategy

## Status

Accepted (implementation in Phase 5)

## Context

Gazpachator should be installable on mobile and desktop, and usable offline (the entire app is client-side and requires no network after first load).

## Decision

Use `vite-plugin-pwa` with Workbox to generate a service worker and web app manifest automatically at build time.

- `registerType: 'autoUpdate'` — new SW activates on next page load, no manual prompt except for the update notification banner
- `display: 'standalone'` — installed app has no browser chrome
- Workbox `CacheFirst` strategy for all static assets
- `PwaUpdatePrompt` component notifies users when a new version is available

## Icon Requirements

- `public/icons/icon-192.png` — standard icon
- `public/icons/icon-512.png` — maskable icon (safe area padding required)
- `public/icons/apple-touch-icon.png` — 180×180 for iOS
- `public/favicon.ico` — browser tab

## Consequences

- App works fully offline after first visit
- Users on iOS can "Add to Home Screen" for native-like experience
- `public/sw.js` and `public/workbox-*.js` are generated at build time — gitignored
