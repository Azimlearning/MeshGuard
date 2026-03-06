# SOP: Frontend Routing & Component Map

**Layer:** 1 — Architecture (Technical SOP)  
**Location:** `./frontend/src/`  
**Last Updated:** 2026-03-06

---

## Overview

The frontend is a **Vite + React** single-page application (SPA). It connects to the backend via `socket.io-client` and uses `React-Leaflet` for map rendering. Two main views are served under distinct URL routes.

---

## Route Map

| Path | Component | Description |
|---|---|---|
| `/` | `App.jsx` | Root entry point; redirects or shows nav |
| `/mobile` | `MobileApp.jsx` | Phone-optimized SOS trigger UI |
| `/dashboard` | `Dashboard.jsx` | Full-window command map with trace animation |

**Router:** React Router v6

---

## Component Hierarchy

```
App.jsx (Router root)
├── /mobile  → MobileApp.jsx
│     ├── Socket.io connection to backend
│     ├── Emergency type selector (4 buttons)
│     ├── SOS broadcast button (giant pulse)
│     ├── Peer count display (from matrix_sync node count)
│     └── Delivery confirmation card (appears after mesh_trace received)
│
└── /dashboard → Dashboard.jsx
      ├── Socket.io connection to backend
      ├── MapContainer (React-Leaflet)
      │     ├── TileLayer (CartoDB DarkMatter)
      │     ├── CircleMarker × 150 (swarm nodes, blue)
      │     ├── CircleMarker (base_0, green)
      │     └── TraceAnimator (dynamic component)
      │           └── Polyline (animated hop-by-hop, 100ms/hop)
      ├── Stats panel (Active Nodes / SOS Events / Total Hops)
      └── MESH_FEED terminal log (real-time event list, JetBrains Mono)
```

---

## Socket.io Client Setup

Both views connect to the backend independently:

```js
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

// Or via env variable for flexibility:
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');
```

---

## Key Events Handled in Frontend

| Component | Event | Action |
|---|---|---|
| `MobileApp.jsx` | `matrix_sync` | Extract node count → update peer display |
| `MobileApp.jsx` | `mesh_trace` | Show delivery confirmation card |
| `MobileApp.jsx` | Button click | `socket.emit('trigger_sos', { lat, lng, type })` |
| `Dashboard.jsx` | `matrix_sync` | Plot all 150 nodes on map |
| `Dashboard.jsx` | `mesh_trace` | Start `TraceAnimator`, update stats, append to MESH_FEED |

---

## TraceAnimator Logic

```
On mesh_trace received:
1. Reset previous trace polyline
2. For each hop in trace[] (sorted by hopIndex):
   a. Wait 100ms
   b. Append hop coordinates to active polyline
   c. Flash the node marker (red pulse)
3. When last hop reaches base_0:
   a. Flash green on base marker
   b. Append to MESH_FEED log
```

---

## Build & Dev Commands

```bash
# From ./frontend/

# Development (hot reload)
npm run dev -- --host         # --host exposes on network IP for iPhone

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables (Frontend)

| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:3001` | Socket.io server URL |

Create `./frontend/.env.local` to override:
```
VITE_BACKEND_URL=http://172.18.62.59:3001
```
