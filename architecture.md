# MeshGuard — System Architecture

**Version:** 1.0  
**Date:** 2026-03-06  
**Status:** ✅ MVP Implemented

---

## 1. System Overview

MeshGuard is a **monorepo** composed of two independent processes communicating over Socket.io:

```
┌─────────────────────────────────────────────────────────┐
│                     MeshGuard Monorepo                   │
│                                                         │
│  ┌───────────────────┐     ┌──────────────────────────┐ │
│  │   Backend Server  │◄────►│   Frontend (Vite React)  │ │
│  │  Node.js/Express  │     │   Dashboard + Mobile UI  │ │
│  │   Socket.io Hub   │     │   React-Leaflet + Socket │ │
│  │   server.js       │     │   ./frontend/src/        │ │
│  │   Port: 3001      │     │   Port: 5173             │ │
│  └───────────────────┘     └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 2. A.N.T. 3-Layer Architecture

### Layer 1 — Architecture (`architecture/`)
Technical Standard Operating Procedures (SOPs). Each SOP documents the "why" and "how" for a subsystem. **Update SOPs before changing code.**

| SOP File | Covers |
|---|---|
| `architecture/swarm-engine.md` | Node generation, routing algorithm, TTL rules |
| `architecture/socket-events.md` | All Socket.io event contracts (input/output shapes) |
| `architecture/frontend-routing.md` | React Router routes, component hierarchy |

### Layer 2 — Navigation (Decision Making)
**`server.js`** acts as the routing/navigation layer:
- Receives incoming events (`trigger_sos`)
- Delegates computation to Layer 3 tools (`swarmEngine.js`)
- Broadcasts outputs to all clients (`mesh_trace`)

### Layer 3 — Tools (`tools/` + `src/`)
Deterministic, atomic, testable scripts.

| File | Purpose |
|---|---|
| `src/swarmEngine.js` | `generateNodes(count)` + `computeRoute(nodes, origin, base, maxHops)` |

---

## 3. Component Diagram

```
Phone Browser (Mobile Client)                 Laptop Browser (Dashboard Client)
        │                                               │
        │  WebSocket (socket.io-client)                 │  WebSocket (socket.io-client)
        │                                               │
        ▼                                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    server.js (Node.js/Express)                 │
│                                                               │
│  io.on('connection')                                          │
│    │                                                          │
│    ├── emit('matrix_sync', { nodes, base })  ──► All clients  │
│    │                                                          │
│    └── on('trigger_sos', payload)                             │
│          │                                                    │
│          └── computeRoute() ──► io.emit('mesh_trace', trace)  │
│                                                               │
│  GET /status  ──►  { status: 'online', timestamp }           │
└──────────────────────────────────────────────────────────────┘
        ▲                                               ▲
        │  matrix_sync + mesh_trace events              │
        │                                               │
