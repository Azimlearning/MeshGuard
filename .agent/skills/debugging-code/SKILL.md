---
name: debugging-code
description: Debugs code systematically by finding root causes before applying fixes. Use when resolving errors, test failures, or unexpected behavior.
---

# Systematic Debugging

## When to use this skill
- You encounter an error, stack trace, or test failure.
- The user asks you to "fix a bug", "debug this", or investigate unexpected behavior.
- Quick fixes or initial attempts to resolve an issue have failed.

## The Iron Law
**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**
Do not propose or implement fixes until you have reproduced the issue and understand exactly why it is failing.

## Workflow

Copy and update this checklist as you debug:

- [ ] 1. **Phase 1: Root Cause Investigation**
  - [ ] Read the error message and stack trace completely.
  - [ ] Identify the exact reproduction steps.
  - [ ] Trace the data flow backward to find the source of the bad state/value.
  - [ ] Check recent changes or environment variables that could have triggered the issue.
- [ ] 2. **Phase 2: Pattern Analysis**
  - [ ] Locate similar working code in the codebase.
  - [ ] Compare the broken code with the working reference.
  - [ ] Identify architectural or logic differences.
- [ ] 3. **Phase 3: Hypothesis and Testing**
  - [ ] Form a single, specific hypothesis ("I think X is the root cause because Y").
  - [ ] Add diagnostic instrumentation (e.g., strategic `console.log` or debug statements) to verify the hypothesis.
  - [ ] Verify the hypothesis before applying any structural fixes.
- [ ] 4. **Phase 4: Implementation**
  - [ ] Implement the minimal fix required to address the root cause.
  - [ ] Verify the fix works and does not break other components.
  - [ ] Provide a root cause explanation and prevention recommendations to the user.

## Instructions

### 1. Evidence Gathering
If the system has multiple components (e.g., Frontend React -> Backend Node -> Mesh Network), you must isolate the failing layer first:
- Add logging at the boundaries (inputs and outputs) of each component.
- Confirm which layer is receiving bad data vs which layer is generating the error.

### 2. Strategic Logging
Do not guess the state of variables. When in doubt, inject logging to capture the exact state at runtime.
```javascript
// Example of strategic logging for data flow:
console.log('DEBUG [Component Name]:', {
  inputData: data,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});
```

### 3. Loop Breaker
If you have attempted to fix the issue **3 times without success**:
- **STOP.**
- Do not attempt a 4th fix.
- You are likely dealing with an architectural problem or an incorrect assumption.
- Reflect on the pattern, reset your state, and discuss a fundamental refactor or alternative approach with the user.

### 4. Output Format
For every bug resolved, present the following summary:
- **Root Cause**: Explanation of what went wrong based on evidence.
- **Fix Applied**: The specific logic that was changed.
- **Verification**: How the fix was tested to guarantee it works.
- **Prevention**: A quick tip on how to avoid this bug in the future.
