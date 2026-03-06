# SOP: Swarm Engine

**Layer:** 1 — Architecture (Technical SOP)  
**File:** `src/swarmEngine.js`  
**Last Updated:** 2026-03-06

---

## Purpose
The Swarm Engine is the core intelligence of MeshGuard. It is responsible for:
1. Generating the virtual citizen node graph at server startup
2. Computing decentralized mesh routing traces when an SOS is triggered

---

## Function: `generateNodes(count)`

### Goal
Produce `count` node objects distributed randomly within `SPREAD_RADIUS` degrees of the KL city center.

### Inputs
| Param | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `150` | Total number of nodes to generate |

### Output
```js
[
  { id: 'base_0', lat: 3.139, lng: 101.6869, isBase: true, label: 'First Responder HQ' },
  { id: 'node_1', lat: 3.141, lng: 101.690, isBase: false, label: null },
  // ...
]
```

### Rules
- Node at index 0 is ALWAYS `base_0` (First Responder HQ)
- Nodes use random polar coordinates (angle + radius) to avoid grid patterns
- `SPREAD_RADIUS = 0.06` degrees (~6km)
- Nodes are NOT persisted to disk — regenerated each server restart

---

## Function: `computeRoute(nodes, origin, base, maxHops)`

### Goal
Simulate a greedy gossip-forwarding routing algorithm from an SOS origin to the First Responder base.

### Inputs
| Param | Type | Default | Description |
|---|---|---|---|
| `nodes` | `Node[]` | — | Full swarm array from `generateNodes()` |
| `origin` | `{ lat, lng }` | — | SOS trigger coordinates |
| `base` | `Node` | — | The `base_0` node (target destination) |
| `maxHops` | `number` | `12` | Maximum hops before forced termination (TTL) |

### Algorithm
```
1. Find the node closest to `origin` → current
2. Add current to trace[], mark as visited
3. LOOP until maxHops or current.isBase:
   a. Find the unvisited node closest to `base`
   b. Add it to trace[], mark as visited
   c. current = that node
4. If last node ≠ base_0, force-append base_0
5. Return trace[]
```

### Output
```js
[
  { nodeId: 'node_42', lat: 3.144, lng: 101.693, hopIndex: 0, label: null },
  { nodeId: 'node_7',  lat: 3.141, lng: 101.690, hopIndex: 1, label: null },
  { nodeId: 'base_0',  lat: 3.139, lng: 101.687, hopIndex: 2, label: 'First Responder HQ' }
]
```

### Edge Cases
| Case | Behavior |
|---|---|
| Origin is at base coordinates | Route is 1 hop (origin nearest node → base_0) |
| All nodes visited before reaching base | Loop terminates; base_0 appended manually |
| maxHops reached | Loop breaks; base_0 appended manually |

---

## Known Limitations
- Algorithm is O(n²) — fine for n=150, not suited for n > 10,000
- Routing is greedy, not globally optimal (mimics real gossip protocol limitations)
- No weighted edges or link quality simulation

---

## Future Improvements
- Add weighted edges based on simulated "signal strength"
- Implement Dijkstra/A* for comparison visualization
- Support multiple simultaneous SOS events with isolated route traces
