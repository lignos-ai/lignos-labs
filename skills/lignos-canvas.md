---
description: Define your agent's Intent Canvas — JTBD, product standard, anti-pattern, and value proxy. Creates .lignos/canvas.md as the foundation for governed development.
argument-hint: "[agent-name]"
---

You are running the Lignos Intent Canvas workflow. Your job is to help the user define the business intent behind the agent they are about to build — before any code is written. This takes 5–10 minutes and produces a single artifact (`.lignos/canvas.md`) that governs how the agent is built, evaluated, and monitored.

## How to run this

**Step 0 — Greet**

Tell the user what this session produces in one sentence. Example: *"We're going to define the business intent behind your agent — what it's hired to do, what great looks like, and how you'll know it drifted. This becomes the standard everything else is measured against."*

Do not mention OTLP, traces, manifests, or technical terms yet.

---

**Step 1 — Agent name**

If `$ARGUMENTS` is set and non-empty, use it as the agent name and skip this question.

Otherwise ask: *"What is the name or short description of the agent you're building?"*

---

**Step 2 — Ask the 4 canvas questions, one at a time**

Wait for the user's full answer before moving to the next question. Do not front-load all four. Each question has a probe to use if the answer is too vague or too technical.

---

**Q1 — JTBD**

Ask: *"What job is the customer hiring this agent to do? Describe the specific situation they're in and what outcome they need — not what the agent does technically."*

A good answer names who is in what situation and what they need to be able to do after. Example: *"When a support rep gets a complex ticket, they need a concise triage summary so they can respond in under 2 minutes without reading the full thread."*

If the answer is too vague (e.g., "it helps users be more productive"), probe: *"Who specifically is using this? What were they doing — or struggling with — before this agent existed?"*

If the answer is too technical (e.g., "it calls the tickets API and summarizes"), probe: *"Step back from the implementation — what human job does this replace or improve?"*

From the answer, extract: (a) the **situation** as one sentence, (b) the **user** role/context, (c) the **outcome** they need.

---

**Q2 — Product Standard (taste)**

Ask: *"What does a great output from this agent look and feel like? Describe the tone, scope, and quality bar — not just whether it's correct."*

A good answer describes the subjective quality: voice, length, confidence, what it never does. Example: *"Concise and confident. Three bullets max. It sounds like your most experienced support rep wrote it — never hedges, never over-explains."*

If the answer is too generic (e.g., "accurate and helpful"), probe: *"If you read 10 outputs and one felt slightly off, what would be wrong with it?"*

Follow up with: *"Any hard rules — things this agent must never do, or must always do, regardless of input?"* Capture these as bullet constraints.

From the answer, extract: (a) a one-sentence **summary** of the quality bar, (b) the **tone**, (c) the **format** (structure/length), (d) **constraints** as 1–3 bullet rules.

---

**Q3 — Anti-Pattern (taste drift)**

Ask: *"What would the agent doing the wrong thing look like? Describe a specific subtle failure — not a crash, but a drift from your standard."*

A good answer is a concrete, observable mistake. Example: *"It writes a 400-word essay when a 3-bullet summary was needed. Or it hedges — 'it seems like possibly' — when the answer is obvious from the ticket."*

If the answer is too technical (e.g., "it returns a 500 error"), probe: *"Think about the customer experience, not the system behavior. What would the user say — not 'it broke', but 'this isn't right'?"*

Follow up with: *"Any specific phrases or patterns that would be a dead giveaway the agent has drifted? Even short phrases like 'it seems like' or 'you might want to consider'?"* Capture these as bullet signals.

From the answer, extract: (a) a one-sentence **description** of the drift pattern, (b) **3–6 short signal phrases** as bullets.

---

**Q4 — Value Proxy (judgment signal)**

Ask: *"How do you know it delivered value? Not a metric — what observable thing happens differently because this agent ran?"*

A good answer describes a behavior change: what the user does or doesn't have to do. Example: *"The support rep doesn't ask a follow-up question. They act on the summary directly."*

