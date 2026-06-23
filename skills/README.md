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
| 1 | [`/lignos-canvas`](./lignos-canvas.md) | 10–15 min | `.lignos/canvas.md` + judge prompt + live Taste Test (PASS/FAIL in chat) |
| 2 | [`/lignos-eval`](./lignos-eval.md) | ~2 min | Regenerate judge prompt + scenario seeds + blocking assertion from canvas |
| 3 | [`/lignos-govern`](./lignos-govern.md) | ~2 min | `constitution.md`, `manifest.yaml`, `CLAUDE.md` |
| 4 | [`/lignos-score`](./lignos-score.md) | ~3 min | Pre-ship pass/fail across 5 dimensions |

[`/lignos-scope`](./lignos-scope.md) is available separately — generates instrumentation code to prepare for Lignos Studio (coming soon).

## Which eval tool?

An eval checks whether your agent's outputs match the standard you just defined. Most builders skip this step — and find out something drifted when a user complains. Evals catch that before it ships.

After `/lignos-canvas` you have three artifacts that make your first eval instant:

- **Judge Prompt** — the standard, encoded as an LLM evaluator system prompt
- **Scenario Seeds** — 5 test inputs (2 designed to fail, 3 designed to pass)
- **Blocking Assertion** — a string match: the phrase your agent must never produce

**If you've never run an eval before — start here, right now, no install:**

Copy the Judge Prompt from your canvas output. Open Claude, ChatGPT, or any LLM chat. Paste one of your agent's real outputs. Send:

> "Using the judge prompt below, evaluate this output. Return PASS or FAIL and one sentence explaining why."

That's a valid eval. Do it two or three times until you trust the judge is calibrated — then automate it.

**Pick your tool:**

| I want to… | Use |
|---|---|
| Try the judge prompt right now, no setup | **Manual** — paste into any LLM chat (start here) |
| Run all 5 seeds against my agent, no account | **Promptfoo** — one command, YAML config |
| Track evals over time with a nice UI | **Braintrust** — free tier, easiest cloud option |
| Already using LangSmith for traces | **LangSmith** — native evaluator integration |

Full guide — what evals are, what each artifact does, step-by-step: [`integrations/README.md`](../integrations/README.md)

Local eval setup: [`integrations/promptfoo.md`](../integrations/promptfoo.md) · Cloud: [`integrations/braintrust.md`](../integrations/braintrust.md) · [`integrations/langsmith.md`](../integrations/langsmith.md)

---

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

Open the relevant skill file from the [`skills/`](.) folder and paste the entire contents into your agent's composer or system prompt. Each skill is self-contained — no special runtime needed.

After pasting, send one message to start: **"Begin."** The agent will follow the skill instructions from Step 0.

### Prerequisites

- An AI coding agent: [Claude Code](https://github.com/anthropics/claude-code), Cursor, Codex, or similar

### Production monitoring — Lignos Studio (coming soon)

After your evals are running, Lignos Studio will let you import `.lignos/canvas.md` and watch the same anti-pattern in live production traces — the drift signals you defined in the canvas become your production alerts.

Lignos Studio is coming soon.

## Before running any skill — open in the right project

Every skill writes files to `.lignos/` in your **current working directory**. If you work across multiple projects, make sure you're in the right place first.

- **Claude Code:** Open Claude Code from inside the correct project folder. Each skill will print the working directory and ask you to confirm before doing anything.
- **Cursor / Codex:** Open the workspace for the correct project before pasting the skill.

When you start a skill, it will say: *"Starting in `<cwd>` — is this the correct project? Reply yes to continue."* Don't skip this — it's there so `.lignos/canvas.md` lands in the right repo.

---

## When to run each skill

**Canvas** — before writing any code. Replaces "what are the requirements?" with "what is the exact standard this agent must maintain?" Outputs the eval block automatically, then runs your agent's first Taste Test live in chat — paste one output in, get PASS or FAIL back before the session closes.

**Eval** — any time your agent surprises you. Regenerates the eval block from canvas, or bring a real output that felt wrong — it evaluates it live and captures it as a named scenario so your seed set grows with your actual experience.

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

**Commit `.lignos/` to version control.** These are governing documents, not build artifacts — treat them the same way you'd commit a `CLAUDE.md` or `README.md`. Do not add `.lignos/` to `.gitignore`.
