import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap, Marker, Tooltip } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';

// ── Hospital icon factory ──────────────────────────────────────────────────────
function getHospitalIcon(status) {
  const colors = { NORMAL: '#00ff88', WARNING: '#ffc107', CRITICAL: '#ff3366' };
  const color = colors[status] || '#00ff88';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="16" cy="38" rx="6" ry="2.5" fill="rgba(0,0,0,0.4)"/>
      <path d="M16 2 C8 2 2 8 2 16 C2 26 16 38 16 38 C16 38 30 26 30 16 C30 8 24 2 16 2Z"
            fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="2" filter="url(#glow)"/>
      <rect x="14" y="9" width="4" height="14" rx="1" fill="${color}"/>
      <rect x="9" y="14" width="14" height="4" rx="1" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    className: '',
  });
}

// ── Animated trace component: draws hops one by one ──────────────────────────
function TraceAnimator({ trace }) {
  const [visibleHops, setVisibleHops] = useState([]);
  useEffect(() => {
    if (!trace || trace.length === 0) return;
    setVisibleHops([]);
    trace.forEach((hop, i) => {
      setTimeout(() => { setVisibleHops((prev) => [...prev, hop]); }, i * 200);
    });
  }, [trace]);

  const lines = [];
  for (let i = 0; i < visibleHops.length - 1; i++) {
    lines.push([[visibleHops[i].lat, visibleHops[i].lng], [visibleHops[i + 1].lat, visibleHops[i + 1].lng]]);
  }
  return (
    <>
      {lines.map((pos, i) => (
        <Polyline key={i} positions={pos} pathOptions={{ color: '#00ffcc', weight: 2.5, opacity: 0.9 }} />
      ))}
      {visibleHops.map((hop, i) => (
        <CircleMarker key={hop.nodeId + i} center={[hop.lat, hop.lng]} radius={hop.isHospital ? 14 : 6}
          pathOptions={{ color: hop.isHospital ? '#00ff88' : '#00ffcc', fillColor: hop.isHospital ? '#00ff88' : '#00ffcc', fillOpacity: 0.9, weight: 2 }} />
      ))}
    </>
  );
}

// ── Auto-fit map when trace arrives ──────────────────────────────────────────
function MapFitter({ sos }) {
  const map = useMap();
  useEffect(() => { if (sos) map.flyTo([sos.lat, sos.lng], 14, { duration: 1.5 }); }, [sos, map]);
  return null;
}

