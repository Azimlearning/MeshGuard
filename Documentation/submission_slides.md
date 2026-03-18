# MeshGuard — VHACK 2026 Presentation Slides
> **Naming Convention:** `VHACK2026_[TEAM NAME]_MeshGuard`
> **Duration:** 5–10 minutes | **Platform:** YouTube Unlisted / Google Drive

---

## Slide 1: Team Introduction

**Visual:** Title card — "MeshGuard: First Responder of the Future" + Team Photos

**Bullets:**
- **Project:** MeshGuard (Edge-Triage)
- **Event:** V-HACK 2026 Hackathon
- **Team Members:** [Insert Names & Roles]

> 🎙️ *"Hello judges and welcome to our V-HACK 2026 pitch. We are team [Name]. Today, we present MeshGuard — our Edge-Triage platform designed to redefine the 'First Responder of the Future.' Let's dive into the critical problem we're solving."*

---

## Slide 2: Case Study — Why Infrastructure Fails

**Visual:** Images of natural disasters, downed cell towers, disconnected smartphone.

**Bullets:**
- **The Problem:** Centralized infrastructure (cell towers, Wi-Fi) is fragile
- **The Triggers:** Natural disasters, power outages, civil emergencies
- **The Result:** Citizens cannot call for help. First responders are flying blind.

> 🎙️ *"When disasters strike, centralized communication is usually the first thing to fail. Cell towers go down, the internet cuts out — citizens are cut off from emergency services. First responders are left completely blind, delaying life-saving triage. We needed a system that works without the grid."*

---

## Slide 3: The MeshGuard Solution

**Visual:** Diagram of the Decentralized Swarm Intelligence Network — nodes passing a signal.

**Bullets:**
- **Our Motto:** *"When the towers fall, the people become the network"*
- **Concept:** Decentralized swarm intelligence network
- **How it Works:** Citizen smartphones form resilient peer-to-peer mesh
- **Algorithm:** Greedy gossip-forwarding hops from device to device → First Responder HQ

> 🎙️ *"MeshGuard's philosophy: 'When the towers fall, the people become the network.' Instead of towers, citizen smartphones form a peer-to-peer mesh. Using a greedy gossip-forwarding algorithm, an SOS signal hops from device to device until it reaches the First Responder base — no internet required."*

---

## Slide 4: Front-End Demo Walkthrough

**Visual:** Split screen — Responder Mobile App (phone) | Command Dashboard (laptop)

**Bullets:**
- **Setup:** 150 virtual citizen nodes scattered across Kuala Lumpur
- **Mobile App (PWA):** Dark-mode tactical UI — Fire, Medical, Flood, Crime triggers
- **Command Dashboard:** Real-time cartographic hop-by-hop trace visualization + Live Hospital Strain Panel
- **Intelligent Routing:** SOS automatically routed to the nearest *available* hospital
- **The Effect:** Red sonar ring pings → Cyan line bounces → Hospital pin lights up → Delivered! ✅

> 🎙️ *"In the demo: 150 virtual nodes around KL are live. On mobile, tap the emergency type and hit the pulsing SOS button. On the dashboard, watch the signal hop across the city — and notice our 5 hospital nodes on the left panel. Hit SOS multiple times and watch the strain bars fill up. When a hospital goes Critical, the system automatically reroutes the next SOS to the safest facility."*

---

## Slide 5: Predictive Hospital Strain Model (SDG 3 & Data)

**Visual:** Dashboard screenshot showing the HospitalSidebar with color-coded strain bars and hospital markers on the KL map.

**Data Source:** KKMNow / OpenDOSM — Public health facility capacity in Malaysia

**Bullets:**
- **5 Major KL Hospitals** loaded with real DOSM emergency bed capacity data
- **Live Strain Index:** `strain_ratio = active_load / capacity` — Green → Yellow → Red
- **Predictive Metric:** Exponential decay model calculates *Time-to-Critical* (minutes remaining)
- **Intelligent Routing:** When a hospital hits >90% strain, SOS is automatically rerouted to next nearest available facility
- **Real-time Broadcasting:** All clients receive `hospital_strain_update` events via Socket.io

