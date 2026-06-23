# Lignos Labs

**Define what "good" means for your agent — once. Carry it from V0 → eval → production.**

Lignos Labs is the free, open community layer of [Lignos](https://lignos-ai.github.io/lignos-platform/). No account. No install. Answer four questions and get a judge prompt your eval platform can run against — works in any AI coding environment.

---

## What's here

| Folder | What it is |
|--------|-----------|
| [`skills/`](skills/) | Prompt skills for any AI coding agent — slash commands for Claude Code, paste-in for Cursor / Codex |
| [`examples/`](examples/) | 5 real agent canvases + pre-generated eval blocks — steal and adapt |
| [`templates/constitutions/`](templates/constitutions/) | Agent Constitution templates by agent type |
| [`integrations/`](integrations/) | Braintrust and LangSmith integration recipes |
| [`schemas/`](schemas/) | `IntentStandard` JSON schema + example |

---

## Fastest path — judge prompt in 15 minutes, no server

**No install? Skip to [`examples/`](examples/)** — copy the closest canvas and eval block and adapt them.

Otherwise, pick your environment and run two skills back to back:

### Claude Code

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md \
  -o ~/.claude/commands/lignos-canvas.md
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-eval.md \
  -o ~/.claude/commands/lignos-eval.md
```

Restart Claude Code. Type `/lignos-canvas` → answer 4 questions → type `/lignos-eval`.

### Cursor

Open [skills/lignos-canvas.md](skills/lignos-canvas.md), paste into Cursor Composer. Answer the 4 questions. Then open [skills/lignos-eval.md](skills/lignos-eval.md) and paste it in — you get the eval block inline.

### Codex / other agents

Same as Cursor — each skill is self-contained plain text. Paste canvas skill first, then eval skill.

---

**After `/lignos-canvas`:** you have `.lignos/canvas.md` — your agent's Product Standard.

**After `/lignos-eval`:** three artifacts appear in the chat, no server:
- **Judge prompt** — paste into Braintrust or LangSmith as your evaluator
- **Scenario seeds** — your first test dataset, derived from your anti-pattern
- **Blocking assertion** — string-match pre-check that catches the most common failure before the judge runs

---

## The five skills

```
/lignos-canvas  →  /lignos-eval  →  paste into Braintrust / LangSmith   ← fast path (no server)
       ↓
/lignos-govern  →  /lignos-scope  →  /lignos-score  →  Studio            ← full path
```

Full install + usage for all environments: [`skills/README.md`](skills/README.md)

---

## What Lignos is not

Not an eval runner. Not an observability dashboard. Eval platforms (Braintrust, LangSmith) run your tests — Lignos authors the standard those tests run against, and keeps it consistent from V0 through production.

---

[lignos-ai.github.io/lignos-platform](https://lignos-ai.github.io/lignos-platform/) · [Lignos Studio](https://github.com/lignos-ai/lignos-platform)
