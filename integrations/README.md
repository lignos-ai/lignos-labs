# Eval integrations

After `/lignos-canvas` runs, you have three artifacts in chat. This guide explains what they are, why you need them, and which tool to use.

---

## What is an eval?

An eval is a repeatable test that checks whether your agent's outputs match your Product Standard.

Without evals, you find out your agent drifted when a user complains. With evals, you catch it before it ships — and you can prove to yourself (and your team) that a prompt change actually improved things, rather than guessing.

Most teams skip evals because they think it means a lot of infrastructure. It doesn't. Your first eval is three steps:

1. Take an output your agent produced
2. Show it to a judge (another LLM, using your judge prompt)
3. See if the judge returns PASS or FAIL

That's it. You can do it in under two minutes with no tooling.

---

## The three artifacts — and what each one does

`/lignos-canvas` generates three things. Here's what each one is for:

### Judge Prompt
A system prompt that turns any LLM into a calibrated evaluator for your specific agent. It encodes your Product Standard — tone, format, what's a FAIL, what signals value was delivered. You paste this into an eval tool as the "evaluator" or "scorer."

**Think of it as:** The rubric your agent's outputs get graded against.

### Scenario Seeds
Five test inputs designed to find the edges of your standard. Two are anti-pattern triggers (they should produce a FAIL if your agent is drifting). Three are clean inputs that should PASS. Together they give you a starter test dataset without having to collect real-world examples first.

**Think of it as:** Your first test suite, derived directly from your anti-pattern.

### Blocking Assertion
A string-match check — the literal phrase your agent should never produce (from your anti-pattern definition). This runs before the judge prompt and catches the most common failure instantly, without burning API credits on an LLM call.

**Think of it as:** The cheapest possible check. Run it first.

---

## Your first eval run — right now, no tooling

Copy the Judge Prompt from your canvas session. Open Claude, ChatGPT, or any LLM chat. Paste one of your agent's real outputs (or use Seed 3 from your Scenario Seeds — the first clean-input seed). Then send this message:

> "Using the judge prompt below, evaluate the output I've pasted. Return PASS or FAIL and one sentence explaining why."

You'll see whether the judge prompt is calibrated before you set up any platform. If the judge flags something you disagree with, adjust the prompt — then re-run. Do this two or three times before automating.

---

## Pick your platform

Once you're confident in your judge prompt, automate it:

### Local evals — Promptfoo (recommended for most builders)

**No account. No cloud. One command.**

[Promptfoo](https://promptfoo.dev) runs all five Scenario Seeds against your agent from a single YAML file. You get a pass/fail table in your terminal and a visual report locally. No data leaves your machine.

→ [`integrations/promptfoo.md`](promptfoo.md) — step-by-step setup

---

### Cloud evals — tracking over time

**Free tiers available.**

| Platform | Best for |
|----------|---------|
| [Braintrust](braintrust.md) | Easiest cloud setup; great UI for reviewing eval history |
| [LangSmith](langsmith.md) | Already using LangSmith for traces; evals alongside them |

Start local. Move to cloud when you want a persistent eval history or team access to results.

---

## What the artifacts map to in each tool

| Artifact from `/lignos-canvas` | Where it goes |
|-------------------------------|---------------|
| **Judge Prompt** | Evaluator / scorer system prompt in any eval tool |
| **Scenario Seeds** | Test dataset — seeds 1–2 should FAIL, seeds 3–5 should PASS |
| **Blocking Assertion** | Pre-check before the judge runs; string-match assertion |

Run `/lignos-eval` at any time to regenerate these three artifacts from `.lignos/canvas.md` if your standard changes.