If the user gives a KPI formula (e.g., "CSAT increases by 5%"), probe: *"Imagine watching over someone's shoulder in real time. What do you see them do — or not do — because the agent ran?"*

If the user gives a system metric (e.g., "response time drops"), probe: *"What does the person using this actually do differently? Describe the behavior, not the measurement."*

Follow up with: *"If you were reviewing an output and had to decide in one question whether it succeeded — what would that question be?"* This becomes the judge question.

From the answer, extract: (a) the **observable success** (behavior/outcome), (b) the **judge question** (the one-sentence reviewer test).

---

**Step 3 — Synthesize and confirm**

Produce a one-sentence standard: *"This agent is hired to [JTBD outcome] and must always [standard]."*

Show the user this sentence and the full summary paragraph:

> *"Your agent is hired to [JTBD]. A great output [standard]. You'd know it drifted if [anti-pattern]. Value is delivered when [value proxy]."*

Ask: *"Does this capture it accurately, or is there anything you'd adjust?"*

Incorporate any corrections before writing the file.

---

**Step 4 — Write `.lignos/canvas.md`**

Check whether `.lignos/canvas.md` already exists.

- If it does not exist, create `.lignos/` and write the file.
- If it already exists, show the user what would change (old vs. new one-sentence standard at minimum) and ask: *"This will update your existing canvas. Want to proceed?"* Only overwrite on confirmation.

Extract the following subfields from the user's answers before writing:

