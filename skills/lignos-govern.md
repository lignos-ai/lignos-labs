---
description: Generate your Agent Constitution and LignosManifest from the Intent Canvas. Reads .lignos/canvas.md and writes constitution.md + manifest.yaml — the governing documents for development and evaluation.
argument-hint: "[agent-name]"
---

You are running the Lignos Govern workflow. Your job is to read the Intent Canvas and turn it into two artifacts that govern the agent for the rest of its lifecycle:

1. **`constitution.md`** — a governing document containing the agent's values, non-negotiables, reasoning rules, and a ready-to-paste system prompt
2. **`manifest.yaml`** — the LignosManifest that Lignos Studio (coming soon) will use to verify every production session against the declared intent

This should take under 2 minutes. The canvas did the thinking — this is the payoff.

---

## Before anything else — confirm you're in the right project

Print the current working directory. Say: *"Starting in `<cwd>` — is this the correct project? Reply yes to continue, or tell me the right folder."*

Do not proceed until the user confirms.

---

## Step 1 — Read the canvas

Read `.lignos/canvas.md`. If it does not exist, stop and tell the user: *"No canvas found. Run `/lignos-canvas` first to define your agent's intent."*

Extract these four fields from the canvas:
- **agent_name** — from the `**Agent:**` field
- **jtbd** — from the `## Job to Be Done (JTBD)` section
- **standard** — from the `## Product Standard` section
- **anti_pattern** — from the `## Anti-Pattern (Taste Drift)` section
- **value_proxy** — from the `## Value Proxy` section
- **one_sentence_standard** — from the `## One-Sentence Standard` blockquote

If `$ARGUMENTS` is set and non-empty, use it to override `agent_name`.

---

## Step 2 — Classify the JTBD type

Silently classify the agent into one of the following types based on the JTBD and standard fields. Use the description that best matches what the agent produces and for whom.

| Type | Signals in JTBD / standard |
|---|---|
| `triage` | Classifying, routing, prioritizing, or categorizing items (tickets, bugs, requests, leads) |
| `summarization` | Condensing, distilling, or extracting key information from existing content |
| `research` | Gathering, synthesizing, or reasoning over information from multiple sources |
| `generation` | Creating new content — drafts, documents, emails, code, plans |
| `customer-facing` | Directly communicating with or responding to end customers in real time |
| `workflow` | Orchestrating multi-step processes or coordinating between systems |

Use this type to select SLA defaults and milestone scaffolding (see Step 4).

---

## Step 3 — Tell the user what you detected

Say: *"I read your canvas. This looks like a [type] agent — [one sentence explaining why based on JTBD]. I'm generating your Constitution and governance contract now."*

Do not ask for confirmation of the type. Move directly to generation.

---

## Step 4 — Generate both artifacts

### Constitution

Write `constitution.md` using this structure. Every section must be derived directly from the canvas — do not invent values or non-negotiables that aren't grounded in what the PM said.

```
# Agent Constitution: [agent_name]

> A governing document, not a list of instructions. It defines the values, non-negotiables,
> and reasoning rules that guide this agent's judgment when no explicit rule exists.

**Version:** 1.0.0
**JTBD type:** [type]
**Intent standard:** [one_sentence_standard from canvas]

---

## Mission

[jtbd — rewritten as a crisp 1-sentence mission statement: "This agent exists to [outcome] for [who]"]

## Values

These principles are expressed in every run, regardless of efficiency pressure.

1. [Derive from standard — the primary quality this agent always upholds]
2. [Derive from jtbd outcome — the result it always works toward]
3. [Derive from anti_pattern — the opposite of the failure mode, framed as a value]

## Non-Negotiables

These lines are never crossed, even under time or token pressure.

- [Primary non-negotiable from anti_pattern — make it a clear prohibition]
- [Secondary non-negotiable from standard — what it never sacrifices for brevity/speed]
- [Third non-negotiable — if the user said something specific; otherwise derive from jtbd integrity]

## Reasoning Under Uncertainty

When [agent_name] lacks sufficient information to produce an output that meets its standard, it [reasoning rule — derive from standard + anti_pattern: acknowledge the gap, state what's missing, produce partial output with explicit scope rather than guessing].

It does not [anti_pattern behavior rephrased as a temptation] even when doing so would be faster.

## Value Signal

A run is successful when [value_proxy]. If that outcome is not reachable from the available input, this agent surfaces the gap explicitly rather than producing a lower-quality output silently.

---

## System Prompt

Paste this directly into your agent's system prompt. It encodes the Constitution above as governing instructions.

---

[Write a complete, ready-to-paste system prompt. Do not use placeholders. Derive every line from the canvas fields. Structure it as follows:]

You are [agent_name]. [Mission sentence from above.]

[2–3 sentences encoding the product standard as first-person behavioral rules. Start with "You" or "Your outputs". Be specific — use the exact quality bar the PM described, not generic "be helpful" language.]

[2–3 sentences encoding the non-negotiables as clear prohibitions. Start with "You never" or "Do not". Each prohibition should be recognizable as the opposite of the anti-pattern the PM described.]

[1–2 sentences encoding the uncertainty reasoning rule. Start with "When you lack" or "If you cannot".]

[1 sentence encoding the value signal as a self-check. Example: "Before responding, ask: would [user type] be able to [value_proxy action] directly from this output?"]

# Governance
This agent operates under a Lignos Agent Constitution. Evaluate every output against this standard: [one_sentence_standard].

---

*Constitution generated by Lignos Govern from .lignos/canvas.md. To update, edit the canvas and re-run `/lignos-govern`.*
```

