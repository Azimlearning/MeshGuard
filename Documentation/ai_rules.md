# MeshGuard — AI Rules & Project Constitution

**Version:** 1.0  
**Date:** 2026-03-06  
**Enforced by:** All AI agents and contributors working on this project

---

## ⚡ Golden Rules (Never Break These)

1. **Data-First**: Define or confirm data schemas in `prd.md` / `architecture.md` **before** writing any tool or component that consumes that data.
2. **SOP-First**: If the logic of a subsystem changes, update the relevant `architecture/` SOP **before** changing the code.
3. **No Guessing**: Never infer or hallucinate business logic. If unsure about a requirement, ask. Check `prd.md` first.
4. **Atomic Tools**: Functions in `src/` and `tools/` must be small, single-responsibility, and independently testable.
5. **No Secrets in Code**: API keys and env variables MUST live in `.env`. Never hardcode secrets. Confirm `.env` is in `.gitignore`.

---

## 🚫 DO NOT Rules

| Rule | Reason |
|---|---|
| DO NOT use real GPS coordinates from the user's device without consent | Privacy — this is a simulator |
| DO NOT deploy to a cloud environment without explicit user approval | Demo is local-only (TRL 3 constraint) |
| DO NOT add paid API services (e.g., Google Maps, Mapbox) | Budget: $0 constraint |
| DO NOT use `alert()` or blocking browser dialogs | UX — non-interactive, premium feel required |
| DO NOT set CORS to a specific domain without confirming with the user | The demo UI must work on any local IP |
| DO NOT store user SOS events in a database without a privacy review | PII handling rules |
| DO NOT auto-commit code with `--no-verify` or skip the security check | Security protocol |
| DO NOT add `node_modules/` or `.env` to git | Data hygiene — already in `.gitignore` |

---

## ✅ MUST Rules

| Rule | Reason |
|---|---|
| MUST update `progress.md` after each completed task | Traceability |
| MUST test socket events with a test client before wiring to UI | Self-Annealing principle |
| MUST keep `server.js` as the single Socket.io hub | Avoid distributed event logic |
| MUST animate mesh traces step-by-step, not all at once | Visual storytelling for judges |
| MUST use dark-mode UI on all views | Brand identity — "Cyberpunk/Tactical" aesthetic |
| MUST ensure mobile view renders correctly on iPhone Safari | Primary demo device |
| MUST preserve the singleton `swarmNodes` array across client connections | All clients share the same mesh |

---

## 🏗️ Architecture Constraints

### Protocol 0 — Initialization Gate
No scripts are written in `tools/` until:
- [ ] Discovery Questions are answered (see `prd.md` Section 1–4)
- [ ] Data Schemas are defined (see `prd.md` Section 6)
- [ ] `plan.md` has an approved Blueprint

### TRL 3 Boundaries (Technology Readiness Level)
This is a **simulation / proof-of-concept**. It does NOT:
- Implement real Bluetooth or Wi-Fi Direct protocols
- Discover real devices on a network
- Use real GPS data
- Persist data across server restarts

All routing is simulated server-side. The "mesh" is virtual.

### Self-Annealing Protocol
When an error occurs:
1. Read the full stack trace
2. Identify the failing file and function
3. Fix the code in `src/` or `tools/`
4. Re-test
5. Document the root cause and fix in `architecture.md` Section 10 (Self-Annealing Log)

---

## 🎨 Design & UX Constitution

| Principle | Specification |
|---|---|
| **Color Palette** | Background: `#0a0f1e` (deep navy), Accent: `#00e5ff` (cyan), Danger: `#ff1744` (red) |
| **Typography** | UI: System sans-serif / Roboto; Terminal: `JetBrains Mono` (monospace) |
| **Animations** | Smooth, purposeful. No janky transitions. Pulse animations on active nodes. |
| **Font Size (Mobile)** | Minimum `16px` touch targets are `48px` min height |
| **Map Tiles** | CartoDB DarkMatter — dark background, no bright colors that clash |
| **Status Indicators** | Green = Live/Success, Cyan = Active/Transmitting, Red = Alert/Danger |

---

## 🔐 Security Checklist (Pre-Commit)

Before every `git commit`, verify:
- [ ] No API keys in source files
- [ ] No hardcoded IPs or credentials
- [ ] `.env` is listed in `.gitignore`
- [ ] `node_modules/` is listed in `.gitignore`
- [ ] No `console.log()` of sensitive payloads
- [ ] CORS is set appropriately (wildcard `*` is OK for local demo only)

---

## 📦 Dependency Policy

- **Prefer zero or minimal dependencies** for `src/` (Node.js built-ins where possible)
- **Frontend dependencies** must be justified in `architecture.md`
- **No dependency** should be added to `package.json` without confirming it aligns with the TRL 3 budget ($0) and offline-first constraint

---

## 🗂️ Naming Conventions

| Asset | Convention | Example |
|---|---|---|
| React components | PascalCase | `MobileApp.jsx`, `Dashboard.jsx` |
| Utility functions | camelCase | `generateNodes()`, `computeRoute()` |
| Socket events | snake_case | `matrix_sync`, `trigger_sos`, `mesh_trace` |
| CSS classes | kebab-case | `.sos-button`, `.mesh-feed` |
| Environment variables | UPPER_SNAKE_CASE | `PORT`, `BACKEND_URL` |
| Git branches | `feature/description` | `feature/trace-animation` |

---

## 🔄 Update Log

| Date | Change | Author |
|---|---|---|
| 2026-03-06 | Initial constitution created | Antigravity AI |
