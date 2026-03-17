---
name: saving-progress
description: EXPLICIT MANUAL TRIGGER ONLY. Automates git add, commit, and push for the MeshGuard repository. ONLY invoke this skill when the user explicitly uses words like "commit", "push", or "save to github". NEVER invoke automatically.
---

# Saving Project Progress

<HARD-GATE>
Do NOT invoke this skill automatically. Do NOT commit or push at the end of a task, after a feature implementation, or as a "cleanup" step.
This skill runs ONLY when the user explicitly says one of:
- "save my progress"
- "commit this"
- "push to GitHub"
- Or a clearly equivalent explicit request.
If the user has not said one of these, do NOT run this skill.
</HARD-GATE>

## When to use this skill
- The user **explicitly** asks to "save progress", "commit changes", or "push to GitHub".
- The user has reviewed the changes themselves and decided they are ready to commit.
- **Never** invoke this automatically at the end of a plan, feature implementation, or verification step.

## Workflow
- [ ] **1. Health Check**: Run `git remote -v`. If it fails with "bad config line 1", notify the user and suggest fixing the `.git/config` or re-initializing the remote.
- [ ] **2. Security Audit**: Run a validation to ensure no API keys (e.g., Google Maps, credentials), sensitive endpoints, or `.env` files are accidentally being committed. Use `git diff` to inspect changes.
- [ ] **3. Stage Changes**: Stage all intended changes using `git add .`.
- [ ] **4. Analyze Progress**: Review staged changes using `git diff --staged` to prepare the commit summary.
- [ ] **5. Structure Commit**: Draft a multi-line commit message following the [coding-standards](https://github.com/affaan-m/everything-claude-code/tree/main/skills/coding-standards) and [obra/superpowers](https://github.com/obra/superpowers) patterns (Summary + Bullet Points).
- [ ] **6. Secure Commit**: Execute `git commit -m "[Update]: <Summary>" -m "<Bullet 1>" -m "<Bullet 2>"`.
- [ ] **7. Push to Remote**: Push to `https://github.com/Azimlearning/MeshGuard` on the `main` branch.

## Instructions

### Rule 1: Security First
- Always double-check modifications in common potential leak points.
- If a hardcoded API key or private secret is detected in the diff, **STOP** and inform the user before committing. Do not push secrets!

### Rule 2: Detailed Commit Messages
- The commit message must clearly state the progress update.
- Provide a summary title followed by bullet points. 
- Example pattern:
  ```text
  [Update]: Implemented AI Assistant Page and Routing

  - Added new Assistant wizard routing in index.html
  - Updated chatbot script to support multi-step tool UI
  - Fixed typo in app-shell styling
  ```

### Rule 3: Git commands & Errors
- Always confirm `git push origin main` works successfully. 
- Target Repository: `https://github.com/Azimlearning/MeshGuard`
- If the remote is not set correctly, suggest: `git remote add origin https://github.com/Azimlearning/MeshGuard`

## Validation Loop
1. Did you check for secrets in the diff before committing?
2. Did you write an accurate and detailed multi-line commit message?
3. Did the push to `main` branch of `MeshGuard` succeed?

## Resources
- Target Repository: `https://github.com/Azimlearning/MeshGuard`
- References: [Superpowers](https://github.com/obra/superpowers), [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)
