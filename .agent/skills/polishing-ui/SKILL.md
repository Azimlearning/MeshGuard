---
name: polishing-ui
description: Elevates and refines user interfaces utilizing the official UI/UX Pro Max Design Intelligence principles from GitHub. Use when the user asks to improve the UI, refine the design, or check for UX anti-patterns.
---

# UI/UX Pro Max Polishing Skill

## When to use this skill
- **Review existing UI:** "Review this page for UX issues", "Check accessibility".
- **Fix a UI bug:** "Button hover is broken", "Layout shifts on load".
- **Improve / optimize:** "Make this look better", "Improve mobile experience".
- **Aesthetic Definition:** When establishing brand colors, dark mode, or specific aesthetics (like Cyberpunk).

## Workflow

- [ ] **1. Analyze Requirements**:
    - Identify the target industry or application type.
    - Determine the aesthetic direction (e.g., modern SaaS, Cyberpunk, Neo-brutalism).
- [ ] **2. Master Design System Rules Application**:
    - Select primary, secondary, and accent colors ensuring WCAG contrast ratios (4.5:1 normal, 3:1 large).
    - Establish a strict 4px/8px multiple spacing system.
    - Select typography pairings (e.g., Inter + JetBrains Mono).
- [ ] **3. Apply Quick Reference Guidelines**:
    - **Accessibility (CRITICAL)**: Ensure `color-contrast`, `focus-states` (visible focus rings), and `touch-target-size` (min 44x44pt).
    - **Touch & Interaction (CRITICAL)**: Ensure `hover-vs-tap` clarity, provide `press-feedback` (transform: scale or background shift), and disabled states.
    - **Layout & Responsive (HIGH)**: Check safe areas, horizontal insets/gutters, and 4/8dp rhythm.
- [ ] **4. Pre-Delivery Checklist Verification**:
    - Verify against the complete UI/UX Pro Max checklist below before committing changes.

## Instructions

### Rule 1: Accessibility & Touch Targets (CRITICAL)
- **Contrast**: Minimum 4.5:1 ratio for normal text and 3:1 for large UI glyphs in both light and dark modes.
- **Focus Rings**: Interactive elements must have visible focus rings (2–4px) for keyboard navigation.
- **Touch Targets**: Minimum 44×44pt interactive area for all buttons/links. Extend the hit area beyond visual bounds if the icon itself is smaller.

### Rule 2: Visual Hierarchy & Elements
- **Icons**: No Emojis as structural icons. Use vector-based icons (SVGs).
- **Stroke & Style**: Use consistent stroke widths (e.g., 1.5px or 2px) and don't mix filled/outline icons at the same hierarchy level.

### Rule 3: Dynamic Interaction States
- **Feedback Timing**: Keep micro-interactions around 150-300ms with smooth easing. Never use instant transitions (`transition: all 0.2s ease` is standard).
- **Active State**: Provide clear pressed feedback (e.g., `transform: scale(0.96)`) without shifting surrounding layout bounds or causing visual jitter.
- **Disabled State**: Use reduced emphasis and no tap action. Never leave a disabled control looking tappable.

### Rule 4: Implementation in React/Vite
When polishing React components:
- Modify CSS files (`index.css`), inline styles, or `className` properties.
- Do not modify or break underlying React state (`useState`, `useEffect`) purely for aesthetic changes.

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons come from a consistent icon family and style
- [ ] Pressed-state visuals do not shift layout bounds or cause jitter
- [ ] Semantic theme tokens are used consistently (no hardcoded ad-hoc colors)

### Interaction
- [ ] All tappable elements provide clear pressed feedback (ripple/opacity/elevation/scale)
- [ ] Touch targets meet minimum size (>=44x44pt)
- [ ] Micro-interaction timing stays in the 150-300ms range with smooth easing
- [ ] Disabled states are visually clear and non-interactive

### Layout & Light/Dark Mode
- [ ] Primary text contrast >=4.5:1 in current theme.
- [ ] 4/8dp spacing rhythm is maintained across component, section, and page levels.
- [ ] Verified on small screens (mobile view).