- From Q1: a one-sentence **situation** (the when/what), the specific **user** (who), and the **outcome** they need (the after state)
- From Q2: a one-sentence **summary** of the quality bar, the **tone** (voice/register), the **format** (structure/length), and any hard **constraints** as bullet points
- From Q3: the **description** (the specific drift pattern), and **signals** — 3–6 short phrases or patterns that indicate the anti-pattern, as bullet points (e.g. "it seems like", "might want to consider")
- From Q4: the **observable success** (what you see or don't see) and the **judge question** (the one-sentence test a reviewer would apply)

Use this exact structure:

```markdown
# Agent Intent Canvas

**Agent:** [name]
**Created:** [today's date as YYYY-MM-DD]

## Job to Be Done (JTBD)
[One sentence: the specific situation and the outcome the user needs]

**User:** [who — role and context]
**Outcome:** [what they need to be able to do after]

## Product Standard
[One sentence: the quality bar — what great looks and feels like]

**Tone:** [voice and register]
**Format:** [structure and length]

- [constraint 1 — what the agent never does or always does]
- [constraint 2]

## Anti-Pattern (Taste Drift)
[One sentence: the specific subtle failure that signals drift]

- [signal phrase 1]
- [signal phrase 2]
- [signal phrase 3]

## Value Proxy
**Observable Success:** [what you see or don't see when it worked]
**Judge Question:** [the one-sentence test a reviewer would apply]

## One-Sentence Standard
> [This agent is hired to [JTBD outcome] — and must always [standard].]
```

---

**Step 5 — Generate eval block**

After confirming the file was written, immediately generate the eval block without asking. Say:

*"Canvas saved. Here's your eval block — ready to paste into Braintrust or LangSmith:"*

Then output three labeled fenced code blocks:

**Block 1 — Judge Prompt**

A system prompt for an LLM-as-judge. Fill every field from the canvas answers — never invent:

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

**Block 2 — Scenario Seeds**

Five test inputs specific to this agent's domain. Two should trigger the anti-pattern; three should be clean passes; one should test the value proxy edge case. Do not use generic placeholders — derive from the JTBD situation and anti-pattern.

```json
[
  {
    "id": "seed-1",
    "label": "[short name — anti-pattern trigger]",
    "input": "[realistic input designed to provoke the anti-pattern]",
    "expectedBehavior": "[what a passing output does or avoids]",
    "antiPatternTrigger": true,
    "failSignal": "[the specific signal phrase this seed is designed to catch]"
  },
  {
    "id": "seed-2",
    "label": "[short name — anti-pattern trigger]",
    "input": "[realistic input designed to provoke the anti-pattern]",
    "expectedBehavior": "[what a passing output avoids]",
    "antiPatternTrigger": true,
    "failSignal": "[signal phrase]"
  },
  {
    "id": "seed-3",
    "label": "[short name — clean pass]",
    "input": "[realistic input where the agent should pass cleanly]",
    "expectedBehavior": "[what success looks like]",
    "antiPatternTrigger": false,
    "failSignal": null
  },
  {
    "id": "seed-4",
    "label": "[short name — clean pass]",
    "input": "[realistic input]",
    "expectedBehavior": "[what success looks like]",
    "antiPatternTrigger": false,
    "failSignal": null
  },
  {
    "id": "seed-5",
    "label": "[short name — value proxy edge case]",
    "input": "[ambiguous or edge-case input that tests whether value is actually delivered]",
    "expectedBehavior": "[Observable Success — what the user does or doesn't have to do]",
    "antiPatternTrigger": false,
    "failSignal": null
  }
]
```

**Block 3 — Blocking Assertion**

Paste as a hardcoded pre-check before the LLM judge runs:

```
# Blocking assertion — [agent name]
# Run before the LLM judge. Any match = automatic FAIL.

BLOCK_ON = [
  [each signal phrase as a quoted string, comma-separated]
]

# Anti-pattern: "[anti-pattern description]"
# Standard: "[One-Sentence Standard]"
```

---

**Step 6 — Live Taste Test**

After outputting the three eval blocks, do not close yet. Run the first evaluation live, right now, with no tooling required.

Say:

*"Before you set up any tooling — let's run your agent's first Taste Test right now."*

Then present seed-1's input in a clearly separated block:

*"Here's a message designed to trigger the anti-pattern you just defined:*

---
[seed-1 `input` field — the full realistic input, verbatim]

---

*Paste this into your agent — whatever you have running. Bring me the output and I'll evaluate it against your standard."*

Then stop and wait for the user to paste the agent's output. Do not continue until they respond.

---

**When the user pastes the output:**

Evaluate it in two passes:

**Pass 1 — Blocking assertion:** Scan the output for any of the signal phrases from the canvas Anti-Pattern signals list. If any match (even a partial substring), that is an automatic FAIL. Do not run Pass 2.

**Pass 2 — Judge prompt:** Apply the Judge Prompt you just generated. Consider tone, format, constraints, and whether the Value Proxy question could be answered yes. Return your verdict.

**Return exactly this format:**

`PASS` or `FAIL` on its own line — then one sentence explaining why, specific to what you saw in the output.

---

**If FAIL:**

After the verdict, say:

*"Your agent drifted on its first stress-test — that's exactly what this is for. The fix: add an explicit rule to your system prompt that prohibits [cite the specific signal phrase or pattern that caused the FAIL]. Run `/lignos-govern` to generate a system prompt with this constraint built in."*

**If PASS:**

After the verdict, say:

*"Your agent held the standard on the hardest test — the anti-pattern trigger. The three clean seeds in your eval block should pass even more easily."*

---

**Step 7 — Close**

After the live eval result (PASS or FAIL), say:

*"That was your first evaluation. No new tool, no account, no setup — just your standard and your agent's output.*

*Your judge prompt lives in `.lignos/canvas.md`. Any time you want to check if your agent still sounds like you, paste an output here and I'll evaluate it.*

*Run `/lignos-govern` when you're ready to generate your agent's system prompt and governing contract."*

---

## What not to do

- Do not ask all four questions at once.
- Do not accept a KPI formula as a value proxy — probe until you get an observable behavior.
- Do not write implementation details into the canvas. This is about business intent, not architecture.
- Do not skip the confirmation step — the one-sentence standard is the most important output.
- Do not skip the eval block — generate it automatically after writing the canvas, do not ask the user if they want it.
- Do not skip the live Taste Test — present seed-1 and wait for the user to paste their agent's output before closing.
- Do not evaluate before the user pastes output — wait for them to respond.
- Do not use generic scenario seeds ("User asks a question"). Derive them from the actual JTBD domain and anti-pattern.
- Do not use the words "span", "trace", "OTLP", "telemetry", "OTel", "Studio", or "compliance" in any question or output.
