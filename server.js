const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { generateNodes, computeRoute } = require('./src/swarmEngine');
const { admitSos, getAllHospitalStrains, findBestHospital } = require('./src/strainModel');
const { HOSPITALS } = require('./src/data/hospitals');

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

// Hospital strain API endpoint (for direct polling if needed)
app.get('/hospitals', (req, res) => {
  res.json(getAllHospitalStrains());
});

// Generate swarm nodes (citizen nodes only, no base — hospitals are the bases now)
const swarmNodes = generateNodes(150);

io.on('connection', (socket) => {
  console.log(`[MeshGuard] User connected: ${socket.id}`);

  // Send both swarm nodes and hospital data to new clients
  socket.emit('matrix_sync', {
    nodes: swarmNodes,
    hospitals: getAllHospitalStrains(),
  });

  // Listen for SOS trigger from the mobile app
  socket.on('trigger_sos', (payload) => {
    console.log(`[MeshGuard] SOS received from ${socket.id}:`, payload);

    const { lat, lng, type } = payload;

    // === PREDICTIVE MODEL: find the best available hospital ===
    const targetHospital = findBestHospital({ lat, lng });

    // Register the admission against the chosen hospital's load
    admitSos(targetHospital.id);

    // Compute the routing trace via swarm engine toward the target hospital
    const trace = computeRoute(swarmNodes, { lat, lng }, targetHospital);

    // Get the updated strain snapshot after admission
    const hospitalStrains = getAllHospitalStrains();

    // Broadcast the trace + updated hospital strains to ALL connected clients
    io.emit('mesh_trace', {
      origin: { lat, lng },
      type: type || 'SOS',
      trace,
      timestamp: new Date().toISOString(),
      targetHospital: {
        id: targetHospital.id,
        label: targetHospital.label,
        status: targetHospital.status,
      },
    });

    // Broadcast the updated hospital strain data
    io.emit('hospital_strain_update', hospitalStrains);

    console.log(
      `[MeshGuard] Routed to: ${targetHospital.label} (Strain: ${targetHospital.status}) | Trace: ${trace.length} hops`
    );
  });

  socket.on('disconnect', () => {
    console.log(`[MeshGuard] User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🌐 MeshGuard Backend running on http://localhost:${PORT}`);
  console.log(`📡 ${swarmNodes.length} virtual citizen nodes active in swarm matrix`);
  console.log(`🏥 ${HOSPITALS.length} hospitals online with strain prediction model\n`);
});