┌──────────────┐                              ┌──────────────────┐
│  MobileApp   │                              │   Dashboard.jsx  │
│  /mobile     │                              │   /dashboard     │
│  React       │                              │   React-Leaflet  │
└──────────────┘                              └──────────────────┘
```

---

## 4. Socket.io Event Contract

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `matrix_sync` | Server → All Clients | `{ nodes: Node[], base: Node }` | Emitted once on client connect; sends full swarm |
| `trigger_sos` | Client (Mobile) → Server | `{ lat, lng, type }` | Mobile user triggers emergency broadcast |
| `mesh_trace` | Server → All Clients | `{ origin, type, trace: Hop[], timestamp }` | Full routing trace broadcast to all watchers |

---

## 5. Frontend Routing

| Route | Component | Purpose |
|---|---|---|
| `/` | `App.jsx` | Root redirect / nav |
| `/mobile` | `MobileApp.jsx` | Phone-optimized SOS trigger UI |
| `/dashboard` | `Dashboard.jsx` | Full-window command map |

**Router:** React Router v6 (`createBrowserRouter` / `<BrowserRouter>`)  
**Map Library:** React-Leaflet + Leaflet.js  
**Map Tile:** CartoDB DarkMatter (free, no API key required)

---

## 6. Swarm Engine Algorithm

**File:** `src/swarmEngine.js`

### `generateNodes(count = 150)`
- Node `base_0` is always placed at KL city center (3.139, 101.6869) as the First Responder HQ
- Remaining `count - 1` nodes are placed at random angles and radii within `SPREAD_RADIUS = 0.06°` (~6km)
- Returns a flat array sorted by index (base first)

### `computeRoute(nodes, origin, base, maxHops = 12)`
Implements a **greedy gossip-forwarding** algorithm:
1. Find the node closest to the SOS `origin` → this is `current`
2. Loop until `maxHops` reached or `current.isBase === true`:
   - From all unvisited nodes, pick the one closest to `base`
   - Add it to `trace` and mark visited
3. Force-append `base` if not the last hop
4. Returns ordered `Hop[]` array representing the routing path

**Complexity:** O(n²) — acceptable for n=150 in a demo context  
**Edge case:** If all nodes are visited before reaching base, trace ends and base is appended manually

---

## 7. Directory Structure

```text
vhack/
├── .env                        # Secrets (currently none required for local demo)
├── .gitignore
├── package.json                # Root monorepo: node server.js
├── server.js                   # ⚙️ Layer 2: Navigation Hub (Socket.io + Express)
├── prd.md                      # 📋 Product Requirements Document
├── architecture.md             # 🏗️ This file — System Architecture
├── ai_rules.md                 # 🤖 AI Constraints & Project Constitution
├── plan.md                     # 📝 Actionable implementation plan (TDD tasks)
├── progress.md                 # 📊 Live progress log
│
├── src/                        # ⚙️ Layer 3: Core Tools
│   └── swarmEngine.js          #    Node generation + routing algorithm
│
├── architecture/               # 🏗️ Layer 1: Technical SOPs
│   ├── swarm-engine.md         #    Swarm algorithm deep-dive
│   ├── socket-events.md        #    Event contract reference
│   └── frontend-routing.md    #    Frontend component & route map
│
├── tools/                      # 🔧 Layer 3: Utility Scripts
│   └── (future: test scripts, data generators)
│
├── .tmp/                       # 🗑️ Temporary Workbench (gitignored)
│
└── frontend/                   # ✨ Layer 4: UI (Vite + React)
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── MobileApp.jsx   #    /mobile route
    │   │   └── Dashboard.jsx   #    /dashboard route
    │   └── components/
    │       └── TraceAnimator   #    Hop-by-hop polyline animation
    └── public/
```

---

## 8. Technology Stack

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Backend Runtime | Node.js | 18+ | Fast event loop, npm ecosystem |
| Backend Framework | Express.js | ^4 | Lightweight HTTP + middleware |
| Real-time | Socket.io | ^4 | Reliable WS with auto-reconnect |
| Frontend Framework | React | ^18 | Component model, ecosystem |
| Frontend Build | Vite | ^5 | Fast HMR, zero-config |
| Mapping | React-Leaflet / Leaflet | ^4/^1 | Free, open-source, offline-capable |
| Map Tiles | CartoDB DarkMatter | CDN | No API key, dark theme |
| CSS | Vanilla CSS / Tailwind | — | Inline styles + utility classes |
| Fonts | JetBrains Mono | Google Fonts | Terminal aesthetic |

---

## 9. Network Architecture (Local Demo)

```
┌──────────────────────────────────────────┐
│          Local Wi-Fi Network             │
│                                          │
│  Laptop (Dev Machine)                    │
│  ├── Backend:  http://localhost:3001     │
│  └── Frontend: http://localhost:5173     │
│                                          │
│  iPhone (Same Wi-Fi)                     │
│  └── http://172.18.62.59:5173/mobile    │
└──────────────────────────────────────────┘
```

**Cross-Origin:** Backend CORS is set to `origin: '*'` for demo. Restrict in production.

---

## 10. Self-Annealing Log

| Date | Issue | Fix Applied | SOP Updated |
|---|---|---|---|
| 2026-03-06 | Port 3000 conflict with system process | Changed backend port to 3001 | server.js + progress.md |
| 2026-03-06 | CartoDB tiles require no API key | Confirmed — no key needed | architecture.md |
