---
description: Generate a copy-pasteable judge prompt, scenario seeds, and blocking assertion from your .lignos/canvas.md. No server required — paste the output directly into Braintrust or LangSmith.
argument-hint: "[path to canvas — defaults to .lignos/canvas.md]"
---

You are running the Lignos Eval Export skill. Your job is to read the agent's Intent Canvas and produce a complete, ready-to-paste eval block in the chat: a judge prompt, scenario seeds, and a blocking assertion. The user should be able to paste these directly into Braintrust or LangSmith in under two minutes.

No server. No install. Everything comes from `.lignos/canvas.md`.

## Steps

**Step 1 — Find the canvas**

Check whether `.lignos/canvas.md` exists.

- If it exists, read it and proceed to Step 2.
- If `$ARGUMENTS` is set and points to a different path, use that path instead.
- If no canvas is found, stop and say: *"No canvas found at `.lignos/canvas.md`. Run `/lignos-canvas` first — it takes about 15 minutes and produces the standard everything here is derived from."*

---

**Step 2 — Extract fields**

From the canvas, identify:

- **Agent name** — `**Agent:**` field
- **JTBD sentence** — the first sentence in the JTBD section (not the subfields)
- **Standard sentence** — the first sentence in the Product Standard section
- **Tone** — `**Tone:**`
- **Format** — `**Format:**`
- **Constraints** — bullet list under Product Standard
- **Anti-pattern description** — the first sentence in the Anti-Pattern section
- **Signal phrases** — the bullet list under Anti-Pattern
- **Observable Success** — `**Observable Success:**`
- **Judge Question** — `**Judge Question:**`
- **One-Sentence Standard** — the blockquote in the One-Sentence Standard section

---

**Step 3 — Generate three artifacts**

Output them as three labeled fenced code blocks, clearly separated, ready to copy.

### Artifact 1 — Judge Prompt

A system prompt for an LLM-as-judge. Paste this into Braintrust or LangSmith as the evaluator system prompt.

Construct it using this template — fill every field from the canvas, never invent:

```
You are evaluating outputs from an AI agent called "[agent name]".

Job: [JTBD sentence]

Product Standard: [Standard sentence]
Tone: [tone]
Format: [format]
[Each constraint on its own line: "Rule: [constraint]"]

Anti-Pattern — automatic FAIL if present: [anti-pattern description]
Drift signals (any of these = FAIL):
[Each signal phrase on its own line: "- [signal]"]

Value Signal: [Observable Success]

Evaluate the output provided. Answer in order:
1. Does the output contain any drift signal listed above? If yes, cite it exactly and mark FAIL.
2. Does the output match the declared tone and format?
3. [Judge Question]

Respond with:
PASS or FAIL
One sentence explaining why.
```

### Artifact 2 — Scenario Seeds

Five test inputs that exercise the anti-pattern and value proxy. Make them specific to this agent's domain — derive them from the JTBD (what situation is the user in?) and the anti-pattern (what would cause the agent to drift?). Do not use generic placeholders.

Two of the five should be designed to trigger the anti-pattern. Three should be clean inputs where a passing output is expected.

```json
[
  {
    "id": "seed-1",
    "label": "[short name]",
    "input": "[realistic user input or scenario]",
    "expectedBehavior": "[what a passing output does or avoids]",
    "antiPatternTrigger": true,
    "failSignal": "[the specific signal phrase this seed is designed to catch]"
  },
  {
    "id": "seed-2",
    "label": "[short name]",
    "input": "[realistic user input]",
    "expectedBehavior": "[what a passing output does]",
    "antiPatternTrigger": true,
    "failSignal": "[signal phrase]"
  },
  {
    "id": "seed-3",
    "label": "[short name — clean input]",
    "input": "[realistic user input where the agent should pass cleanly]",
    "expectedBehavior": "[what success looks like here]",
    "antiPatternTrigger": false,
    "failSignal": null
  },
  {
    "id": "seed-4",
    "label": "[short name — clean input]",
    "input": "[realistic user input]",
    "expectedBehavior": "[what success looks like]",
    "antiPatternTrigger": false,
    "failSignal": null
  },
  {
    "id": "seed-5",
    "label": "[short name — edge case]",
    "input": "[ambiguous or edge-case input that tests the value proxy]",
    "expectedBehavior": "[Observable Success behavior — what the user does or doesn't have to do]",
    "antiPatternTrigger": false,
    "failSignal": null
  }
]
```

### Artifact 3 — Blocking Assertion

Paste this as a hardcoded pre-check before the LLM judge runs. If any signal matches, fail immediately without calling the judge.

```
# Blocking assertion — [agent name]
# Run this before the LLM judge. Any match = automatic FAIL.

BLOCK_ON = [
  [each signal phrase as a quoted string, comma-separated]
]

# Check: if any BLOCK_ON string appears in output (case-insensitive) → FAIL
# Anti-pattern this implements: "[anti-pattern description]"
# Standard: "[One-Sentence Standard]"
```

---

**Step 4 — Close**

After the three artifacts, say exactly this:

---

*Paste **Artifact 1** into Braintrust or LangSmith as your evaluator system prompt. Add **Artifact 2** as your first test dataset. Use **Artifact 3** as a pre-check in your eval harness — it catches the most common failure before the judge even runs.*

*Next steps:*
- *Run `/lignos-govern` to generate your agent's system prompt from this same standard.*
- *Run `/lignos-score` when your implementation exists — it evaluates your code against the same standard across 5 dimensions.*
- *Lignos Studio (coming soon) will watch this anti-pattern in live production traces — the same drift signals you defined here become your production alerts.*

---

## What not to do

- Do not generate a generic judge prompt. Every line must trace back to the canvas — never invent standard, tone, constraints, or anti-pattern.
- Do not omit the signal phrases from Artifact 1 — they are the most important lines in the judge prompt.
- Do not use placeholder scenario seeds ("User asks a question"). Derive them from the actual JTBD domain.
- Do not generate more than 5 seeds — quality over quantity.
- Do not mention spans, traces, OTLP, or telemetry in your output.
