# MeshGuard — Product Requirements Document (PRD)

**Project Name:** MeshGuard (Edge-Triage)  
**Hackathon:** V-Hack 2026  
**Version:** 1.0  
**Date:** 2026-03-06  
**Status:** ✅ MVP Complete

---

## 1. North Star Objective

> Build a hybrid simulator demonstrating **decentralized swarm intelligence** — a visual proof-of-concept showing how citizen devices can route life-critical SOS signals through a self-organizing mesh network without centralized infrastructure.

---

## 2. Problem Statement

When natural disasters, power outages, or civil emergencies strike, centralized communication infrastructure (cell towers, the internet) is often the first to fail. Citizens cannot call for help. First responders are blind.

**MeshGuard** simulates a solution: a peer-to-peer mesh protocol where each citizen's device becomes a relay node, collectively routing distress signals to the nearest First Responder HQ — even without the internet.

---

## 3. Target Users

| User | Role | Use Case |
|---|---|---|
| **Citizen (Mobile)** | Signal Broadcaster | Triggers SOS from a phone browser; selects emergency type |
| **First Responder (Dashboard)** | Operator | Monitors incoming SOS events on a live map with hop-by-hop routing trace |
| **Hackathon Judges** | Evaluators | Judges technical depth, UI quality, and real-world relevance |

---

## 4. Core Features

### 4.1 Mobile First Responder UI (`/mobile`)
- Dark-mode, PWA-inspired UI optimized for phone-sized screens
- Four emergency trigger categories: **Fire**, **Medical**, **Flood**, **Crime**
- Giant pulsing **"BROADCAST EMERGENCY"** button
- Real-time peer count displayed
- Delivery confirmation card appears on successful trace receipt

### 4.2 Swarm Matrix Generation
- 150 virtual "citizen" nodes generated at startup around Kuala Lumpur city center (lat: 3.139, lng: 101.6869) within a ~6km radius
- One designated **First Responder HQ** (base node) at center
- Nodes persist across all client connections (singleton on server)

### 4.3 Decentralized Mesh Routing Engine
- Listens for `trigger_sos` Socket.io events from mobile clients
- Runs a **greedy gossip-forwarding** algorithm: hops to the unvisited node closest to base
- Max 12 hops (TTL) to prevent infinite routing loops
- Returns a `mesh_trace` array: ordered list of `{ nodeId, lat, lng, hopIndex }` objects
- Broadcasts `mesh_trace` to **all** connected clients simultaneously

### 4.4 Command Dashboard (`/dashboard`)
- Full-window CartoDB DarkMatter map tile (Leaflet)
- 150 blue citizen nodes plotted on Kuala Lumpur
- Green First Responder HQ marker at center
- Animated `TraceAnimator` draws polyline hop-by-hop on trace receipt (100ms intervals)
- Live stats panel: Active Nodes / SOS Events / Total Hops
- MESH_FEED terminal log (JetBrains Mono) showing real-time events

---

## 5. Technical Constraints (TRL 3 Scope)

- **No cloud services required** — fully local demo (Node.js server + Vite frontend)
- **No real GPS/device discovery** — all nodes are simulated/virtual
- **No real P2P protocol** — Socket.io simulates the broadcast layer
- **No authentication** — open connections for demo purposes
- **Budget: $0** — use free map tiles (CartoDB), no paid APIs

---

## 6. Data Schema

### SOS Trigger Payload (`trigger_sos` event)
```json
{
  "lat": 3.145,
  "lng": 101.690,
  "type": "FIRE"
}
```

### Swarm Node Object
```json
{
  "id": "node_42",
  "lat": 3.142,
  "lng": 101.692,
  "isBase": false,
  "label": null
}
```

### Mesh Trace Payload (`mesh_trace` event)
```json
{
  "origin": { "lat": 3.145, "lng": 101.690 },
  "type": "FIRE",
  "timestamp": "2026-03-06T10:00:00.000Z",
  "trace": [
    { "nodeId": "node_42", "lat": 3.142, "lng": 101.692, "hopIndex": 0, "label": null },
    { "nodeId": "node_7",  "lat": 3.140, "lng": 101.688, "hopIndex": 1, "label": null },
    { "nodeId": "base_0",  "lat": 3.139, "lng": 101.687, "hopIndex": 2, "label": "First Responder HQ" }
  ]
}
```

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Latency** | SOS → Full trace animation begins < 300ms |
| **Concurrency** | Multiple clients can watch the dashboard simultaneously |
| **Portability** | Mobile view must work on iPhone Safari via local network IP |
| **Aesthetics** | Cyberpunk dark-mode UI; premium feel for judge impressions |
| **Reliability** | Server restarts with identical swarm (deterministic at startup) |

---

## 8. Out of Scope (v1.0)

- Real Bluetooth/WiFi direct device discovery
- Persistent SOS event history / database
- User authentication or device identity
- Real GPS geolocation from device
- Cloud deployment (demo is local-only)
