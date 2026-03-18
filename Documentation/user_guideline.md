# ⬡ MeshGuard User Guideline

Welcome to **MeshGuard**, the decentralized swarm intelligence network designed for disaster scenarios where traditional infrastructure has failed. This guide will help you understand and navigate the two core components of the system: the **Command Dashboard** and the **Mobile Emergency App**.

---

## 🖥️ Command Dashboard (The Eye)
The Command Dashboard is used by emergency coordinators to monitor the city-wide mesh network and manage hospital resources.

### 1. Swarm Matrix (The Map)
The central map displays the real-time state of the network.
- **Blue Dots (Citizen Nodes):** These represent active user devices (smartphones, tablets) acting as relay points.
- **Hospital Markers:** Larger icons representing medical facilities. Their colors indicate current load:
  - <span style="color:#00ff88">●</span> **Normal:** Plenty of capacity.
  - <span style="color:#ffc107">●</span> **Warning:** Reaching high load.
  - <span style="color:#ff3366">●</span> **Critical:** Full capacity; new SOS signals are automatically diverted.
- **SOS Origin Ping:** (The large pulsing red circle) Indicates the exact location where the emergency broadcast was initiated. It remains visible as a beacon for responders.
- **Mesh Traces:** When an SOS is triggered, a **Cyan Line** will visually "hop" through the nodes, showing the exact path the signal is taking across the city.

### 2. Hospital Strain (Left Sidebar)
Provides live capacity monitoring for all connected hospitals.
- **Strain Bars:** Shows the percentage of capacity currently in use.
- **Time to Critical:** A predictive metric showing approximately how many minutes until a hospital hits its limit based on current incoming traffic.
- **Divert Alerts:** Flashing red indicators appear when a hospital is overloaded, signaling the system to reroute new victims to safer locations.

### 3. Mesh Feed (Right Sidebar)
A real-time terminal log showing every packet "hop" in the network.
- Displays node IDs, hop indices, and routing decisions.
- Confirms when a signal has been successfully delivered to its destination.

---

## 📱 Mobile Emergency App (The Lifeline)
The Mobile App is a tactical interface for citizens to broadcast SOS signals when cellular and Wi-Fi networks are down.

### 1. Connectivity Status
- **Peer Count:** Top right indicator showing how many nearby devices you are currently meshed with.
- **Offline Mode:** Confirms your device is communicating via P2P (Bluetooth/Wi-Fi Direct simulation).

### 2. Triggering an Emergency
1. **Select Type:** Choose the nature of your emergency (🔥 Fire, 🚧 Trapped, 🩺 Medical, 🌊 Flood).
2. **Broadcast SOS:** Press and hold the central pulsing button.
3. **Trace Progress:** You will see a "Broadcasting" status as your signal hops through the mesh.

### 3. Delivery Confirmation
Once your signal reaches a First Responder base:
- **Status Update:** Changes to "DELIVERED".
- **Hop Count:** Shows exactly how many device-to-device "hops" were required.
- **Assigned Hospital:** Displays the name and status of the hospital that has received your beacon and is preparing for your arrival.

---

> [!NOTE]
> **Why is it decentralized?**
> In a massive flood or earthquake, cell towers often fail. MeshGuard turns every phone into a "tower," ensuring that even if the internet is gone, your voice can still reach help through the strength of the community network.