// ── Terminal log feed ─────────────────────────────────────────────────────────
function TerminalLog({ logs }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);
  return (
    <div style={styles.terminal}>
      <div style={styles.terminalHeader}>
        <span style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>▶ MESH_FEED</span>
        <span style={styles.terminalBadge}>{logs.length} events</span>
      </div>
      <div style={styles.terminalBody}>
        {logs.length === 0 && <div style={styles.terminalEmpty}>Awaiting signal...</div>}
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

// ── Hospital Strain Sidebar ───────────────────────────────────────────────────
function HospitalSidebar({ hospitals }) {
  if (!hospitals || hospitals.length === 0) return null;

  const statusConfig = {
    NORMAL:   { color: '#00ff88', label: 'NORMAL',   bg: 'rgba(0,255,136,0.08)' },
    WARNING:  { color: '#ffc107', label: 'WARNING',  bg: 'rgba(255,193,7,0.08)' },
    CRITICAL: { color: '#ff3366', label: 'CRITICAL', bg: 'rgba(255,51,102,0.08)' },
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <span style={{ color: 'var(--accent-green)', fontFamily: 'JetBrains Mono' }}>🏥 HOSPITAL STRAIN</span>
        <span style={styles.terminalBadge}>LIVE</span>
      </div>
      <div style={styles.sidebarBody}>
        {hospitals.map((h) => {
          const cfg = statusConfig[h.status] || statusConfig.NORMAL;
          const pct = Math.min(h.strainRatio * 100, 100);
          return (
            <div key={h.id} style={{ ...styles.hospitalCard, background: cfg.bg, borderColor: cfg.color + '33' }}>
              <div style={styles.hospitalName}>{h.label}</div>
              <div style={styles.strainBarTrack}>
                <div style={{
                  ...styles.strainBarFill,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
                  boxShadow: `0 0 8px ${cfg.color}66`,
                }} />
              </div>
              <div style={styles.hospitalMeta}>
                <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{pct.toFixed(0)}% capacity</span>
              </div>
              {h.minutesToCritical !== null && h.status !== 'CRITICAL' && (
                <div style={{ ...styles.prediction, color: cfg.color }}>
                  ⏱ {h.minutesToCritical === Infinity ? '—' : `~${h.minutesToCritical}m to critical`}
                </div>
              )}
              {h.status === 'CRITICAL' && (
                <div style={{ ...styles.prediction, color: '#ff3366', animation: 'blink 1s infinite' }}>
                  ⚠ DIVERTING INCOMING SOS
                </div>
              )}
              <div style={styles.hospitalLoad}>
                Load: <b style={{ color: cfg.color }}>{h.effectiveLoad.toFixed(1)}</b> / {h.capacity}
              </div>
            </div>
          );
        })}
      </div>
      <div style={styles.sidebarFooter}>
        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          ★ Data: KKMNow / OpenDOSM · SDG 3
        </span>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [nodes, setNodes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
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

    socket.on('matrix_sync', ({ nodes: n, hospitals: h }) => {
      setNodes(n);
      setHospitals(h || []);
      setStats((s) => ({ ...s, activeNodes: n.length }));
      addLog(`Swarm matrix loaded: ${n.length} citizen nodes active`, 'var(--accent-blue)');
      if (h) addLog(`🏥 ${h.length} hospital nodes online — strain prediction active`, 'var(--accent-green)');
    });

    socket.on('mesh_trace', ({ origin, type, trace, timestamp, targetHospital }) => {
      setSosOrigin(origin);
      setCurrentTrace(trace);
      setStats((s) => ({ totalSOS: s.totalSOS + 1, totalHops: s.totalHops + trace.length, activeNodes: s.activeNodes }));
      addLog(`⚠ ${type} at [${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}]`, 'var(--accent-red)');
      if (targetHospital) {
        const tColor = targetHospital.status === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-green)';
        addLog(`🏥 Routing → ${targetHospital.label} [${targetHospital.status}]`, tColor);
      }
      trace.forEach((hop, i) => {
        setTimeout(() => {
          addLog(`  [${hop.nodeId}] Signal received → forwarding (hop ${hop.hopIndex})`,
            hop.isHospital ? 'var(--accent-green)' : 'var(--accent-cyan)');
        }, i * 280);
      });
    });

    socket.on('hospital_strain_update', (updatedHospitals) => {
      setHospitals(updatedHospitals);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      addLog('Connection lost — attempting to reconnect...', 'var(--accent-amber)');
    });

    return () => socket.disconnect();
  }, []);

  const defaultCenter = [3.139, 101.6869];

  return (
    <div style={styles.root}>
      {/* ── Top Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>⬡ MESHGUARD</div>
          <div style={styles.tagline}>Decentralized Swarm Intelligence · Predictive Hospital Routing</div>
        </div>
        <div style={styles.headerRight}>
          <StatCard label="ACTIVE NODES" value={stats.activeNodes} color="var(--accent-blue)" />
          <StatCard label="SOS EVENTS"   value={stats.totalSOS}    color="var(--accent-red)" />
          <StatCard label="TOTAL HOPS"   value={stats.totalHops}   color="var(--accent-cyan)" />
          <div style={{ ...styles.statusDot, background: connected ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
            <span style={{ ...styles.statusPulse, animationPlayState: connected ? 'running' : 'paused' }} />
            {connected ? 'LIVE' : 'RECONNECTING'}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={styles.body}>
        {/* Hospital Strain Sidebar */}
        <HospitalSidebar hospitals={hospitals} />

        {/* Map Panel */}
        <div style={styles.mapPanel}>
          {nodes.length > 0 && (
            <MapContainer center={defaultCenter} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
              />

              {/* Citizen nodes */}
              {nodes.filter((n) => !n.isBase).map((node) => (
                <CircleMarker key={node.id} center={[node.lat, node.lng]} radius={4}
                  pathOptions={{ color: 'rgba(0,170,255,0.8)', fillColor: 'rgba(0,170,255,0.5)', fillOpacity: 1, weight: 1 }} />
              ))}

              {/* Hospital nodes with dynamic strain color */}
              {hospitals.map((h) => {
                const icon = getHospitalIcon(h.status);
                return (
                  <Marker key={h.id} position={[h.lat, h.lng]} icon={icon}>
                    <Tooltip permanent={false} direction="top" offset={[0, -36]}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', background: '#0a1628', color: '#fff', padding: '4px 8px', borderRadius: '6px' }}>
                        🏥 {h.label}<br />
                        Status: <b style={{ color: h.status === 'CRITICAL' ? '#ff3366' : h.status === 'WARNING' ? '#ffc107' : '#00ff88' }}>{h.status}</b><br />
                        Load: {h.effectiveLoad.toFixed(1)} / {h.capacity}
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}

              {/* SOS Origin Ping */}
              {sosOrigin && (
                <CircleMarker center={[sosOrigin.lat, sosOrigin.lng]} radius={20}
                  pathOptions={{ color: 'var(--accent-red)', fillColor: 'rgba(255,51,102,0.4)', fillOpacity: 1, weight: 3 }} />
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
            <LegendItem color="#00ff88" label="Hospital (Normal)" />
            <LegendItem color="#ffc107" label="Hospital (Warning)" />
            <LegendItem color="#ff3366" label="Hospital (Critical) / SOS" />
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
  root:        { display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-deep)', overflow: 'hidden' },
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,170,255,0.15)', boxShadow: '0 2px 30px rgba(0,0,0,0.6), 0 1px 0 rgba(0,170,255,0.08)', flexShrink: 0 },
  headerLeft:  { display: 'flex', flexDirection: 'column' },
  logo:        { fontSize: '22px', fontWeight: 900, letterSpacing: '4px', background: 'linear-gradient(90deg, #00aaff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  tagline:     { fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px', marginTop: '2px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  statCard:    { textAlign: 'center', padding: '6px 12px', borderRadius: '8px', transition: 'background 0.2s ease', cursor: 'default' },
  statValue:   { fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono', letterSpacing: '1px' },
  statLabel:   { fontSize: '9px', letterSpacing: '2px', color: 'var(--text-muted)', marginTop: '3px', textTransform: 'uppercase' },
  statusDot:   { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', position: 'relative' },
  statusPulse: { width: '8px', height: '8px', borderRadius: '50%', background: 'white', animation: 'blink 1.5s infinite' },
  body:        { display: 'flex', flex: 1, overflow: 'hidden' },
  mapPanel:    { flex: 1, position: 'relative', overflow: 'hidden' },
  mapLoading:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--text-secondary)' },
  loadingSpinner: { width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  legend:      { position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(6,13,24,0.85)', border: '1px solid rgba(0,170,255,0.15)', borderRadius: '12px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)', zIndex: 1000 },
  legendItem:  { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' },
  legendDot:   { width: '10px', height: '10px', borderRadius: '50%' },
  // Sidebar
  sidebar:     { width: '260px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', flexShrink: 0 },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: '12px' },
  sidebarBody: { flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  sidebarFooter: { padding: '8px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' },
  hospitalCard: { borderRadius: '10px', padding: '10px 12px', border: '1px solid', display: 'flex', flexDirection: 'column', gap: '6px', transition: 'all 0.4s ease' },
  hospitalName: { fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 },
  strainBarTrack: { height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  strainBarFill:  { height: '100%', borderRadius: '3px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' },
  hospitalMeta:   { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'JetBrains Mono' },
  prediction:     { fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 600 },
  hospitalLoad:   { fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' },
  // Terminal
  terminal:    { width: '300px', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' },
  terminalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'JetBrains Mono', fontSize: '12px' },
  terminalBadge: { background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '2px 8px', fontSize: '10px', color: 'var(--text-muted)' },
  terminalBody:   { flex: 1, overflowY: 'auto', padding: '12px', fontFamily: 'JetBrains Mono', fontSize: '11px', lineHeight: '1.8' },
  terminalEmpty:  { color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' },
  terminalLine:   { wordBreak: 'break-word' },
};
