---
name: executing-plan
description: Translates an approved plan.md into executable code following a strict TDD (Test-Driven Development) and Self-Annealing approach. Use this when the user asks to start building, execute the plan, or continue with the next task.
---

# Plan Execution (B.L.A.S.T Layer 3 & TDD Engine)

## When to use this skill
- The user asks you to "execute the plan", "start building", "implement task X", or "continue with the plan".
- `plan.md` has been approved, and the project is ready for code generation.

## Workflow
- [ ] 1. **Context Synchronization**
    - Read `plan.md` to identify the next unfinished Task.
    - Read `progress.md` (if it exists) to understand what has already been completed.
    - Read `ai_rules.md` and `architecture.md` to ensure constraints and standards are strictly followed.
- [ ] 2. **Execute TDD Cycle (For the current Task)**
    - **Step 1: Write the test (or data handshake)**: Define the expected input/output or write the actual test file.
    - **Step 2: Verify it fails (or connect)**: Run the environment/test to prove the feature does not exist yet.
    - **Step 3: Write minimal implementation**: Write only the necessary deterministic code inside the `tools/`, `src/`, or specified project folders to satisfy the test. Use `.tmp/` for intermediate data parsing if needed.
    - **Step 4: Verify it passes**: Run the code or command to prove the feature now works as expected.
    - **Step 5: Record & Commit**: 
        - Update `progress.md` with what was done, any errors encountered, and the results.
        - Run `git add` and `git commit` with a clear, descriptive message (e.g., `git commit -m "Implement Task 1: Initialize server"`).
- [ ] 3. **Self-Annealing (Error Recovery Loop)**
    - *If Step 2 or Step 4 throws an unexpected error*:
        - **Analyze**: Read the stack trace. Do not guess.
        - **Patch**: Fix the code.
        - **Test**: Run the test again.
        - **Update Architecture**: If a new technical constraint is discovered (e.g., specific API header required), document it in `architecture.md` or a relevant SOP inside `architecture/`. Document the bug in `findings.md`.
- [ ] 4. **User Checkpoint**
    - Present the completed Task to the user.
    - Ask for validation before proceeding to the next Task in `plan.md`.

## Instructions

### Operating Principles
- **No Skipping**: You must complete all 5 steps of the TDD cycle for every task. Do not jump straight to the full implementation without verifying failure first.
- **Deterministic Logic**: Do not guess business logic or make assumptions about data formats. If the JSON shape defined in `gemini.md` or `prd.md` is unclear, halt and ask the user.
- **Layer Separation**: Keep UI styling (Phase S - Stylize) distinct from business logic (Phase A - Engine). Ensure logic is testable before making it "pretty".
- **Documentation is Law**: `ai_rules.md` and `architecture.md` dictate how you build. If you find a conflict between your planned code and the architecture, highlight the conflict to the user instead of ignoring it.

### File Locations
- **Plans & Logs**: `plan.md`, `progress.md`, `findings.md`
- **Logic**: `tools/`, `src/`, `server.js` (As defined heavily in `plan.md`)
- **Intermediates**: `.tmp/`

### Output Format
When running this skill, clearly output to the user which Task and Step you are currently on.
Example:
> **Executing Task 2, Step 3**: Writing minimal implementation for Socket.io handshake...