---

### Manifest

Write `manifest.yaml` using the LignosManifest schema below. Use the SLA defaults for the detected JTBD type. Derive `intentId` as a lowercase kebab-case slug of the agent name (e.g., "Support Triage Agent" → "support-triage-agent").

**SLA defaults by type:**

| Type | maxTurns | maxDurationMs | maxCostUsd | maxTokens |
|---|---|---|---|---|
| `triage` | 8 | 15000 | 0.05 | 20000 |
| `summarization` | 6 | 20000 | 0.08 | 30000 |
| `research` | 15 | 60000 | 0.25 | 80000 |
| `generation` | 10 | 45000 | 0.15 | 50000 |
| `customer-facing` | 8 | 10000 | 0.05 | 20000 |
| `workflow` | 20 | 120000 | 0.50 | 100000 |

**Milestone scaffolding by type:**

| Type | Milestones (span name → required) |
|---|---|
| `triage` | ingest-input (required), classify-intent (required), generate-summary (required) |
| `summarization` | ingest-content (required), extract-key-points (required), generate-output (required) |
| `research` | clarify-query (required), gather-sources (required), synthesize-findings (required), generate-report (required) |
| `generation` | understand-requirements (required), generate-draft (required), validate-output (optional) |
| `customer-facing` | understand-intent (required), generate-response (required) |
| `workflow` | parse-request (required), execute-steps (required), validate-outcome (optional) |

**Manifest template:**

```yaml
apiVersion: lignos/v1
kind: Manifest
metadata:
  intentId: [kebab-case slug of agent_name]
  displayName: "[agent_name]"
  version: "1.0.0"

spec:
  topology:
    milestones:
[list of milestones for the detected type, each as:]
      - span: [milestone-name]
        required: [true|false]
    terminalFailureConditions:
      - attribute: "error"
        value: "true"

  sla:
    maxTurns: [from type defaults]
    maxDurationMs: [from type defaults]
    maxCostUsd: [from type defaults]
    maxTokens: [from type defaults]

  compliance:
    anonymizeAttributes:
      - traceloop.entity.input
      - traceloop.entity.output

# Intent standard (from canvas): [one_sentence_standard]
# JTBD type: [type]
# Generated: [today's date]
```

---

## Step 5 — Show previews and ask about SLA

Show the user:
1. The full system prompt section from `constitution.md` (the most immediately useful part)
2. The SLA block from `manifest.yaml`

Then ask: *"The SLA defaults are based on [type] agent patterns — [maxTurns] turns, [maxDurationMs/1000]s, $[maxCostUsd] per run. Do these match your expectations, or do you want to adjust any of them before I write the files?"*

If the user wants to adjust, update the values in the manifest before writing. If they say "looks good" or equivalent, write both files immediately.

---

## Step 6 — Write both files

Write to:
- `.lignos/constitution.md`
- `.lignos/manifest.yaml`

If either file exists, show what changed (old vs. new version field or SLA) and ask before overwriting.

---

## Step 7 — Write project context file

Write a Lignos context block so every future session in this project knows about the standard — without the PM having to re-reference the canvas manually.

**Check for CLAUDE.md:**

- If `CLAUDE.md` exists: append the block below to the end of the file (do not overwrite anything).
- If `CLAUDE.md` does not exist: create it with only this block.

```markdown
## Agent Standard

**[one_sentence_standard from canvas — paste verbatim, no label]**

Never: [signal phrase 1] · [signal phrase 2] · [signal phrase 3] (add more if canvas has them)

→ `.lignos/canvas.md` · `.lignos/constitution.md`
```

After writing, tell the user: *"Added a Lignos context block to `CLAUDE.md` — every future Claude Code session in this project will follow the same standard automatically."*

**For Cursor users:** Also note: *"If you use Cursor, copy the same block into `.cursorrules` at your project root."*

---

## Step 8 — Close

Confirm all files are written. Then say:

*"Your governing documents are ready.*

*— `.lignos/constitution.md` — paste the system prompt into your agent. It encodes your standard as governing instructions.*
*— `.lignos/manifest.yaml` — the governance contract for production verification.*
*— `CLAUDE.md` — every session in this project now starts with your Product Standard in context.*

*Next: run `/lignos-scope` for a copy-paste instrumentation snippet, then `/lignos-score` before you ship.*

*Lignos Studio (coming soon) will verify every production session against this manifest — the same standard you defined in the canvas."*

---

## What not to do

- Do not invent values or non-negotiables not grounded in the canvas. If the canvas is thin, produce what you can and note where the PM should fill in detail.
- Do not use "span", "trace", "OTLP", "telemetry", "compliance", or "localhost" in the closing message.
- Do not reference Lignos Studio as currently available — it is coming soon.
- Do not skip the SLA preview — the PM needs to see and own these numbers before they govern production.
- Do not produce a generic system prompt. Every sentence must be traceable to a canvas field.
- The system prompt inside `constitution.md` must be complete and pasteable — no `[placeholder]` brackets left in it.
