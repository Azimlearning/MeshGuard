---
name: enforcing-project-constraints
description: Enforces strict adherence to Data Challenge 5.0 (Resilience Radar) rules, SDG alignments, and official data requirements. Use when planning features, designing the dashboard, or creating final deliverables.
---

# Enforcing Project Constraints (DC 5.0)

## When to use this skill
- When proposing new features or architectural changes for the Resilience Radar project.
- When designing the Infographic Poster, Dashboard, or Presentation Slides.
- When validating data sources or model logic.
- When ensuring compliance with the competition's scoring rubric.

## Workflow
- [ ] **1. Verify SDG Alignment**: Ensure the task addresses at least two of the following: SDG 3 (Health), SDG 4 (Education), SDG 8 (Work), or SDG 12 (Consumption). *Current project focus: SDG 3 & 8.*
- [ ] **2. Audit Data Sources**: Confirm all data comes from official Malaysia/ASEAN sources (e.g., OpenDOSM, Data.gov.my, MOH, KKMNow). **Zero tolerance for Kaggle/GitHub datasets.**
- [ ] **3. Check Deliverable Standards**:
  - [ ] **Poster**: A3 Size, PDF format, naming: `GroupName_PosterDC5`.
  - [ ] **Slides**: Max 25 slides, PDF format, naming: `GroupName_SlideDC5`.
  - [ ] **Video**: Max 10 minutes, YouTube unlisted, naming: `GroupName_VideoDC5`.
  - [ ] **Dashboard**: Publicly accessible link (Vercel) OR 3-min screen record, naming: `GroupName_DashboardDC5`.
- [ ] **4. Enforce Branding Rules**:
  - [ ] **Mandatory Logos**: UKM, UKM Watan, Statistics Club, Data Challenge 5.0, and SDG 3 & 8.
  - [ ] **Strictly Prohibited**: Personal university/institution logos.
- [ ] **5. Validate Impact**: Ensure the proposed change adds to the "practical application" and "potential influence" (10% of score).

## Instructions

### Rule 1: Data Sovereignty
Only use secondary datasets from trusted, official sources (Malaysia or ASEAN). If a dataset isn't from a `.gov.my` or equivalent ASEAN official portal, it is invalid. Do NOT use primary data collection.

### Rule 2: Visual Identity & Color Palette
Align the application's design with the chosen SDGs and host institution:
- **SDG 3 (Good Health):** Emerald Green (`#4C9F38`)
- **SDG 8 (Decent Work):** Bordeaux/Dark Red (`#A21942`)
- **UKM Corporate Colors:** Red, Yellow, Blue.
*Ensure high readability and a premium aesthetic for the "Wow Factor" in the dashboard (25% weight).*

### Rule 3: Deliverable Hygiene
- All text and presentation materials must be in **English**.
- All group members must appear and participate in the 10-minute video presentation.
- Final submissions must strictly follow the naming convention: `GroupName_[Deliverable]DC5`.

### Rule 4: Dashboard & Model Interaction
The interactive dashboard must demonstrate dynamic visuals (filters, buttons, drill-downs). The predictive model must be well-justified and clearly explained in the methodology section. If custom apps are used, they MUST be deployed with a public URL (Vercel preferred) or have a 3-minute screen recording.

## Resources
- [Official Website](https://statistikukm.weebly.com/information.html)
- Local Reference: `Rerfrence documents/` directory (Scoring Rubric, FAQS, Guidelines).
- Project Constitution: `ai_rules.md`.
