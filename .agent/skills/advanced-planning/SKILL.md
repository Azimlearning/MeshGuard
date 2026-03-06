---
name: advanced-planning
description: Use when you have an approved design or requirements for a task, but before touching the actual code. Writes bite-sized TDD plans.
---

# Advanced Planning

## When to use this skill
- A design has just been approved via the brainstorming skill.
- The user says "write an implementation plan" or "plan it out".

## Overview
Write comprehensive implementation plans assuming the system needs maximum determinism. Document exactly which files to touch, what code goes where, and how to test it. Break everything into bite-sized, 2-5 minute tasks. Emphasize DRY, YAGNI, and Test-Driven Development (TDD).

**Announce at start:** "I'm using the advanced-planning skill to logically structure the implementation."

**Save plans to:** `plan.md` (or `docs/plans/YYYY-MM-DD-<feature>.md` if applicable)

## Bite-Sized Granularity

Each step should be *one specific action*:
- "Write the failing test"
- "Run it to make sure it fails"
- "Implement minimal code to make it pass"
- "Run tests again"
- "Commit"

<HARD-GATE>
Do NOT start executing the code changes yourself while writing the plan. First output the plan document and ask the user to approve it.
</HARD-GATE>

## Plan Document Header

Every generated plan MUST start with this structure:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this achieves]
**Architecture / Approach:** [Brief summary]
**Tech Stack / Tools:** [Key technologies]

---
```

## Task Template

For each task in the plan, use the following exact structure:

````markdown
### Task [N]: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py`

**Step 1: Write the test (or data handshake)**
Provide the exact code/schema to verify.

**Step 2: Verify it fails (or connect)**
Run command: `npm test` or `python test.py`

**Step 3: Write minimal implementation**
Provide the specific snippet needed to succeed.

**Step 4: Verify it passes**
Run command again and confirm success.

**Step 5: Record & Commit**
Update `progress.md` and run `git commit`.
````

## Transition to Execution
Once the plan is outputted to `plan.md` and the user approves it, instruct the user next to trigger the plan execution (e.g., using `executing-plans` or your standard process).
