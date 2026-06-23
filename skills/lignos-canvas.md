# `/lignos-canvas` — Intent Canvas

Defines the business intent behind an agent before any code is written. Runs an interactive 5-question session and writes `.lignos/canvas.md` — the standard everything else is measured against.

## Usage

```
/lignos-canvas
/lignos-canvas [agent-name]
```

Pass an agent name as an argument to skip the first question.

## Install

**Claude Code** — install as a global slash command:

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md \
  -o ~/.claude/commands/lignos-canvas.md
```

Restart Claude Code, then type `/lignos-canvas`.

**Cursor / Codex** — open [`lignos-canvas.md`](https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md) and paste the contents into your agent's composer or system prompt.

## Prerequisites

No other Lignos files need to exist. This is always the first step.

## What it does

Asks four questions, one at a time, and refuses to accept vague answers. Each question extracts specific subfields:

| Question | Subfields extracted |
|----------|-------------------|
| JTBD | Situation (when/what), User (who), Outcome (the after state) |
| Product Standard | Summary, Tone, Format, Constraints (as bullet rules) |
| Anti-Pattern | Description (the drift pattern), Signals (3–6 short phrases as bullets) |
| Value Proxy | Observable Success (the behavior change), Judge Question (the one-sentence reviewer test) |

After all four answers, it synthesizes a one-sentence standard for your confirmation:

> *"This agent is hired to [JTBD outcome] — and must always [standard]."*

You confirm or adjust before anything is written.

## Output

Creates `.lignos/canvas.md` with labeled subfields the parser and eval engine read directly:

```markdown
# Agent Intent Canvas

**Agent:** [name]
**Created:** YYYY-MM-DD

## Job to Be Done (JTBD)
[One sentence: the specific situation and outcome]

**User:** [role and context]
**Outcome:** [what they need to be able to do after]

## Product Standard
[One sentence: what great looks and feels like]

**Tone:** [voice and register]
**Format:** [structure and length]

- [constraint — what the agent never or always does]
- [constraint]

## Anti-Pattern (Taste Drift)
[One sentence: the specific drift pattern]

- [signal phrase]
- [signal phrase]
- [signal phrase]

## Value Proxy
**Observable Success:** [what you see or don't see when it worked]
**Judge Question:** [the one-sentence test a reviewer would apply]

## One-Sentence Standard
> [This agent is hired to ... — and must always ...]
```

If `.lignos/canvas.md` already exists, the skill shows what would change and asks for confirmation before overwriting.

## What not to provide

- KPI formulas for the value proxy ("CSAT increases by 5%") — the skill will probe until you give an observable behavior
- Technical descriptions for the JTBD ("it calls the tickets API") — it wants the human job, not the implementation
- Implementation details anywhere in the canvas — this document is about business intent

## Next step

```
/lignos-govern
```

Reads the canvas and generates the Agent Constitution and LignosManifest.

**When `.lignos/` is complete:** Import into [Lignos Studio](http://127.0.0.1:4000?standard=ready&from=labs) — upload `canvas.md` (+ `manifest.yaml` after govern). Studio pins your standard and measures drift against the same anti-pattern you defined here.
