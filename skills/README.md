# Lignos Skills — Overview

Four Claude Code skills that walk an agent from idea to governed production. They run in sequence — each skill picks up where the previous one left off.

## The workflow

```
/lignos-canvas   →   /lignos-govern   →   /lignos-scope   →   /lignos-score
     ↓                     ↓                    ↓                    ↓
canvas.md          constitution.md         code snippet          pass/fail
                   manifest.yaml
```

| Step | Skill | Time | Output |
|------|-------|------|--------|
| 1 | [`/lignos-canvas`](./lignos-canvas.md) | 5–10 min | `.lignos/canvas.md` |
| 2 | [`/lignos-govern`](./lignos-govern.md) | ~2 min | `.lignos/constitution.md`, `.lignos/manifest.yaml` |
| 3 | [`/lignos-scope`](./lignos-scope.md) | ~1 min | Copy-paste instrumentation snippet |
| 4 | [`/lignos-score`](./lignos-score.md) | ~3 min | Pre-ship evaluation report |

## Install the skills

Skills are slash commands for Claude Code, or prompt templates you paste into Cursor / Codex.

### Claude Code (slash commands)

Install all four skills globally — available in any project:

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md   -o ~/.claude/commands/lignos-canvas.md
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
- Lignos Studio (optional for canvas/govern; required for drift monitoring and eval export UI): `npm run studio` from `mcp-server/`

### After govern — open Studio

When `.lignos/` is complete, import into Studio to verify production alignment:

1. Run `npm run studio` from `mcp-server/`
2. Open **http://127.0.0.1:4000?standard=ready&from=labs** (or Agent Impact → import)
3. Upload `canvas.md` (+ `manifest.yaml` and `constitution.md` if you ran govern)
4. **Connect** — pick the path that matches your situation (any one completes the step):
   - **Path A — Eval export:** Export judge + seeds to Braintrust/LangSmith (Hook #2; no OTLP required)
   - **Path B — Prod traces:** Link your LangSmith project via `POST /api/intent/link-traces` — drift scored against your imported standard
   - **Path C — Local audit:** Point OTEL at `http://localhost:4318` when running agents on this machine

The handoff URL keeps your place in the journey — Studio highlights import and pins your one-sentence standard after upload.

## When to run each skill

**Canvas** — before writing any code. The canvas replaces the question "what are the requirements?" with "what is the exact standard this agent must maintain?"

**Govern** — immediately after the canvas. Produces the system prompt you paste into the agent and the contract Studio verifies against.

**Scope** — when the agent code exists and you are ready to instrument it. Produces a ready-to-paste code block with `intent_scope` and `milestone` calls.

**Score** — before shipping. Evaluates the actual implementation against the canvas standard across 5 dimensions and blocks you from shipping with a missing anti-pattern guard.

## Artifacts produced

All generated files live under `.lignos/` at the project root:

| File | Produced by | Purpose |
|------|-------------|---------|
| `.lignos/canvas.md` | `/lignos-canvas` | The authoritative intent definition — JTBD, standard, anti-pattern, value proxy |
| `.lignos/constitution.md` | `/lignos-govern` | Agent Constitution + ready-to-paste system prompt |
| `.lignos/manifest.yaml` | `/lignos-govern` | LignosManifest — Studio verifies every session against this |
