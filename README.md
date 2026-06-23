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

## Fastest path

**No server needed — skip straight to [`examples/`](examples/)** if you want to steal a canvas and eval block right now.

Otherwise, pick your environment:

### Claude Code

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md \
  -o ~/.claude/commands/lignos-canvas.md
```

Restart Claude Code, type `/lignos-canvas`.

### Cursor

Open [skills/lignos-canvas.md](skills/lignos-canvas.md), copy the full content, and paste it into a new Cursor Composer session as your first message.

### Codex / other agents

Same as Cursor — paste the raw skill content into your agent's system prompt or first user turn. Each skill is self-contained plain text.

---

**Then: answer 4 questions.** You get `.lignos/canvas.md` — your agent's Product Standard.

**Then: export an eval block (optional, requires Lignos Studio running locally):**

```bash
curl -X POST http://localhost:4000/api/intent/export-eval \
  -H "Content-Type: application/json" -d '{}'
```

Paste `judgePrompt` into Braintrust or LangSmith. Import `scenarioSeeds` as your first test cases.

---

## The four skills

```
/lignos-canvas  →  /lignos-govern  →  /lignos-scope  →  /lignos-score
      ↓                  ↓                 ↓                  ↓
 canvas.md        constitution.md     code snippet         pass/fail
                  manifest.yaml
```

Full install + usage for all environments: [`skills/README.md`](skills/README.md)

---

## What Lignos is not

Not an eval runner. Not an observability dashboard. Eval platforms (Braintrust, LangSmith) run your tests — Lignos authors the standard those tests run against, and keeps it consistent from V0 through production.

---

[lignos-ai.github.io/lignos-platform](https://lignos-ai.github.io/lignos-platform/) · [Lignos Studio](https://github.com/lignos-ai/lignos-platform)
