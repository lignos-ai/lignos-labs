# Lignos Skills — Overview

Four Claude Code skills that walk an agent from idea to governed production. They run in sequence — each skill picks up where the previous one left off.

## The workflow

```
/lignos-canvas  →  /lignos-eval  →  paste into Braintrust / LangSmith   ← fast path
       ↓
/lignos-govern  →  /lignos-scope  →  /lignos-score  →  Studio            ← full path
       ↓                  ↓                ↓
constitution.md      code snippet       pass/fail
manifest.yaml
```

| Step | Skill | Time | Output | Server? |
|------|-------|------|--------|---------|
| 1 | [`/lignos-canvas`](./lignos-canvas.md) | 5–10 min | `.lignos/canvas.md` | No |
| 2 | [`/lignos-eval`](./lignos-eval.md) | ~2 min | Judge prompt + scenario seeds + blocking assertion in chat | No |
| 3 | [`/lignos-govern`](./lignos-govern.md) | ~2 min | `.lignos/constitution.md`, `.lignos/manifest.yaml` | No |
| 4 | [`/lignos-scope`](./lignos-scope.md) | ~1 min | Copy-paste instrumentation snippet | No |
| 5 | [`/lignos-score`](./lignos-score.md) | ~3 min | Pre-ship evaluation report | No |

## Install the skills

Skills are slash commands for Claude Code, or prompt templates you paste into Cursor / Codex.

### Claude Code (slash commands)

Install all five skills globally — available in any project:

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md   -o ~/.claude/commands/lignos-canvas.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-eval.md    -o ~/.claude/commands/lignos-eval.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-govern.md  -o ~/.claude/commands/lignos-govern.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-scope.md   -o ~/.claude/commands/lignos-scope.md
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

**Canvas** — before writing any code. The canvas replaces the question "what are the requirements?" with "what is the exact standard this agent must maintain?"

**Eval** — right after canvas. Produces a judge prompt, scenario seeds, and a blocking assertion directly in the chat — no server. Paste into Braintrust or LangSmith in under two minutes.

**Govern** — when you're ready to build. Produces the system prompt you paste into the agent and the contract Studio verifies against.

**Scope** — when the agent code exists and you are ready to instrument it. Produces a ready-to-paste code block with `intent_scope` and `milestone` calls.

**Score** — before shipping. Evaluates the actual implementation against the canvas standard across 5 dimensions and blocks you from shipping with a missing anti-pattern guard.

## Artifacts produced

All generated files live under `.lignos/` at the project root:

| File | Produced by | Purpose |
|------|-------------|---------|
| `.lignos/canvas.md` | `/lignos-canvas` | The authoritative intent definition — JTBD, standard, anti-pattern, value proxy |
| `.lignos/constitution.md` | `/lignos-govern` | Agent Constitution + ready-to-paste system prompt |
| `.lignos/manifest.yaml` | `/lignos-govern` | LignosManifest — Studio verifies every session against this |
