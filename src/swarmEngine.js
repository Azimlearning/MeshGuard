/**
 * MeshGuard Swarm Engine
 * Handles virtual node generation and the decentralized mesh routing algorithm.
 * Simulates a gossip/flood routing protocol with TTL to prevent infinite bouncing.
 */

const CENTER = { lat: 3.139, lng: 101.6869 }; // Kuala Lumpur city center
const SPREAD_RADIUS = 0.06; // ~6km radius spread

/**
 * Generates a given number of virtual "citizen" nodes spread around the center.
 * @param {number} count - Number of nodes to generate
 * @returns {Array} Array of node objects
 */
function generateNodes(count = 150) {
    const nodes = [];

    // First node is always the First Responder Base
    nodes.push({
        id: 'base_0',
        lat: CENTER.lat,
        lng: CENTER.lng,
        isBase: true,
        label: 'First Responder HQ',
    });

    for (let i = 1; i < count; i++) {
        // Use random angle and radius for natural, non-grid distribution
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * SPREAD_RADIUS;

        nodes.push({
            id: `node_${i}`,
            lat: CENTER.lat + radius * Math.cos(angle),
            lng: CENTER.lng + radius * Math.sin(angle),
            isBase: false,
        });
    }

    return nodes;
}

/**
 * Calculates the Haversine distance between two lat/lng points (approximate for short distances).
 * @param {Object} a - { lat, lng }
 * @param {Object} b - { lat, lng }
 * @returns {number} Distance in degrees (proxy for speed)
 */
function distance(a, b) {
    const dLat = a.lat - b.lat;
    const dLng = a.lng - b.lng;
    return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Simulates the mesh routing: a greedy hop-by-hop algorithm.
 * Each hop picks the neighbor closest to the base that hasn't been visited.
 * This mimics a simplified gossip/greedy forwarding protocol.
 *
 * @param {Array} nodes - All swarm nodes
 * @param {Object} origin - SOS origin { lat, lng }
 * @param {Object} base - The First Responder base node
 * @param {number} maxHops - Max allowed hops (TTL)
 * @returns {Array} Ordered array of hop objects { nodeId, lat, lng, hopIndex }
 */
function computeRoute(nodes, origin, base, maxHops = 12) {
    const visited = new Set();
    const trace = [];

    // Step 1: find the closest node to the SOS origin
    let current = nodes.reduce((closest, node) => {
        return distance(origin, node) < distance(origin, closest) ? node : closest;
    });

    visited.add(current.id);
    trace.push({
        nodeId: current.id,
        lat: current.lat,
        lng: current.lng,
        hopIndex: 0,
        label: current.label || null,
    });

    // Greedy hop towards the base
    for (let hop = 1; hop <= maxHops; hop++) {
        if (current.isBase || current.id === base.id) break;

        // Find unvisited neighbors closest to the base
        const nextHop = nodes
            .filter((n) => !visited.has(n.id))
            .reduce((best, node) => {
                return distance(node, base) < distance(best, base) ? node : best;
            });

        visited.add(nextHop.id);
        trace.push({
            nodeId: nextHop.id,
            lat: nextHop.lat,
            lng: nextHop.lng,
            hopIndex: hop,
            label: nextHop.label || null,
        });

        current = nextHop;

        if (nextHop.isBase || nextHop.id === base.id) break;
    }

    // Ensure the trace always ends at the base
    if (trace[trace.length - 1].nodeId !== base.id) {
        trace.push({
            nodeId: base.id,
            lat: base.lat,
            lng: base.lng,
            hopIndex: trace.length,
            label: base.label,
        });
    }

    return trace;
}

module.exports = { generateNodes, computeRoute, CENTER };
