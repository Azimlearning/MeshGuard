import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

const EMERGENCY_TYPES = [
    { id: 'FIRE', emoji: '🔥', label: 'Fire', color: '#ff6633' },
    { id: 'TRAPPED', emoji: '🚧', label: 'Trapped', color: '#ffaa00' },
    { id: 'MEDICAL', emoji: '🩺', label: 'Medical', color: '#ff3366' },
    { id: 'FLOOD', emoji: '🌊', label: 'Flood', color: '#0088ff' },
];

export default function MobileApp() {
    const [connected, setConnected] = useState(false);
    const [selectedType, setSelectedType] = useState('SOS');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [hopCount, setHopCount] = useState(0);
    const [peerCount, setPeerCount] = useState(0);
    const [lastEvent, setLastEvent] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            setPeerCount(Math.floor(Math.random() * 8) + 3); // simulated nearby peers
        });

        socket.on('matrix_sync', ({ nodes }) => {
            setPeerCount(Math.min(nodes.length, Math.floor(Math.random() * 8) + 3));
        });

        socket.on('mesh_trace', ({ trace, type, timestamp }) => {
            setHopCount(trace.length);
            setStatus('sent');
            setLastEvent({ type, hops: trace.length, time: new Date(timestamp).toLocaleTimeString() });
            setTimeout(() => setStatus('idle'), 4000);
        });

        socket.on('disconnect', () => setConnected(false));
        return () => socket.disconnect();
    }, []);

    const triggerSOS = () => {
        if (!connected || status === 'sending') return;
        setStatus('sending');
        setHopCount(0);

        // Use a simulated lat/lng near KL for demo purposes
        const originLat = 3.139 + (Math.random() - 0.5) * 0.05;
        const originLng = 101.6869 + (Math.random() - 0.5) * 0.05;

        socketRef.current.emit('trigger_sos', {
            lat: originLat,
            lng: originLng,
            type: selectedType,
        });
    };

    const isSending = status === 'sending';
    const isSent = status === 'sent';

    return (
        <div style={styles.root}>
            {/* Scanline overlay for atmosphere */}
            <div style={styles.scanline} />

            {/* ── Status Bar ── */}
            <div style={styles.statusBar}>
                <div style={styles.appName}>⬡ CIVIL-MESH</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ ...styles.connDot, background: connected ? '#00ff88' : '#ffaa00' }} />
                    <span style={styles.connText}>
                        {connected ? `${peerCount} peers` : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* ── Header Info ── */}
            <div style={styles.header}>
                <div style={styles.modeLabel}>OFFLINE MESH MODE</div>
                <h1 style={styles.title}>Emergency<br />Broadcast</h1>
                <p style={styles.subtitle}>
                    Your signal will hop through nearby devices to reach First Responders — no towers needed.
                </p>
            </div>

            {/* ── Emergency Type Selector ── */}
            <div style={styles.typeGrid}>
                {EMERGENCY_TYPES.map((t) => (
                    <button
                        key={t.id}
                        style={{
                            ...styles.typeBtn,
                            border: selectedType === t.id
                                ? `2px solid ${t.color}`
                                : '2px solid rgba(255,255,255,0.08)',
                            background: selectedType === t.id
                                ? `${t.color}22`
                                : 'rgba(255,255,255,0.04)',
                        }}
                        onClick={() => setSelectedType(t.id)}
                    >
                        <div style={styles.typeEmoji}>{t.emoji}</div>
                        <div style={{ ...styles.typeLabel, color: selectedType === t.id ? t.color : '#7a9fc2' }}>
                            {t.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* ── SOS Button ── */}
            <div style={styles.btnWrapper}>
                <button
                    id="sos-button"
                    style={{
                        ...styles.sosBtn,
                        animation: isSending
                            ? 'sos-btn-pulse 0.8s infinite'
                            : isSent
                                ? 'none'
                                : 'sos-btn-pulse 2.5s infinite',
                        background: isSent
                            ? 'radial-gradient(circle, #002200, #000)'
                            : 'radial-gradient(circle, #330011, #000)',
                        border: isSent ? '3px solid #00ff88' : '3px solid #ff3366',
                        cursor: isSending ? 'wait' : 'pointer',
                        transform: isSending ? 'scale(0.96)' : 'scale(1)',
                    }}
                    onClick={triggerSOS}
                    disabled={isSending || !connected}
                >
                    <div style={styles.sosBtnInner}>
                        {isSending ? (
                            <>
                                <div style={styles.sosIcon}>📡</div>
                                <div style={styles.sosLabel}>BROADCASTING</div>
                                <div style={styles.sosSubLabel}>Routing through mesh...</div>
                            </>
                        ) : isSent ? (
                            <>
                                <div style={styles.sosIcon}>✅</div>
                                <div style={{ ...styles.sosLabel, color: '#00ff88' }}>DELIVERED</div>
                                <div style={styles.sosSubLabel}>{hopCount} hops to responder</div>
                            </>
                        ) : (
                            <>
                                <div style={styles.sosIcon}>🆘</div>
                                <div style={styles.sosLabel}>{selectedType}</div>
                                <div style={styles.sosSubLabel}>Tap to broadcast</div>
                            </>
                        )}
                    </div>
                </button>
            </div>

            {/* ── Last Event Card ── */}
            {lastEvent && (
                <div style={styles.eventCard}>
                    <div style={styles.eventTitle}>✔ Last Signal Delivered</div>
                    <div style={styles.eventRow}>
                        <span style={{ color: 'var(--text-muted)' }}>Type</span>
                        <span style={{ color: '#00ffcc' }}>{lastEvent.type}</span>
                    </div>
                    <div style={styles.eventRow}>
                        <span style={{ color: 'var(--text-muted)' }}>Hops</span>
                        <span style={{ color: '#00ffcc' }}>{lastEvent.hops}</span>
                    </div>
                    <div style={styles.eventRow}>
                        <span style={{ color: 'var(--text-muted)' }}>Time</span>
                        <span style={{ color: '#00ffcc' }}>{lastEvent.time}</span>
                    </div>
                </div>
            )}

            {/* ── Footer ── */}
            <div style={styles.footer}>
                <span>No internet · No towers · No limits</span>
            </div>
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
    root: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #020812 0%, #050f1e 60%, #02060e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 0 30px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
    },
    scanline: {
        position: 'fixed',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,170,255,0.012) 2px, rgba(0,170,255,0.012) 4px)',
        pointerEvents: 'none',
        zIndex: 10,
    },
    statusBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 10px',
        borderBottom: '1px solid rgba(0,170,255,0.1)',
    },
    appName: {
        fontSize: '13px',
        fontWeight: 900,
        letterSpacing: '4px',
        background: 'linear-gradient(90deg, #00aaff, #00ffcc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    connDot: {
        width: '8px', height: '8px', borderRadius: '50%',
        boxShadow: '0 0 6px currentColor',
    },
    connText: { fontSize: '11px', color: '#7a9fc2', fontFamily: 'JetBrains Mono' },
    header: { width: '100%', padding: '28px 24px 16px', textAlign: 'center' },
    modeLabel: {
        fontSize: '10px', letterSpacing: '3px', color: '#00ffcc',
        marginBottom: '10px', fontFamily: 'JetBrains Mono',
    },
    title: {
        fontSize: '36px', fontWeight: 900, lineHeight: 1.15,
        background: 'linear-gradient(135deg, #ffffff 0%, #7ab8ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '12px',
    },
    subtitle: {
        fontSize: '13px', color: '#7a9fc2', lineHeight: 1.7,
        maxWidth: '280px', margin: '0 auto',
    },
    typeGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '10px', padding: '0 24px', width: '100%', maxWidth: '380px',
    },
    typeBtn: {
        padding: '14px 12px',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s',
    },
    typeEmoji: { fontSize: '24px' },
    typeLabel: { fontSize: '12px', fontWeight: 600, letterSpacing: '1px' },
    btnWrapper: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '32px 0 24px',
    },
    sosBtn: {
        width: '200px', height: '200px',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.15s, border 0.3s',
        outline: 'none',
    },
    sosBtnInner: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '6px',
    },
    sosIcon: { fontSize: '40px', lineHeight: 1 },
    sosLabel: {
        fontSize: '16px', fontWeight: 900, letterSpacing: '3px', color: '#ff3366',
    },
    sosSubLabel: { fontSize: '11px', color: '#7a9fc2', letterSpacing: '1px' },
    eventCard: {
        width: 'calc(100% - 48px)', maxWidth: '332px',
        background: 'rgba(0,255,136,0.05)',
        border: '1px solid rgba(0,255,136,0.2)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        animation: 'slide-in 0.4s ease',
    },
    eventTitle: { fontSize: '12px', fontWeight: 700, color: '#00ff88', letterSpacing: '1px', marginBottom: '4px' },
    eventRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'JetBrains Mono' },
    footer: {
        position: 'fixed', bottom: '16px',
        fontSize: '11px', color: '#3d5a7a', letterSpacing: '2px',
        fontFamily: 'JetBrains Mono',
    },
};
