# Lignos Skills — Overview

Four skills that take an agent from idea to governed production — no server required for any of them.

## The workflow

```
/lignos-canvas  →  /lignos-eval  →  paste into Braintrust / LangSmith   ← fast path
       ↓
/lignos-govern  →  /lignos-score  →  ship
       ↓                  ↓
constitution.md       pass/fail
manifest.yaml
CLAUDE.md
```

| Step | Skill | Time | Output |
|------|-------|------|--------|
| 1 | [`/lignos-canvas`](./lignos-canvas.md) | 5–10 min | `.lignos/canvas.md` — your Product Standard |
| 2 | [`/lignos-eval`](./lignos-eval.md) | ~2 min | Judge prompt + scenario seeds + blocking assertion in chat |
| 3 | [`/lignos-govern`](./lignos-govern.md) | ~2 min | `constitution.md`, `manifest.yaml`, `CLAUDE.md` |
| 4 | [`/lignos-score`](./lignos-score.md) | ~3 min | Pre-ship pass/fail across 5 dimensions |

[`/lignos-scope`](./lignos-scope.md) is available separately — generates instrumentation code to prepare for Lignos Studio (coming soon).

## Install the skills

Skills are slash commands for Claude Code, or prompt templates you paste into Cursor / Codex.

### Claude Code (slash commands)

Install the four core skills globally — available in any project:

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md   -o ~/.claude/commands/lignos-canvas.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-eval.md    -o ~/.claude/commands/lignos-eval.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-govern.md  -o ~/.claude/commands/lignos-govern.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-score.md   -o ~/.claude/commands/lignos-score.md
```

Then restart Claude Code and type `/lignos-canvas` to start.

Or install into a single project only (available when Claude Code is open in that directory):

```bash
mkdir -p .claude/commands
# same curl commands, output to .claude/commands/ instead
```

### Cursor / Codex / other agents

The `docs/skills/` folder has human-readable versions of each skill. Open the relevant `.md` file and paste it into your agent's composer or system prompt. Each skill is self-contained — no special runtime needed.

### Prerequisites

- An AI coding agent: [Claude Code](https://github.com/anthropics/claude-code), Cursor, Codex, or similar

### Production monitoring — Lignos Studio (coming soon)

After your evals are running, Lignos Studio will let you import `.lignos/canvas.md` and watch the same anti-pattern in live production traces — the drift signals you defined in the canvas become your production alerts.

Sign up at [lignos-ai.github.io/lignos-platform](https://lignos-ai.github.io/lignos-platform/) to be notified at launch.

## When to run each skill

**Canvas** — before writing any code. Replaces "what are the requirements?" with "what is the exact standard this agent must maintain?" Outputs the eval block automatically at the end.

**Eval** — any time after canvas. Regenerates the judge prompt, scenario seeds, and blocking assertion from `.lignos/canvas.md`. Paste into Braintrust or LangSmith in under two minutes.

**Govern** — when you're ready to build. Produces the system prompt you paste into your agent, the governance contract for Studio, and a `CLAUDE.md` block so every future session knows the standard.

**Score** — before shipping. Evaluates your system prompt and implementation against the canvas standard across 5 dimensions. Blocks shipping when the anti-pattern guard is missing.

**Scope** *(optional — Studio prep)* — generates `intent_scope` and `milestone` instrumentation code for when Lignos Studio launches. Not needed to run the other four skills.

## Artifacts produced

All generated files live under `.lignos/` at the project root:

| File | Produced by | Purpose |
|------|-------------|---------|
| `.lignos/canvas.md` | `/lignos-canvas` | The authoritative intent definition — JTBD, standard, anti-pattern, value proxy |
| `.lignos/constitution.md` | `/lignos-govern` | Agent Constitution + ready-to-paste system prompt |
| `.lignos/manifest.yaml` | `/lignos-govern` | LignosManifest — Lignos Studio (coming soon) will verify every session against this |
