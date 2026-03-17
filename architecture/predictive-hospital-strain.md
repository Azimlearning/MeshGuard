# Design: Predictive Hospital Strain & Intelligent Routing (Option 1)

## 1. Context & Purpose
**SDG Alignment:** SDG 3 (Good Health and Well-being)
**Goal:** Enhance the MeshGuard MVP with a predictive model that uses real Malaysian public data (OpenDOSM/KKMNow) to forecast hospital strain during an emergency, and automatically redirect distress routing if a facility becomes overwhelmed. 

## 2. Data Sourcing
We will simulate a backend database using real OpenDOSM/KKMNow numbers for 4-5 major hospitals in Kuala Lumpur.
- **Data Shape (per facility):**
  - Name (e.g., Hospital Kuala Lumpur)
  - Coordinates (Lat/Lng)
  - `base_capacity` (e.g., number of emergency beds typically available based on DOSM stats).

## 3. The Predictive Model (Backend)
The model will execute every time a `trigger_sos` event hits the server.
- **Current Load Calculation:** For each hospital, we track `current_active_sos` assigned to them.
- **Strain Index:** `strain_ratio = current_active_sos / base_capacity`
  - *Green (Normal):* 0.0 – 0.6
  - *Yellow (Warning):* 0.6 – 0.9
  - *Red (Critical):* > 0.9
- **Predictive Metric (Time-to-Critical):** Based on the SOS velocity (e.g., 5 requests per minute), predict how many minutes until `strain_ratio` hits 1.0.

## 4. Intelligent Routing Update
Currently, `swarmEngine.js` hardcodes routing to a single `base_0` (First Responder HQ).
- **Change:** We replace the single base with the 4-5 Hospital Nodes.
- **Logic:**
  1. Find the nearest hospital to the SOS origin.
  2. If that hospital's `strain_ratio` is < 0.9, route to it.
  3. If ≥ 0.9 (Critical), calculate the next nearest hospital that is not Critical and dynamically reroute the mesh path to that facility instead.
  
## 5. UI / Dashboard Updates (`/dashboard`)
To maximize the "Wow Factor" (25% judging weight):
- **Map Icons:** Hospitals get special distinct markers (e.g., a medical cross).
- **Color Coding:** Hospital icons pulsate their strain color (Green/Yellow/Red).
- **Analytics Sidebar (New Component):** A sleek, dark-themed panel on the left/right showing a live leaderboard of hospitals, their strain bars filling up in real-time as SOS signals come in, and the predictive "Time-to-Critical" countdown.

## 6. Mobile App Updates (`/mobile`)
- Add a tiny "Assigned Facility" line below the DELIVERED status, so the user knows where help is coming from.
  
## 7. Implementation Steps (For `executing-plans`)
1. Create `src/data/hospitals.json` with real KL DOSM data.
2. Update `server.js` to initialize and expose the hospital list.
3. Build `src/strainModel.js` to calculate live strain ratios and predict exhaustion times.
4. Modify `src/swarmEngine.js` routing to pick the nearest *available* hospital instead of one fixed base.
5. Create `<HospitalSidebar />` component in React.
6. Update the Leaflet map to plot hospital nodes with dynamic color states.
