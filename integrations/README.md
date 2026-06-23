# Eval integrations

After `/lignos-canvas` runs, you have three artifacts in chat. This guide explains what evals actually are, what the artifacts give you, and how to build toward something you can trust.

---

## What is an eval — honestly

An eval is a repeatable check on whether your agent's outputs match a defined standard. The goal isn't to have evals. The goal is to understand what your agent is doing and improve it. Evals are a means.

The most important thing most teams miss: **look at real outputs before you build any eval framework.** Read 20–50 actual outputs from your agent. Notice what surprises you, what feels off, what's better than expected. That error analysis is more valuable than five automated checks on synthetic inputs. You cannot build a good eval for a failure mode you haven't seen yet.

Evals are a progression — not a destination you reach by running one tool:

1. **Manual review** — read real outputs, notice patterns, build intuition. This is not a lazy shortcut. It's the required foundation.
2. **Simple rule-based checks** — string matches, regex, format validators. Cheap, fast, no LLM call required. Catches the obvious failures reliably.
3. **LLM-as-judge** — an LLM evaluates your agent's outputs against a rubric. More flexible, but requires calibration. A judge prompt is not calibrated until you've checked its verdicts against your own human judgments on real examples.
4. **Automated suites** — run checks at scale, on schedule, on every prompt change. Only worth building once steps 1–3 are stable.

Most teams jump to step 4 and wonder why their evals don't catch real problems.

---

## The three artifacts — what they are and what they aren't

`/lignos-canvas` generates three things. Here's what each does — and where it falls short:

### Judge Prompt
A system prompt that instructs an LLM to evaluate your agent's outputs against your Product Standard — tone, format, what constitutes a failure, what signals value was delivered.

**What it is:** A starting rubric derived from your requirements.
**What it isn't:** A calibrated evaluator. Until you run it against real outputs and check its verdicts against your own judgment, you don't know if it agrees with *you* — only that it agrees with *itself*. Calibrate it: label 10–20 real outputs yourself, then see how many the judge agrees with. Adjust where it diverges.

### Scenario Seeds
Five synthetic test inputs — two designed to trigger the anti-pattern, three clean passes. Generated from your requirements before you have real data.

**What they are:** A starting dataset that lets you run *something* before real usage data exists.
**What they aren't:** A representative test suite. Real inputs will surface failure modes the seeds never anticipated. Replace or supplement these with actual examples from production as soon as you have them. A suite of 50 real examples beats 5 synthetic ones every time.

### Blocking Assertion
A string-match check on the literal phrases your agent should never produce.

**What it is:** The cheapest, most reliable check in your stack. Run it before the judge.
**What it isn't:** Comprehensive. Paraphrases of the same failure won't be caught. Treat it as a floor, not a ceiling.

---

## Step 0 — read outputs before you automate anything

Before touching any tool: collect 20 real outputs from your agent and read them. Ask yourself: what surprised me? What felt slightly off but I couldn't say why? What was better than I expected?

Write down what you notice. That list becomes your real anti-pattern inventory — more specific than anything generated from requirements alone. Then use the judge prompt and seeds as a starting framework against that inventory.

---

## Step 1 — calibrate your judge manually

Copy the Judge Prompt from your canvas session. Take 10 real outputs from your agent. For each one, write your own judgment first (PASS or FAIL, one sentence why). Then run the judge on the same outputs. Count agreements and disagreements.

If the judge disagrees with you on more than 2–3 out of 10: find the pattern in the disagreements, adjust the judge prompt, re-run. Repeat until the judge catches what *you* catch.

Only automate a judge you've calibrated this way.

```
"Using the judge prompt below, evaluate the output I've pasted.
Return PASS or FAIL and one sentence explaining why."
```

---

## Step 2 — add rule-based checks first

Before automating the LLM judge, add the simplest checks possible:

- **String match:** does the output contain the blocking assertion phrases? Fast, free, reliable.
- **Format check:** is the output the right length? Does it have the expected structure?
- **Explicit rule violations:** things the agent must *never* do — check these with code, not LLMs.

These simple checks will catch a meaningful percentage of failures without any LLM cost. Add the judge on top of them, not instead of them.

---

## Step 3 — automate once you trust it

Once your judge is calibrated and your rule-based checks are stable, automate:

### Local — Promptfoo (recommended to start)

**No account. No cloud. One command.**

[Promptfoo](https://promptfoo.dev) runs your checks from a YAML config. Results in the terminal. No data leaves your machine.

→ [`integrations/promptfoo.md`](promptfoo.md) — step-by-step setup

---

### Cloud — tracking over time

| Platform | Best for |
|----------|---------|
| [Braintrust](braintrust.md) | Easiest cloud setup; good for reviewing eval history with a team |
| [LangSmith](langsmith.md) | Already using LangSmith for traces; run evals in the same platform |

Start local. Move to cloud when you need persistent history or team access.

---

## What the artifacts map to

| Artifact | Role in your eval stack |
|----------|------------------------|
| **Judge Prompt** | LLM-as-judge evaluator — calibrate before automating |
| **Scenario Seeds** | Starting dataset — replace with real examples as soon as possible |
| **Blocking Assertion** | Cheapest check — run before the judge, every time |

Run `/lignos-eval` any time to regenerate from `.lignos/canvas.md`, or bring a real output that surprised you and it'll help you capture it as a named scenario.
