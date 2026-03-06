const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { generateNodes, computeRoute } = require('./src/swarmEngine');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Health check endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'MeshGuard Backend Online', timestamp: new Date().toISOString() });
});

// Generate swarm nodes once at startup -> shared between all clients
const swarmNodes = generateNodes(150);

// The designated "First Responder Base" node (index 0)
const BASE_NODE = swarmNodes[0];

io.on('connection', (socket) => {
  console.log(`[MeshGuard] User connected: ${socket.id}`);

  // Task 3: Emit the swarm matrix to the newly connected client
  socket.emit('matrix_sync', { nodes: swarmNodes, base: BASE_NODE });

  // Task 4: Listen for SOS trigger from the mobile app
  socket.on('trigger_sos', (payload) => {
    console.log(`[MeshGuard] SOS received from ${socket.id}:`, payload);

    const { lat, lng, type } = payload;

    // Compute the routing trace via swarm engine
    const trace = computeRoute(swarmNodes, { lat, lng }, BASE_NODE);

    // Broadcast the trace to ALL connected clients (including the dashboard)
    io.emit('mesh_trace', {
      origin: { lat, lng },
      type: type || 'SOS',
      trace,
      timestamp: new Date().toISOString(),
    });

    console.log(`[MeshGuard] Trace computed: ${trace.length} hops`);
  });

  socket.on('disconnect', () => {
    console.log(`[MeshGuard] User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🌐 MeshGuard Backend running on http://localhost:${PORT}`);
  console.log(`📡 ${swarmNodes.length} virtual citizen nodes active in swarm matrix\n`);
});
