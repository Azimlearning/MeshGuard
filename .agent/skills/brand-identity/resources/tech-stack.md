# Preferred Tech Stack & Implementation Rules

Ensure a "Wow Factor" by adhering to these technical standards.

## Core Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS (Mandatory)
* **Components:** shadcn/ui (Modified for custom branding)
* **Animations:** Framer Motion (for smooth micro-interactions)
* **Data Viz:** Recharts (Interactive) or D3.js (Geospatial)

## Implementation Guidelines

### 1. Premium Visual Identity (Anti-AI Patterns)
* **No Generic Gradients:** Avoid simple linear-to-white gradients. Use subtle background meshes or noise textures.
* **Soft Shadows:** Avoid heavy black shadows. Use multi-layered soft shadows from `design-tokens.json`.
* **Glassmorphism:** Use `backdrop-blur` for overlays and navigational components in dark mode.

### 2. Micro-interactions (Framer Motion)
* **Page Transitions:** Apply subtle opacity and translateY entrance for dashboard sections.
* **Hover States:** Use `scale: 1.02` and smooth color transitions (duration: 300ms).
* **Charts:** Animate chart drawing on scroll/load.

### 3. Forbidden Patterns
* Do NOT use default system fonts (use Inter/Roboto).
* Do NOT use pure black (`#000000`) for backgrounds; use our `dark` background token.
* Do NOT use default Tailwind colors for primary actions; strictly use SDG/UKM tokens.
