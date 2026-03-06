# SOP: Socket.io Event Contracts

**Layer:** 1 — Architecture (Technical SOP)  
**Managed in:** `server.js`  
**Last Updated:** 2026-03-06

---

## Overview

All real-time communication in MeshGuard flows through a single Socket.io server hub (`server.js`). This document is the **canonical reference** for every event: its name, direction, payload shape, and who emits/receives it.

> ⚠️ **Rule:** Never add or rename a socket event without updating this SOP first.

---

## Event 1: `matrix_sync`

| Field | Value |
|---|---|
| **Direction** | Server → Single Client (on connect) |
| **Emitter** | `server.js`: `socket.emit('matrix_sync', ...)` |
| **Receiver** | `Dashboard.jsx`, `MobileApp.jsx` |
| **Trigger** | Automatically on `io.on('connection')` |

### Payload
```json
{
  "nodes": [
    { "id": "base_0", "lat": 3.139, "lng": 101.6869, "isBase": true, "label": "First Responder HQ" },
    { "id": "node_1", "lat": 3.141, "lng": 101.690,  "isBase": false, "label": null }
  ],
  "base": { "id": "base_0", "lat": 3.139, "lng": 101.6869, "isBase": true, "label": "First Responder HQ" }
}
```

### Purpose
Gives each connecting client the full virtual swarm graph so it can plot nodes on the map or display the peer count.

---

## Event 2: `trigger_sos`

| Field | Value |
|---|---|
| **Direction** | Client (Mobile) → Server |
| **Emitter** | `MobileApp.jsx`: `socket.emit('trigger_sos', ...)` |
| **Receiver** | `server.js`: `socket.on('trigger_sos', ...)` |
| **Trigger** | User presses "BROADCAST EMERGENCY" button |

### Payload
```json
{
  "lat": 3.145,
  "lng": 101.690,
  "type": "FIRE"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| `lat` | `number` | Yes | Latitude of SOS origin |
| `lng` | `number` | Yes | Longitude of SOS origin |
| `type` | `string` | No | `"FIRE"`, `"MEDICAL"`, `"FLOOD"`, `"CRIME"`, `"SOS"` |

---

## Event 3: `mesh_trace`

| Field | Value |
|---|---|
| **Direction** | Server → ALL Clients (broadcast) |
| **Emitter** | `server.js`: `io.emit('mesh_trace', ...)` |
| **Receiver** | `Dashboard.jsx`, `MobileApp.jsx` |
| **Trigger** | Computed after receiving a `trigger_sos` event |

### Payload
```json
{
  "origin": { "lat": 3.145, "lng": 101.690 },
  "type": "FIRE",
  "timestamp": "2026-03-06T10:00:00.000Z",
  "trace": [
    { "nodeId": "node_42", "lat": 3.144, "lng": 101.693, "hopIndex": 0, "label": null },
    { "nodeId": "node_7",  "lat": 3.141, "lng": 101.690, "hopIndex": 1, "label": null },
    { "nodeId": "base_0",  "lat": 3.139, "lng": 101.687, "hopIndex": 2, "label": "First Responder HQ" }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `origin` | `{ lat, lng }` | Raw SOS coordinates from mobile trigger |
| `type` | `string` | Emergency category |
| `timestamp` | `ISO string` | Server-side time of trace computation |
| `trace` | `Hop[]` | Ordered array of routing hops |
| `trace[n].nodeId` | `string` | Node identifier |
| `trace[n].hopIndex` | `number` | Position in the route (0 = nearest to SOS) |
| `trace[n].label` | `string\|null` | Human-readable label (only `base_0` has one) |

---

## REST Endpoints

| Method | Path | Response | Purpose |
|---|---|---|---|
| `GET` | `/status` | `{ status, timestamp }` | Health check for monitoring |
