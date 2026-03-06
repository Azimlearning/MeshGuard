---
name: creating-skills
description: Creates new skills for the Antigravity agent based on user requirements. Use when the user asks to build, create, or generate a new skill.
---

# Antigravity Skill Creator

## When to use this skill
- The user asks to "make a skill", "create a skill", or "build a skill".
- The user provides logic and wants it formalized into a recurring agent capability.

## Workflow
- [ ] 1. Define the skill's purpose and ensure it can be expressed as a single responsibility.
- [ ] 2. **Optional**: If the user explicitly asks to use reference repositories or to find the best tools/examples, review the following 3 repositories. You can read their contents dynamically (e.g., using `read_url_content`) or clone them to a temporary directory (e.g., `/tmp/`) and delete them immediately after extracting the necessary context. Do NOT keep them in the user's workspace permanently:
    - https://github.com/obra/superpowers/tree/main/skills
    - https://github.com/affaan-m/everything-claude-code
    - https://github.com/sickn33/antigravity-awesome-skills/tree/main
    *(If the user does not request referencing these, skip this step and proceed normally).*
- [ ] 3. Choose a valid gerund name (`name: [gerund-name]`).
- [ ] 4. Write a third-person description with specific triggers.
- [ ] 5. Create the folder `.agent/skills/<skill-name>/`.
- [ ] 6. Write `.agent/skills/<skill-name>/SKILL.md` using the template below.
- [ ] 7. If necessary, create supplementary files (`scripts/`, `examples/`, `resources/`).

## Instructions

When the user asks you to create a skill, use the following rules to implement it:

### 1. Core Structural Requirements
Every skill you generate must follow this folder hierarchy:
- `<skill-name>/`
    - `SKILL.md` (Required: Main logic and instructions)
    - `scripts/` (Optional: Helper scripts)
    - `examples/` (Optional: Reference implementations)
    - `resources/` (Optional: Templates or assets)

### 2. YAML Frontmatter Standards
The `SKILL.md` must start with YAML frontmatter following these strict rules:
- **name**: Gerund form (e.g., `testing-code`, `managing-databases`). Max 64 chars. Lowercase, numbers, and hyphens only. No "claude" or "anthropic" in the name.
- **description**: Written in **third person**. Must include specific triggers/keywords. Max 1024 chars. (e.g., "Extracts text from PDFs. Use when the user mentions document processing or PDF files.")

### 3. Writing Principles
* **Conciseness**: Assume the agent is smart. Do not explain basic concepts. Focus only on the unique logic of the skill.
* **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. If more detail is needed, link to secondary files (e.g., `[See ADVANCED.md](ADVANCED.md)`) only one level deep.
* **Forward Slashes**: Always use `/` for paths, never `\`.
* **Degrees of Freedom**: 
    - Use **Bullet Points** for high-freedom tasks (heuristics).
    - Use **Code Blocks** for medium-freedom (templates).
    - Use **Specific Bash Commands** for low-freedom (fragile operations).

### 4. Workflow & Feedback Loops
For complex tasks, include:
1.  **Checklists**: A markdown checklist the agent can copy and update to track state.
2.  **Validation Loops**: A "Plan-Validate-Execute" pattern (e.g., Run a script to check a config file BEFORE applying changes).
3.  **Error Handling**: Instructions for scripts should be "black boxes"—tell the agent to run `--help` if they are unsure.

### 5. Output Template
When asked to create a skill, output the result in this format or directly create the file using the following `.agent/skills/[skill-name]/SKILL.md` template:

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
[Insert checklist or step-by-step guide here]

## Instructions
[Specific logic, code snippets, or rules]

## Resources
- [Link to scripts/ or resources/]
```
