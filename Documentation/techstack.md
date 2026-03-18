# Tech Stack — MeshGuard

MeshGuard is a decentralized Edge-Triage platform designed for disaster resilience. Below is the breakdown of our 4-layer technical architecture and the technologies that power them.

## 1. Backend (The Brain)
- **Node.js**: Asynchronous runtime environment.
- **Express.js**: Lightweight HTTP framework used for the status API and hospital data endpoints.
- **Swarm Engine**: Our custom-built routing logic that simulates the **Greedy Gossip-Forwarding** protocol. It handles virtual node generation and hop-by-hop mesh trace calculation.

## 2. Real-Time Layer (The Brainstem)
- **Socket.io**: Enables instant, bidirectional synchronization between the mobile apps and the command dashboard. 
- **Broadcast Events**:
  - `matrix_sync`: Syncs the swarm node positions to new clients.
  - `mesh_trace`: Animates the hop-by-hop SOS signals across the city.
  - `hospital_strain_update`: Real-time updates on facility capacity and "Time-to-Critical" predictions.

## 3. Frontend (The User Face)
- **React 18/19 & Vite**: Modern framework and build tool for high-performance UI components.
- **Tailwind CSS**: Utility-first CSS for our "Cyberpunk Dark Mode" aesthetic.
- **React-Leaflet / Leaflet.js**: Handles the cartographic map layer.
- **Canvas/SVG Animation**: Powers the `TraceAnimator` to show signal ripples and mesh hops.

## 4. Intelligence & Data
- **Real-World Hospital Data**: Sourced from **KKMNow** and **OpenDOSM** (Official Malaysian public health data). This includes precise geographic coordinates and hospital bed capacity metrics for all major facilities in the Klang Valley.
- **Predictive Strain Model**: An **Exponential Decay Algorithm** that calculates real-time hospital occupancy. By ingesting official data as a baseline and layering live SOS broadcast frequency, the model predicts facility "Time-to-Critical" (TTC).
- **Intelligent Rerouting**: When the model identifies a hospital as "Critical" (Red), the mesh network automatically diverts the `mesh_trace` to the next nearest available facility, preventing medical bottlenecks during mass-casualty events.

---

### Key Differentiator
MeshGuard operates with **$0 API costs**. All map tiles (CartoDB DarkMatter) and data sources are free or official government-provided datasets, making it an ideal "infrastructure-free" solution for emergency contexts.

---

## 🚀 Roadmap: From Prototype to Product
### 1. Current State (Functional MVP)
- **Infrastructure:** Centralized Node.js backend using **Socket.io** to simulate mesh connectivity.
- **Node Graph:** 150 virtual citizen nodes generated at startup to demonstrate swarm density.
- **Simulation:** Mesh routing is computed server-side to ensure deterministic demo results.

### 2. Physical Deployment (Real Life)
- **True P2P:** Transition from Socket.io to **Bluetooth Low Energy (BLE)** and **Wi-Fi Direct**.
- **Edge Storage:** Local SQLite/IndexedDB for offline SOS history.
- **Hardware Agnostic:** Deployable as a PWA or native mobile app (React Native/Expo).

---

## 📱 Demo Implementation
### Demonstrating Pings
The platform uses the **Mesh Trace** animation on the Dashboard. When a signal is triggered, it visualizes the "greedy gossip" hop-by-hop path across the city, providing a tangible view of the decentralized routing in action.

### Multiple Device SOS
The system supports concurrent emergencies. By opening the `/mobile` route on different physical devices or browser tabs, you can demonstrate simultaneous SOS broadcasts. The Dashboard will render isolated traces for each event and intelligently route them to the most suitable medical facility based on live capacity.
