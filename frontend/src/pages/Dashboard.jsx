import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';
import { io } from 'socket.io-client';

// ── Animated trace component: draws hops one by one ──────────────────────────
function TraceAnimator({ trace }) {
    const [visibleHops, setVisibleHops] = useState([]);

    useEffect(() => {
        if (!trace || trace.length === 0) return;
        setVisibleHops([]);
        trace.forEach((hop, i) => {
            setTimeout(() => {
                setVisibleHops((prev) => [...prev, hop]);
            }, i * 280);
        });
    }, [trace]);

    const lines = [];
    for (let i = 0; i < visibleHops.length - 1; i++) {
        lines.push([
            [visibleHops[i].lat, visibleHops[i].lng],
            [visibleHops[i + 1].lat, visibleHops[i + 1].lng],
        ]);
    }

    return (
        <>
            {lines.map((pos, i) => (
                <Polyline
                    key={i}
                    positions={pos}
                    pathOptions={{
                        color: '#00ffcc',
                        weight: 2.5,
                        opacity: 0.9,
                    }}
                />
            ))}
            {visibleHops.map((hop, i) => (
                <CircleMarker
                    key={hop.nodeId + i}
                    center={[hop.lat, hop.lng]}
                    radius={hop.label ? 12 : 6}
                    pathOptions={{
                        color: hop.label ? '#00ff88' : '#00ffcc',
                        fillColor: hop.label ? '#00ff88' : '#00ffcc',
                        fillOpacity: 0.9,
                        weight: 2,
                    }}
                />
            ))}
        </>
    );
}

// ── Auto-fit map when trace arrives ──────────────────────────────────────────
function MapFitter({ sos }) {
    const map = useMap();
    useEffect(() => {
        if (sos) {
            map.flyTo([sos.lat, sos.lng], 14, { duration: 1.5 });
        }
    }, [sos, map]);
    return null;
}

