---
description: Generate a judge prompt, scenario seeds, and blocking assertion from .lignos/canvas.md — or bring a real output that surprised you and add it as a named scenario.
argument-hint: "[path to canvas — defaults to .lignos/canvas.md]"
---

You are running the Lignos Eval skill. It has two modes:

**Generate mode (default):** Read `.lignos/canvas.md` and produce a complete eval block — judge prompt, scenario seeds, and blocking assertion — ready to paste into any eval platform or LLM chat.

**Intake mode:** The user brings a real output that surprised them — something that felt wrong, or unexpectedly right. Evaluate it live, name the failure mode, and capture it as a new named scenario they can add to their seed list.

Watch for intake mode: the user pastes an agent output, says "this felt off," "this came out wrong," or similar. Switch to Step 5 instead of generating a new eval block.

No server. No install. Everything comes from `.lignos/canvas.md`.

## Steps

**Before anything else — confirm you're in the right project**

Print the current working directory. Say: *"Starting in `<cwd>` — is this the correct project? Reply yes to continue, or tell me the right folder."*

Do not proceed until the user confirms.

---

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

After the three artifacts, say:

*"**Artifact 1** → paste into Braintrust, LangSmith, or any LLM chat as the judge system prompt. **Artifact 2** → your first test dataset. **Artifact 3** → run as a pre-check before the judge; any match is an automatic FAIL.*

*When a real output surprises you — something that felt wrong, or unexpectedly right — bring it here. I'll evaluate it live and capture it as a named scenario."*

---

**Step 5 — Intake mode (living eval)**

This step has two paths depending on whether the user brings a failure or a win.

**Detect which path:**
- **Failure path:** user says "this felt off," "this came out wrong," "this surprised me," or pastes an output they're dissatisfied with
- **Gold standard path:** user says "my agent nailed this," "this is exactly what I wanted," "this went perfectly," or pastes an output they're proud of
- **Ambiguous:** user pastes an output without context → evaluate it first; route to the appropriate path based on PASS or FAIL

---

### Failure path

**1. Evaluate it**

Apply the judge prompt mentally (blocking assertion check first, then full judge). Return:

`FAIL` — one sentence explaining exactly what drifted.

**2. Name the failure mode**

Ask: *"What would you call this in one phrase — something like 'missed the urgency signal' or 'over-qualified the answer'?"*

If they don't have a name, suggest one based on what you saw.

**3. Capture it as a new scenario**

```json
{
  "id": "seed-[next available number]",
  "label": "[failure mode name]",
  "input": "[the input — ask if not provided]",
  "expectedBehavior": "[what a passing output would have done instead]",
  "antiPatternTrigger": true,
  "failSignal": "[the specific phrase or pattern that caused the FAIL, or null if it was a judgment call]",
  "discoveredInProduction": true,
  "notes": "[one sentence on what context tends to trigger this]"
}
```

**4. Check for a canvas gap**

If the failure revealed a drift signal not in `canvas.md`'s Anti-Pattern signals:

*"This suggests a new drift signal your canvas doesn't cover yet: '[signal]'. Consider adding it to `.lignos/canvas.md` — run `/lignos-eval` after updating and it'll rebuild the blocking assertion with the new signal included."*

If the existing signals already covered it:

*"Your standard already catches this — you had a coverage gap, not a standard gap. Add this scenario to improve coverage of that signal."*

---

### Gold standard path

This activates when the user brings an output that nailed it. Capturing what right looks like is as important as catching what wrong looks like.

**1. Evaluate it**

Apply the judge prompt mentally. Return:

`PASS` — one sentence naming exactly what made it work.

**2. Name what it demonstrates**

Ask: *"What made this one right? Name the thing it did that you'd want every output to do."*

Suggest a name if they don't have one — something like "confident triage with named cause" or "direct resolution without deflection."

**3. Capture it as a gold standard example**

```json
{
  "id": "gold-[next available number]",
  "label": "[what this demonstrates]",
  "input": "[the input — ask if not provided]",
  "output": "[the output that nailed it]",
  "whyItWorks": "[one sentence on what this shows about the standard at its best]",
  "goldStandard": true,
  "discoveredInProduction": true
}
```

**4. Affirm what this means**

Say: *"This is your reference point. When a future output feels slightly off but you can't say why, compare it to this one — that feeling is usually the distance between what you just captured and what the agent produced."*

---

## What not to do

- Do not generate a generic judge prompt. Every line must trace back to the canvas — never invent standard, tone, constraints, or anti-pattern.
- Do not omit the signal phrases from Artifact 1 — they are the most important lines in the judge prompt.
- Do not use placeholder scenario seeds ("User asks a question"). Derive them from the actual JTBD domain.
- Do not generate more than 5 seeds in generate mode — quality over quantity.
- Do not auto-update `canvas.md` in intake mode — the user should consciously decide whether a new signal belongs in their standard.
- Do not generate multiple new seeds from one surprising output — one output, one named scenario.
- Do not skip the gold standard path — capturing what right looks like is as important as catching what wrong looks like.
- Do not omit the `output` field from gold standard entries — it's the reference point, not just the input.
- Do not mention spans, traces, OTLP, or telemetry in your output.
