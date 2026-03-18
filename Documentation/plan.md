# MeshGuard (Edge-Triage) Implementation Plan

**Goal:** Build a hybrid simulator demonstrating decentralized swarm intelligence through a local Node.js server, visually plotting SOS signals jumping between virtual nodes on a command dashboard while responding in real-time to a mobile web app triggered by the user's phone.
**Architecture / Approach:** A single monorepo backend (Node.js/Express) serving an interactive dashboard (React/MapGL) and a mobile-view endpoint. Real-time connections are handled with Socket.io. The backend runs a mock P2P routing algorithm on a generated graph of virtual "citizen nodes".
**Tech Stack / Tools:** Next.js (Web/Mobile Frontend + API Routes), Tailwind CSS, Socket.io, Leaflet/React-Leaflet (Mapping).

---

### Task 1: Setup and Initialization

**Files:**
- Create: `package.json`
- Create: `server.js`

**Step 1: Write the test (or data handshake)**
Initialize the Node.js project and setup an Express server that can serve a basic health-check endpoint.

**Step 2: Verify it fails (or connect)**
Run command: `npm start` (should fail before package.json and dependencies exist).

**Step 3: Write minimal implementation**
Run `npm init -y` and `npm install express socket.io cors`. Write `server.js` to run on port 3000.

**Step 4: Verify it passes**
Run `node server.js` and hit `http://localhost:3000/status` to get a 200 OK.

**Step 5: Record & Commit**
Update `progress.md` and run `git add . && git commit -m "Initialize project and backend server"`.

---

### Task 2: Real-time Socket Connection Handshake

**Files:**
- Modify: `server.js`
- Create: `public/index.html` (Test Client)

**Step 1: Write the test (or data handshake)**
Expect the server to log a successful connection when a client connects via WebSocket.

**Step 2: Verify it fails (or connect)**
Open the HTML file. No socket connection is made because `server.js` lacks Socket.io integration.

**Step 3: Write minimal implementation**
Wrap the Express server with `http` and attach `socket.io`. Add standard `io.on('connection')` logging. Create a basic HTML file with the socket.io client script to ping the server.

**Step 4: Verify it passes**
Open `http://localhost:3000` and see "User connected: [ID]" in the terminal.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit -m "Add Socket.io handshake"`.

---

### Task 3: The Virtual Swarm Matrix Generation

**Files:**
- Create: `src/swarmEngine.js`
- Modify: `server.js`

**Step 1: Write the test (or data handshake)**
Expect an array of 100 randomly generated node objects with coordinates (`lat`, `lng`) representing fake citizens in a radius around a central point, properly emitted to clients upon connection.

**Step 2: Verify it fails (or connect)**
Connect via client HTML, no node array payload is received.

**Step 3: Write minimal implementation**
Write `generateNodes()` in `swarmEngine.js`. When a client connects, emit the event `matrix_sync` with the array of nodes.

**Step 4: Verify it passes**
Console log the received payload on the client side HTML and ensure 100 node objects are present.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit -m "Implement Virtual Swarm Matrix Generation"`.

---

### Task 4: The Decentralized Routing Logic

**Files:**
- Modify: `src/swarmEngine.js`
- Modify: `server.js`

**Step 1: Write the test (or data handshake)**
Expect an incoming `trigger_sos` socket event containing coordinates. Server should calculate the nearest node, and return a series of "hops" (an array of node IDs mapped to a path towards a center base).

**Step 2: Verify it fails (or connect)**
Emit `trigger_sos` from client test page, expect no response.

**Step 3: Write minimal implementation**
Write a mock gossip/flood routing function. It finds the 5 closest nodes to the SOS ping, triggers them, and creates a step-by-step trace representing the data jumping through the nodes, ending via a `mesh_trace` event.

**Step 4: Verify it passes**
Fire the SOS event. Client console logs an array of trace step objects.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit -m "Implement mock mesh routing algorithm"`.

---

### Task 5: Mobile PWA "First Responder" UI

**Files:**
- Create: `React app for the frontend` (e.g., using Vite + React)
- Create: `frontend/src/pages/MobileApp.jsx`

**Step 1: Write the test (or data handshake)**
Expect a mobile-optimized view at `/mobile` with a giant "Broadcast Emergency" button that triggers the `trigger_sos` socket event.

**Step 2: Verify it fails (or connect)**
Navigate to `/mobile`, see a 404 or empty page.

**Step 3: Write minimal implementation**
Initialize the Vite React app. Build the dark mode `MobileApp.jsx` UI using Tailwind. Connect socket.io-client to the backend. Attach the SOS trigger to a large button click.

**Step 4: Verify it passes**
Load the page on the phone browser; clicking the button should trigger backend routing logs in the server terminal.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit -m "Build Mobile SOS UI"`.

---

### Task 6: The Command Dashboard Visualization

**Files:**
- Create: `frontend/src/pages/Dashboard.jsx`

**Step 1: Write the test (or data handshake)**
Expect a full window map displaying the 100 nodes, which dynamically animates when the SOS tracer data is received.

**Step 2: Verify it fails (or connect)**
Navigate to `/dashboard`. Map does not load or nodes do not render.

**Step 3: Write minimal implementation**
Use `React-Leaflet` or standard `Leaflet` to plot the 100 nodes. Listen for the `mesh_trace` socket events. When triggered, use CSS animations or Leaflet layer updates to draw lines and pulses between nodes chronologically based on the trace array.

**Step 4: Verify it passes**
With dashboard open on laptop and mobile opened on phone: Click button on phone. Instantly see red radar pulse on laptop and data routing graphically through the blue dots.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit -m "Build Command Dashboard Map integration"`.
