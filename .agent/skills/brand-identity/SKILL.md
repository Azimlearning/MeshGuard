---
name: brand-identity
description: Provides the single source of truth for Resilience Radar brand guidelines, design tokens, technology choices, and voice/tone. Use this skill whenever generating UI components, styling applications, writing copy, or creating user-facing assets to ensure consistency with UKM Data Challenge 5.0 and SDG 3 & 8 alignment.
---

# Pulse of Malaysia: Brand Identity & Guidelines

**Brand Name:** Pulse of Malaysia

This skill defines the core constraints for visual design and technical implementation for the Pulse of Malaysia project. It ensures adherence to the official UKM Data Challenge 5.0 constraints while maintaining a premium, state-of-the-art aesthetic. Always refer to `file_structure.md` for current project organization.

## Reference Documentation

Do not guess brand elements; always read the corresponding resource files.

### For Visual Design & UI Styling
Use these tokens for colors (SDG 3 Green, SDG 8 Red, UKM Blue), typography (Inter/Roboto), and UI spacing:
👉 **[`resources/design-tokens.json`](resources/design-tokens.json)**

### For Coding & Component Implementation
Mandatory stack: Next.js, Tailwind CSS, shadcn/ui. See implementation rules:
👉 **[`resources/tech-stack.md`](resources/tech-stack.md)**

### For Copywriting & Content Generation
Professional, empathetic, and data-driven persona in English:
👉 **[`resources/voice-tone.md`](resources/voice-tone.md)**

## Workflow Highlights

1. **Check Constraints**: Always verify against `enforcing-project-constraints` for logo and dataset requirements.
2. **Apply Tokens**: Use Tailwind utility classes derived from `design-tokens.json`.
3. **Wow Factor**: Prioritize high usability and visual quality (25% weight in competition).
