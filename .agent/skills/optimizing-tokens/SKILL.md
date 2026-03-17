---
name: optimizing-tokens
description: Enhances token efficiency and reduces API costs during agentic sessions. Use when the user wants to reduce spend, optimize their context window, compact memory, route models efficiently, or prevent context rot.
---

# Token Optimization & Cost Reduction

## When to use this skill
- The user expresses concern about API costs or token limits.
- The context window is nearing capacity (>80% full) running the risk of context rot.
- The user wants to set up cost-saving measures for a new or existing project.
- You need to perform a "strategic compaction" or memory reset.

## Workflow

- [ ] **1. Analyze Current State**: Check current model, active MCP servers, and context size.
- [ ] **2. Model Routing**: Determine if the current task actually requires an expensive model (e.g., Opus) or if a cheaper model (e.g., Sonnet/Haiku) will suffice.
- [ ] **3. Tool Management**: Disable unnecessary MCP servers and tools to reclaim context space.
- [ ] **4. Strategic Compaction**: If context is bloated, summarize progress and perform a soft reset.
- [ ] **5. Implementation**: Apply "Progressive Disclosure" when searching or reading large files.

## Instructions

### 1. Smart Model Routing
- **Default to Smaller Models**: Switch to smaller, more efficient models (like Sonnet or Haiku) for everyday tasks (fixes, boilerplate, simple UI changes). This alone can save ~60% in costs.
- **Reserve Heavy Models**: Only escalate to computationally expensive models (like Opus) for complex architectural planning, deep reasoning, or severe debugging.
- **Agent Teams vs. Subagents**: For simple or sequential tasks, use a single subagent. Avoid spawning massive agent teams unless parallel execution of distinct, complex domains is strictly required.

### 2. Context Window & Tool Management
Every active tool and description consumes tokens continuously.
- **Limit Active MCPs**: Keep fewer than 10 MCP servers and 80 total tools active per project. Disable any that are not immediately relevant using the appropriate environment or config commands.
- **Cap Thinking Tokens**: If the harness allows it, reduce `MAX_THINKING_TOKENS` (e.g., from 31,999 to 10,000) to drastically cut hidden reasoning costs when deep thought isn't needed.

### 3. Strategic Context Compaction
- **Do NOT Auto-Compact Mid-Task**: Never compact context in the middle of a complex implementation step; you will lose file paths and variable names.
- **Compact at Breakpoints**: Wait until a logical breakpoint (e.g., bug fixed, research finished, PR ready).
- **The Compaction Routine**:
  1. Generate a dense, semantic summary of the current project state, active changes, and next steps.
  2. Save this summary to a temporary file (e.g., `/tmp/context-checkpoint.md`).
  3. Execute a context slash command (like `/clear` or `/compact`) if supported by the harness.
  4. Reload the summary from the temporary file.

### 4. Progressive Disclosure (The 3-Layer Method)
When querying logs, databases, or large codebases, NEVER dump massive files into the context window.
1. **Search & ID**: grep or search to retrieve only file paths, IDs, or timestamps (~50-100 tokens).
2. **Timeline View**: View minimal snippet context around those IDs.
3. **Targeted Fetch**: Fetch the full, detailed file or observation *only* for the specific IDs confirmed necessary (~500-1,000 tokens).
*Note: Filtering results before fetching full details yields ~10x token savings.*