**The Model:**
```
Strain Ratio  = Σ(decay_factor_per_event) / hospital_capacity
Decay Factor  = e^(−ln2 × age_ms / 60000)   [60s half-life]
Time-to-Critical = remaining_capacity / velocity (events/min)
```

> 🎙️ *"This is where MeshGuard goes beyond networking into data science. We integrated real DOSM hospital capacity data for 5 KL facilities. Our strain model uses exponential decay to calculate live hospital load, and predicts in real-time how many minutes until each hospital is overwhelmed. When it hits critical, the swarm routing engine automatically diverts traffic — minimizing triage bottlenecks and saving lives."*

---

## Slide 6: Tech Stack

**Visual:** Logos — Node.js, React, Vite, Socket.io, Leaflet, Tailwind CSS

**Bullets:**
- **Architecture:** Monorepo — Backend + Frontend + WebSocket Layer
- **Backend (Brain):** Node.js + Express — Custom Greedy Swarm Routing + Predictive Strain Engine
- **Frontend (UI):** React 19, Vite, Tailwind CSS — Cyberpunk Dark Mode PWA
- **Real-Time (Brainstem):** Socket.io — Instant bidirectional sync (`mesh_trace` + `hospital_strain_update`)
- **Mapping:** React-Leaflet + CartoDB DarkMatter tiles ($0 budget)
- **Data:** KKMNow / OpenDOSM (Official Malaysian public health data)

> 🎙️ *"The backend runs our custom routing logic and exponential decay strain model on Node.js. Our cyberpunk UI is built on React 19 + Vite. Socket.io is the 'brainstem' tying mobile to dashboard in real-time. All mapping uses free CartoDB tiles — total API budget: $0. All data is sourced from official Malaysian government portals."*

---

## Slide 7: Market Strategy

**Visual:** Three target user cards (Citizen | First Responder | Government) vs centralized alternatives.

**Bullets:**
- **Target Users:** Citizens (Signal Broadcasters) + First Responders (Operators)
- **Competitor:** Centralized telcos — fragile by design
- **Our Edge:** No internet required. Fully decentralized. Disaster-resilient.
- **Business Model (Conceptual):** B2G licensing — Municipal emergency service contracts

**Market Segment:**
| Segment | Why |
|---------|-----|
| Municipal Governments | Disaster preparedness mandates |
| Emergency Services | First responder ops tooling |
| Telecoms (White Label) | Edge-network fallback product |

> 🎙️ *"Our core users are citizens as signal broadcasters and First Responders as operators. Competitors rely on centralized telecom networks — which fail exactly when needed most. Our decentralized edge gives us a moat. Our go-to-market is B2G: licensing this protocol to governments for city-wide resilience."*

---

## Slide 8: The Future

**Visual:** Icons for Bluetooth, GPS satellite, cloud server.

**Bullets:**
- **Real P2P Hardware:** Bluetooth / Wi-Fi Direct for true offline device discovery
- **Live Geolocation:** Real GPS from citizen devices (vs. simulated coordinates)
- **Cloud Deployment:** Scalable infrastructure + persistent SOS event databases
- **Expanded Data Model:** More DOSM datasets — labor disruption, B40 community vulnerability index

> 🎙️ *"Today you saw our fully functional MVP with real predictive hospital routing. Next: replace Socket.io simulation with true Bluetooth/Wi-Fi Direct P2P. Then, real GPS from citizen devices. And finally, cloud deployment with persistent databases for post-disaster analysis. MeshGuard is the infrastructure for the cities of tomorrow.*
>
> *Thank you. When the towers fall — MeshGuard becomes the network."*

---

## 📋 Video Checklist

- [ ] Record Team Introduction (on camera if possible)
- [ ] Record demo: Phone on `/mobile`, Laptop on `/dashboard` — same Wi-Fi network
- [ ] Screen record the node trace animation live
- [ ] Export slides as PDF/PNG and overlay recordings on top
- [ ] Name file: `VHACK2026_[TEAM NAME]_MeshGuard`
- [ ] Upload to YouTube (Unlisted) or Google Drive (Public link)
