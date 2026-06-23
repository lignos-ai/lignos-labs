# Lignos Labs

**Define what "good" means for your agent — once. Carry it from V0 → eval → production.**

Lignos Labs is the free, open community layer of [Lignos](https://lignos-ai.github.io/lignos-platform/). No account. No install. Four questions and you have a judge prompt your eval platform can run against.

---

## What's here

| Folder | What it is |
|--------|-----------|
| [`skills/`](skills/) | Claude Code slash commands — run `/lignos-canvas` to start |
| [`examples/`](examples/) | 5 real agent canvases + pre-generated eval blocks — steal and adapt |
| [`templates/constitutions/`](templates/constitutions/) | Agent Constitution templates by agent type |
| [`integrations/`](integrations/) | Braintrust and LangSmith integration recipes |
| [`schemas/`](schemas/) | `IntentStandard` JSON schema + example |

---

## Fastest path

**Step 1 — Install the canvas skill (Claude Code):**

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md \
  -o ~/.claude/commands/lignos-canvas.md
```

Restart Claude Code, type `/lignos-canvas`.

**Step 2 — Answer 4 questions.** You get `.lignos/canvas.md` — your agent's Product Standard.

**Step 3 — Export an eval block:**

```bash
curl -X POST http://localhost:4000/api/intent/export-eval \
  -H "Content-Type: application/json" -d '{}'
```

Paste `judgePrompt` into Braintrust or LangSmith. Import `scenarioSeeds` as your first test cases.

**No server? Skip to [`examples/`](examples/)** — copy the closest canvas and eval block and adapt them. The judge prompt works without running anything.

---

## The four skills

```
/lignos-canvas  →  /lignos-govern  →  /lignos-scope  →  /lignos-score
      ↓                  ↓                 ↓                  ↓
 canvas.md        constitution.md     code snippet         pass/fail
                  manifest.yaml
```

Full install + usage: [`skills/README.md`](skills/README.md)

---

## Cursor / Codex

No slash commands — paste the skill content directly into your composer:
[`skills/lignos-canvas.md`](skills/lignos-canvas.md) (raw)

---

## What Lignos is not

Not an eval runner. Not an observability dashboard. Eval platforms (Braintrust, LangSmith) run your tests — Lignos authors the standard those tests run against, and keeps it consistent from V0 through production.

---

[lignos-ai.github.io/lignos-platform](https://lignos-ai.github.io/lignos-platform/) · [Lignos Studio](https://github.com/lignos-ai/lignos-platform)