// ── Terminal log feed ─────────────────────────────────────────────────────────
function TerminalLog({ logs }) {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div style={styles.terminal}>
            <div style={styles.terminalHeader}>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
                    ▶ MESH_FEED
                </span>
                <span style={styles.terminalBadge}>{logs.length} events</span>
            </div>
            <div style={styles.terminalBody}>
                {logs.length === 0 && (
                    <div style={styles.terminalEmpty}>Awaiting signal...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} style={styles.terminalLine}>
                        <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                        <span style={{ color: log.color || 'var(--accent-cyan)' }}>{log.text}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [nodes, setNodes] = useState([]);
    const [base, setBase] = useState(null);
    const [currentTrace, setCurrentTrace] = useState([]);
    const [sosOrigin, setSosOrigin] = useState(null);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ totalSOS: 0, totalHops: 0, activeNodes: 0 });
    const [connected, setConnected] = useState(false);

    const addLog = (text, color) => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs((prev) => [...prev.slice(-80), { text, time, color }]);
    };

    useEffect(() => {
        const socket = io();

        socket.on('connect', () => {
            setConnected(true);
            addLog('Dashboard connected to swarm backbone', 'var(--accent-green)');
        });

        socket.on('matrix_sync', ({ nodes: n, base: b }) => {
            setNodes(n);
            setBase(b);
            setStats((s) => ({ ...s, activeNodes: n.length }));
            addLog(`Swarm matrix loaded: ${n.length} citizen nodes active`, 'var(--accent-blue)');
        });

        socket.on('mesh_trace', ({ origin, type, trace, timestamp }) => {
            setSosOrigin(origin);
            setCurrentTrace(trace);
            setStats((s) => ({
                totalSOS: s.totalSOS + 1,
                totalHops: s.totalHops + trace.length,
                activeNodes: s.activeNodes,
            }));
            addLog(`⚠ ${type} at [${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}]`, 'var(--accent-red)');
            trace.forEach((hop, i) => {
                setTimeout(() => {
                    addLog(
                        `  [${hop.nodeId}] Signal received → forwarding (hop ${hop.hopIndex})`,
                        hop.label ? 'var(--accent-green)' : 'var(--accent-cyan)'
                    );
                }, i * 280);
            });
        });

        socket.on('disconnect', () => {
            setConnected(false);
            addLog('Connection lost — attempting to reconnect...', 'var(--accent-amber)');
        });

        return () => socket.disconnect();
    }, []);

    const centerPos = base ? [base.lat, base.lng] : [3.139, 101.6869];

    return (
        <div style={styles.root}>
            {/* ── Top Header ── */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.logo}>⬡ MESHGUARD</div>
                    <div style={styles.tagline}>Decentralized Swarm Intelligence Network</div>
                </div>
                <div style={styles.headerRight}>
                    <StatCard label="ACTIVE NODES" value={stats.activeNodes} color="var(--accent-blue)" />
                    <StatCard label="SOS EVENTS" value={stats.totalSOS} color="var(--accent-red)" />
                    <StatCard label="TOTAL HOPS" value={stats.totalHops} color="var(--accent-cyan)" />
                    <div style={{ ...styles.statusDot, background: connected ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                        <span style={{ ...styles.statusPulse, animationPlayState: connected ? 'running' : 'paused' }} />
                        {connected ? 'LIVE' : 'RECONNECTING'}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={styles.body}>
                {/* Map Panel */}
                <div style={styles.mapPanel}>
                    {nodes.length > 0 && (
                        <MapContainer
                            center={centerPos}
                            zoom={13}
                            style={{ width: '100%', height: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                            />

                            {/* All citizen nodes */}
                            {nodes.filter((n) => !n.isBase).map((node) => (
                                <CircleMarker
                                    key={node.id}
                                    center={[node.lat, node.lng]}
                                    radius={4}
                                    pathOptions={{
                                        color: 'rgba(0,170,255,0.8)',
                                        fillColor: 'rgba(0,170,255,0.5)',
                                        fillOpacity: 1,
                                        weight: 1,
                                    }}
                                />
                            ))}

                            {/* First Responder Base */}
                            {base && (
                                <CircleMarker
                                    center={[base.lat, base.lng]}
                                    radius={16}
                                    pathOptions={{
                                        color: 'var(--accent-green)',
                                        fillColor: 'rgba(0,255,136,0.3)',
                                        fillOpacity: 1,
                                        weight: 3,
                                    }}
                                />
                            )}

                            {/* SOS Origin Ping */}
                            {sosOrigin && (
                                <CircleMarker
                                    center={[sosOrigin.lat, sosOrigin.lng]}
                                    radius={20}
                                    pathOptions={{
                                        color: 'var(--accent-red)',
                                        fillColor: 'rgba(255,51,102,0.4)',
                                        fillOpacity: 1,
                                        weight: 3,
                                    }}
                                />
                            )}

                            {/* Animated routing trace */}
                            <TraceAnimator trace={currentTrace} />

                            {sosOrigin && <MapFitter sos={sosOrigin} />}
                        </MapContainer>
                    )}

                    {nodes.length === 0 && (
                        <div style={styles.mapLoading}>
                            <div style={styles.loadingSpinner} />
                            <p>Loading swarm matrix...</p>
                        </div>
                    )}

                    {/* Map Legend */}
                    <div style={styles.legend}>
                        <LegendItem color="#00aaff" label="Citizen Node" />
                        <LegendItem color="#00ff88" label="Responder Base" />
                        <LegendItem color="#ff3366" label="SOS Origin" />
                        <LegendItem color="#00ffcc" label="Mesh Route" />
                    </div>
                </div>

                {/* Terminal Panel */}
                <TerminalLog logs={logs} />
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color }}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: color }} />
            <span>{label}</span>
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-deep)',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
        flexShrink: 0,
    },
    headerLeft: { display: 'flex', flexDirection: 'column' },
    logo: {
        fontSize: '22px',
        fontWeight: 900,
        letterSpacing: '4px',
        background: 'linear-gradient(90deg, #00aaff, #00ffcc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    tagline: { fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px', marginTop: '2px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    statCard: { textAlign: 'center' },
    statValue: { fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono' },
    statLabel: { fontSize: '9px', letterSpacing: '2px', color: 'var(--text-muted)', marginTop: '2px' },
    statusDot: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '2px',
        position: 'relative',
    },
    statusPulse: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'white',
        animation: 'blink 1.5s infinite',
    },
    body: { display: 'flex', flex: 1, overflow: 'hidden' },
    mapPanel: { flex: 1, position: 'relative', overflow: 'hidden' },
    mapLoading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '16px',
        color: 'var(--text-secondary)',
    },
    loadingSpinner: {
        width: '40px',
        height: '40px',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent-blue)',
        borderRadius: '50%',
        animation: 'blink 1s linear infinite',
    },
    legend: {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(6,13,24,0.9)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
    },
    legendItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' },
    legendDot: { width: '10px', height: '10px', borderRadius: '50%' },
    terminal: {
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border)',
    },
    terminalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'JetBrains Mono',
        fontSize: '12px',
    },
    terminalBadge: {
        background: 'var(--bg-card2)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '2px 8px',
        fontSize: '10px',
        color: 'var(--text-muted)',
    },
    terminalBody: {
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        fontFamily: 'JetBrains Mono',
        fontSize: '11px',
        lineHeight: '1.8',
    },
    terminalEmpty: { color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' },
    terminalLine: { wordBreak: 'break-word' },
};
