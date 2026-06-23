# Lignos Labs

**Turn your agent's requirements into evals — before you build. Ship something your team can actually trust.**

Most teams build agents first and discover what "good" means after the first production failure. Lignos flips that cycle. Answer four questions about what your agent is hired to do and you get a targeted judge prompt, scenario seeds, and a live eval run — all derived from your requirements, in the same session. No account. No install. Works in any AI coding environment.

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

**One thing first:** Open your AI tool from inside the correct project folder. Every skill writes `.lignos/` files to the current working directory. The skill will print the path and ask you to confirm before creating anything — don't skip that step if you work across multiple projects.

Otherwise, pick your environment and run the canvas skill:

### Claude Code

```bash
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/lignos-ai/lignos-labs/main/skills/lignos-canvas.md \
  -o ~/.claude/commands/lignos-canvas.md
```

Restart Claude Code. Type `run /lignos-canvas` → answer 4 questions → get your eval block and live Taste Test in the same session.

### Cursor

Open [skills/lignos-canvas.md](skills/lignos-canvas.md), paste the entire contents into Cursor Composer, then send **"Begin."** Answer the 4 questions — you get the eval block and a live Taste Test inline.

### Codex / other agents

Same as Cursor — paste the canvas skill, send "Begin." Each skill is self-contained plain text.

---

**After `/lignos-canvas`:** you have `.lignos/canvas.md` — your agent's Product Standard, a judge prompt, scenario seeds, and a blocking assertion. Then the skill runs your agent's first evaluation live — paste one output in, get PASS or FAIL back, no account needed.

**The seeds are synthetic starters.** They're derived from your requirements, not from real usage data. Replace them with actual examples as soon as you have them.

---

## How it works

```mermaid
flowchart TD
    Start(["Your agent"]) --> Canvas

    Canvas["/lignos-canvas\n4 questions"]
    Canvas --> Standard[".lignos/canvas.md\nProduct Standard"]
    Canvas --> EvalSet["Judge Prompt · Seeds · Blocking Assertion\nLive Taste Test → PASS/FAIL · Your Standard Declared"]

    Standard --> Govern["/lignos-govern\nConstitution · CLAUDE.md"]
    Govern --> Ship(["Ship"])

    EvalSet --> Platforms["Braintrust · LangSmith · Promptfoo"]

    Ship -->|"real output\nsurprises you"| Intake["/lignos-eval\nrate it · name it · capture it"]
    Intake -->|"new scenario or\ngold standard"| EvalSet
```

Full install + usage for all environments: [`skills/README.md`](skills/README.md)

---

## What Lignos gives you — and what it doesn't

**What you get:** A judge prompt, five synthetic scenario seeds, and a blocking assertion — all derived from your requirements in one session. A foundation to build from before you have real usage data.

**What you still need:**
- Real examples from actual usage to replace or supplement the synthetic seeds. Five AI-generated scenarios are not a representative test suite.
- Human calibration. The judge prompt is generated from the same session as your standard — you don't yet know whether it agrees with *you*, only that it agrees with *itself*. Label a sample of real outputs and check.
- Ongoing updates as the input distribution shifts. The canvas captures your requirements at V0. The world changes.

**The risk to avoid:** Treating a `.lignos/canvas.md` and five seeds as validated evals. The value Lignos provides is lowering the cost of starting — not replacing the work of real eval engineering. Use it as your eval V0, then build from real data.

**What Lignos is not:** An error tracker. Not something you wire up after your agent breaks. Reactive evals are built from failures you already had. Lignos builds the eval standard from requirements before the agent exists — so the cycle starts shorter. Eval platforms (Braintrust, LangSmith, Promptfoo) run your tests. Lignos authors the standard those tests measure against.

---

Lignos Studio — coming soon
