---
name: creating-skills
description: Generates high-quality, predictable, and efficient skills. Use when the user asks to create a skill, build a new skill, generate a skill creator, or structure a new agent capability.
---

# Gemini Skill Creator

## When to use this skill
- The user requests to create a new skill or capability for the agent.
- You need to generate a predictable `.agent/skills/` folder structure following Antigravity agent guidelines.

## Workflow
- [ ] **1. Gather Requirements**: Identify the goal, logic, and triggers for the new skill. Ensure the skill is aware of mandatory project documents (`prd.md`, `architecture.md`, `ai_rules.md`, `file_structure.md`).
- [ ] **2. Optional — Referencing external repos/skills**: If the user asks to reference repositories, find patterns/examples for the new skill, or set up an MCP, use this escalation order. *(Note: All templates and repos in the reference library are universally useful. Claude skills, Gemini skills, and external repos can all be used as references for any agent or for setting up MCPs.)*
    - **Step A — Check local summaries first** (fast, offline):
      `.ref/github-repos/` — summary READMEs of top repos (superpowers, everything-claude-code, antigravity-awesome-skills, gstack, etc.)
      `.ref/community-skills/` — 12 pre-downloaded community skills with full SKILL.md files
      `.ref/notion-skills/` — manually curated skills
    - **Step B — Query NotebookLM MCP** (if you need richer content or to search across all repos):
      Use `mcp_notebooklm_notebook_query` on notebook ID `086a9fee-b7d8-429d-9f5d-460485e8478a` (Master-Project-Github-Repo-Refrences). This notebook has indexed content from all 14 primary repos.
      ```
      Example: mcp_notebooklm_notebook_query(notebook_id="086a9fee-b7d8-429d-9f5d-460485e8478a", query="how do I structure a security skill?")
      ```
    - **Step C — Fetch live from GitHub** (if you need a specific file from a repo not yet indexed):
      Use `read_url_content` on raw GitHub URLs, e.g.:
      `https://raw.githubusercontent.com/obra/superpowers/main/skills/<skill-name>/SKILL.md`
      Or use `ghgrab` CLI to download specific folders: `npx ghgrab <owner>/<repo>/<path>`
    *(If the user does not request referencing these, skip this step and proceed normally).*
- [ ] **3. Define Naming**: Choose a valid gerund name (`<skill-name>`). It must use lowercase, numbers, and hyphens only.
- [ ] **4. Write the Frontmatter**: Draft YAML with the gerund `name` and a `description` strictly in the third person containing usage triggers.
- [ ] **5. Build the Content**: Follow the "Claude Way" formatting instructions (conciseness, progressive disclosure).
- [ ] **6. Create Files**: Use your file editing tools to create `.agent/skills/<skill-name>/SKILL.md`.
- [ ] **7. Add Auxiliaries**: If needed, create `.agent/skills/<skill-name>/scripts/` or `examples/`.

## Instructions

### Rule 1: Structure and Naming
You must follow this folder hierarchy exactly:
- `.<agent_dir>/skills/<skill-name>/`
  - `SKILL.md` (Required: Main instructions)
  - `scripts/` (Optional: Helper scripts)
  - `examples/` (Optional: Reference files)

**Frontmatter Rules:**
- **name**: Must be a gerund form (e.g., `testing-code`, `managing-databases`). Max 64 characters, numbers, and hyphens.
- **description**: Must be in the **third person**, max 1024 characters, including specific triggers. (e.g., *"Extracts text from PDFs. Use when the user mentions document processing."*)

### Rule 2: Writing Principles (The "Claude Way")
- **Conciseness**: Assume the agent is smart. Focus only on the unique execution logic of the skill.
- **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. Move highly complex secondary logic down to separate files like `[See ADVANCED.md](ADVANCED.md)`.
- **Operating Standards**: Always use forward slashes `/` for paths, never backslashes `\`, even on Windows if possible.
- **Degrees of Freedom Formatting**:
  - Use **Bullet Points** for high-freedom heuristical instructions.
  - Use **Code Blocks** for medium-freedom workflow templates or boilerplate.
  - Use **Specific CLI/Bash Commands** for low-freedom fragile execution environments.

### Rule 3: Workflow Robustness
If the skill handles a complex or multi-step task, you must include:
1. **Checklists**: A simple copy-pasteable markdown list for tracking execution state.
2. **Validation Loops**: Tell the agent to validate state before committing changes.
3. **Error Handling**: Tell the agent exactly what diagnostic commands to run if standard assumptions fail.

### Rule 4: Skill Compatibility and Non-Overlap
When creating a new skill, ensure it does not overlap, conflict with, or disturb existing skills in the project. The new skill must correlate logically and function harmoniously with other skills. Explicitly define its boundaries so the agent knows exactly when to use it versus another skill.

### Rule 5: Output Pattern
When generating the skill for the user, use this structure for the `SKILL.md` payload:

```markdown
---
name: [gerund-name]
description: [3rd-person description]
---

# [Skill Title]

## When to use this skill
- [Trigger 1]
- [Trigger 2]

## Workflow
[Insert markdown checklist or step-by-step validation loop here]

## Instructions
[Specific logic conforming to formatting guidelines]

## Resources
[Any supporting script links or command references]
```
