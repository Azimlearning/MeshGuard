## 📋 Pre-Recording Setup
1. **The Infrastructure:** Run both the backend and frontend in separate terminals:
   - **Terminal 1 (Backend):** `npm run app` (from the root folder)
   - **Terminal 2 (Frontend):** `npm run dev:frontend` (from the root folder)
2. **Device Prep:**
   - **Main Screen (Laptop):** Open `http://localhost:5173/dashboard`.
   - **Secondary Screen (Phone):** Open `http://YOUR_LOCAL_IP:5173/mobile` (Get your IP using `ipconfig` on Windows).
3. **Recording Software:** Use OBS or a similar tool for screen recording. Consider a split-screen or an overlay showing the phone screen alongside the dashboard.

---

## 🎥 Key Demo Sequences

### Sequence 1: "When the Towers Fall" (The Ping Trace)
- **Action:** Open the dashboard. It will be dark and static.
- **Action:** From the mobile app, select an emergency type (e.g., "Fire") and hit the **SOS** button.
- **On Screen:** Watch the cyan line "hop" from node to node across Kuala Lumpur.
- **Voiceover/Text:** *"Even without cellular towers, your signal find a path. Watch as the SOS message hops across the mesh network of nearby devices until it reaches the nearest hospital."*

### Sequence 2: "The Power of Many" (Multiple Devices)
- **Action:** Open the `/mobile` route on multiple browser tabs or actual phones.
- **Action:** Trigger SOS from different "locations" (simulated or real).
- **On Screen:** The dashboard will show multiple traces converging from different directions.
- **Insight:** This demonstrates that every device in the city is a potential relay point, creating a dense, resilient network.

### Sequence 3: "Hospital Strain & Intelligent Routing" (The Data Edge)
- **Action:** Trigger the SOS repeatedly 5–10 times in quick succession.
- **On Screen:** On the left sidebar of the dashboard, watch the "Hospital Strain" bars fill up.
- **The "Wow" Moment:** When a hospital hit its **Critical (Red)** state, watch the next SOS trace **automatically reroute** to the next nearest hospital that is still **Safe (Green)**.
- **Voiceover/Text:** *"MeshGuard doesn't just send a signal; it thinks. Using real DOSM data and our predictive strain model, it automatically diverts traffic away from overwhelmed hospitals, preventing triage bottlenecks in real-time."*

---

## ❓ Technical Clarifications for Judges

### 1. Scaling to "Real Life"
**Current State:** MVP/Prototype.
- **Why?** The network is currently simulated using Socket.io (central server).
- **Scale-Up:** In a real-world scenario, we would replace the centralized backend with true **Bluetooth Low Energy (BLE)** and **Wi-Fi Direct (P2P)** protocols. This allows devices to communicate even when the ISP and cellular networks are completely offline.

### 2. Demonstrating Device Discovery (Pinging)
The **Matrix Sync** and **Mesh Trace** animations are your primary visual tools. On the dashboard, every virtual node represents a resident's device. The "ping" is the hop-by-hop line drawing that mimics real-world packet forwarding. 

### 3. Multiple Device SOS
The `/mobile` page is designed as a standalone **Progressive Web App (PWA)**. To show this in the video, record yourself tapping the SOS button on two different physical phones (on the same Wi-Fi) and see the dashboard reflect both incoming signals simultaneously.

---

> [!TIP]
> **Pro-Tip:** For the best visual impact, use a screen recording of the dashboard while holding a physical phone in the foreground of the video. It makes the real-time synchronization feel tangible.
