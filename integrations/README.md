# Eval integrations

After `/lignos-canvas` you have three artifacts in the chat: a Judge Prompt, Scenario Seeds, and a Blocking Assertion. These work with any eval platform — or no platform at all.

## Pick your path

### Just getting started

**No account. No install. Works right now.**

Copy the Judge Prompt from your canvas session. Open Claude, ChatGPT, or any LLM. Paste one of your agent's outputs. Ask:

> "Using this judge prompt, evaluate the output below. Return PASS or FAIL with one sentence explaining why."

That's a valid eval. It tells you if your judge prompt is calibrated before you set up any tooling.

---

### Local evals — Promptfoo (recommended)

**No account. No cloud. One command.**

[Promptfoo](https://promptfoo.dev) runs evals in your terminal from a YAML config. It's the easiest way to run the Scenario Seeds from your canvas against a real agent.

→ [`integrations/promptfoo.md`](promptfoo.md)

---

### Cloud evals

**Free tiers available. Better for tracking over time.**

| Platform | Best for |
|----------|---------|
| [Braintrust](braintrust.md) | Easiest cloud setup; great UI for reviewing eval results |
| [LangSmith](langsmith.md) | Already have LangSmith traces; want evals alongside them |

---

## What the artifacts map to

| Artifact from `/lignos-canvas` | Where it goes |
|-------------------------------|---------------|
| **Judge Prompt** | Evaluator / scorer system prompt in any eval tool |
| **Scenario Seeds** | Test dataset — expand into `(input, expected)` pairs |
| **Blocking Assertion** | Pre-check before the judge runs; any string-match evaluator |

Run `/lignos-eval` at any time to regenerate these from `.lignos/canvas.md` if your standard changes.
