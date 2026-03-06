# ⬡ MeshGuard (formerly Civil-Mesh)
> **"When the towers fall, the people become the network."**

MeshGuard is a proof-of-concept application built for the **V-HACK 2026 Hackathon**. It tackles the "First Responder of the Future" challenge by demonstrating a **Decentralized Swarm Intelligence Network**.

In disaster scenarios where traditional communication infrastructure (cell towers, Wi-Fi) is destroyed, MeshGuard enables citizen smartphones to form resilient peer-to-peer mesh networks. Citizens can broadcast SOS signals that actively hop from device to device until they reach a First Responder base.

---

## 🏗️ Architecture Under the Hood

MeshGuard uses a monorepo setup, running two interconnected applications:

1. **The Backend (Swarm Engine):** A Node.js server (`server.js`). It acts as the "brain". On startup, it generates a virtual environment of 150 offline "citizen nodes" scattered around the city. It handles the greedy hop-by-hop mesh routing logic that simulates a gossip protocol.
2. **The Frontend (UI Layer):** A React + Vite Web App (`/frontend`). It provides two separate views:
   - **Command Dashboard:** A massive cartographic layout plotting the nodes and visualizing the tracing data in real-time.
   - **Responder Mobile App:** A tactical, high-contrast PWA interface for the physical user triggering the distress signal.
3. **The Brainstem (WebSockets):** Using Socket.io, the backend and frontend are tethered in real-time. Signals broadcasted from the mobile UI are instantly routed by the backend engine and visually traced on the dashboard.

---

## 🚀 Setup & Installation

You will need two separate terminal windows to run both the backend and frontend simultaneously.

**Prerequisites:** 
- Node.js (v18+ recommended)
- A laptop (Command Center) and a smartphone (Citizen Device) on the **same Wi-Fi network**.

### 1. Start the Backend Brain (Terminal 1)
```bash
# Navigate to the project root directory
cd MeshGuard

# Install backend dependencies
npm install

# Start the Node server
npm start
```
*Expected output:* `🌐 Civil-Mesh Backend running on http://localhost:3001` and `📡 150 virtual citizen nodes active in swarm matrix`

### 2. Start the Frontend UI (Terminal 2)
```bash
# Open a new terminal and navigate into the frontend folder
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server and expose it to your local network
npm run dev -- --host
```
*Expected output:* Note the `Network:` IP address provided by Vite (e.g., `http://192.168.Y.X:4000/`). You will need this for the mobile app.

---

## 📱 Running the Live Demo (The Pitch)

This is the exact sequence to demonstrate the swarm routing "Wow" factor to judges:

### Step A: Prepare the "Command Center" (Laptop Screen)
1. Open your laptop browser (Chrome/Edge/Safari).
2. Go to `http://localhost:4000/dashboard`
3. Enter Full Screen (`F11`). 
4. *You should see a dark map filled with blue citizen nodes, waiting for a signal.*

### Step B: Prepare the "Citizen Device" (Your Smartphone)
1. Ensure your smartphone is connected to the exact same Wi-Fi network as the laptop.
2. Open your mobile browser (Safari/Chrome).
3. Type the `Network` IP address from Terminal 2, appended with `/mobile`.
   - *Example:* `http://192.168.1.55:4000/mobile`
4. *You should see the dark tactical Emergency Broadcast UI.*

### Step C: Execute the Swarm Protocol (Live Demo)
1. Hold up your phone to the judges to highlight the offline disaster scenario.
2. Tap the nature of the emergency (e.g., 🔥 FIRE or 🚧 TRAPPED).
3. Tap the pulsing red **SOS Broadcast** button.
4. Keep the judges' eyes on the laptop dashboard. 
5. **The Effect:** A red sonar ring will ping the map, and a bright cyan line will visually "hop" through the swarm of blue dots, dynamically bouncing across the city until it delivers the payload to the First Responder Base.
6. The phone will update to say "DELIVERED", showing exactly how many secure device hops it took.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React-Leaflet (CartoDB DarkMatter)
- **Backend:** Node.js, Express
- **Real-Time Integration:** Socket.io
- **Routing Engine:** Custom greedy hop-by-hop geometry logic (`swarmEngine.js`)
