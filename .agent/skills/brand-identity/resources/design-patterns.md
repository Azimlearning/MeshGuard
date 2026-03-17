# Resilience Radar: Standard UI Patterns

Consistent dashboard patterns for data storytelling.

## 1. The "Resilience Card" (KPI)
* **Structure:** Label, Big Value, Trend Indicator (+/-), Sparkline.
* **Styling:** Soft shadow, border matching the relevant SDG color (SDG 3 Green or SDG 8 Red).
* **Interactive:** Hover reveals tooltips with data sources.

## 2. Geospatial Correlation Map
* **Layout:** Map on the left, "Intervention Gap" sidebar on the right.
* **Mechanism:** Clicking a state on the map filters all charts on the page.
* **Visualization:** Chloropleth using official district boundaries.

## 3. Policy Simulator View
* **Layout:** Draggable "Resource" pins that users can place on a map.
* **Feedback:** Dynamic "Real-time impact" charts that update as pins are placed (using the machine learning backend).

## 4. Header & Navigation
* **Rules:** Sticky header, glassmorphism background, UKM and SDG logos on the left, "Live Indicator" (blinking green dot) for real-time datasets.
