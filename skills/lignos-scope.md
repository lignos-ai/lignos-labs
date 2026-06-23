# `/lignos-scope` — Manifest + Instrumentation Snippet

Reads the canvas and generates two things: the LignosManifest (`manifest.yaml`) that defines your governance contract, and a ready-to-paste instrumentation snippet. No placeholders — paste and run.

This skill is optional and Studio-prep focused. Run it when you're ready to instrument your agent for production monitoring.

## Usage

```
/lignos-scope
/lignos-scope async
/lignos-scope sync
/lignos-scope decorator
```

Pass a style argument to skip the style question.

## Before anything else — confirm you're in the right project

Print the current working directory. Say: *"Starting in `<cwd>` — is this the correct project? Reply yes to continue, or tell me the right folder."*

Do not proceed until the user confirms.

## Prerequisites

`.lignos/canvas.md` must exist. Run `/lignos-canvas` first, then `/lignos-govern` to produce the constitution. This skill generates the manifest and instrumentation code on top of that.

---

## Step 1 — Read the canvas

Read `.lignos/canvas.md`. Extract:
- `agent_name`
- `jtbd` — including the Format and session characteristics (single-shot vs. conversational, input/output volume)
- `one_sentence_standard`
- `anti_pattern`

If the canvas does not exist, stop: *"No canvas found at `.lignos/canvas.md`. Run `/lignos-canvas` first."*

---

## Step 2 — Generate the manifest

Derive `intentId` as a lowercase kebab-case slug of the agent name (e.g., "Support Triage Agent" → "support-triage-agent").

**SLA — infer from canvas signals, do not use a lookup table:**

| Signal | maxTurns | maxDurationMs | maxCostUsd | maxTokens |
|---|---|---|---|---|
| Single-shot (one input → one output) | 3–5 | 10000–20000 | 0.02–0.05 | 10000–25000 |
| Conversational (back-and-forth) | 8–15 | 20000–60000 | 0.05–0.20 | 20000–60000 |
| Heavy context / long output | 10–20 | 45000–120000 | 0.15–0.50 | 50000–100000 |

If the JTBD describes a single structured output (a score, a summary, a classification), use the single-shot row. Lean toward the lower end if the Format field specifies something brief.

**Milestones — derive from the JTBD flow:**

Read the JTBD and identify the 2–4 steps the agent actually takes from input to output. Name them as kebab-case span names. Mark steps that must complete for the output to be valid `required: true`; optional quality steps `required: false`. Use names that describe this agent's actual work — do not copy generic scaffold names.

**Show the user the proposed manifest and SLA and ask:**

*"Here's the manifest I'll generate — SLA estimates are based on [one sentence: what you inferred from the canvas, e.g., 'your agent produces a single structured output per run']. Do these look right, or do you want to adjust before I write the file?"*

Apply any changes, then write `.lignos/manifest.yaml`:

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
      - span: [milestone-name]
        required: [true|false]
    terminalFailureConditions:
      - attribute: "error"
        value: "true"

  sla:
    maxTurns: [inferred]
    maxDurationMs: [inferred]
    maxCostUsd: [inferred]
    maxTokens: [inferred]

  compliance:
    anonymizeAttributes:
      - traceloop.entity.input
      - traceloop.entity.output

# Intent standard: [one_sentence_standard]
# Generated: [today's date]
# SLA: starting estimates — adjust after first real runs
```

If `.lignos/manifest.yaml` already exists, show what changed and ask before overwriting.

---

## Step 3 — Ask for code style

Ask: *"Which style fits your codebase?"*

- `async` — context managers, async (default for LangChain / OpenAI SDK)
- `sync` — context managers, sync
- `decorator` — async decorators

Skip this question if the user passed a style argument.

---

## Step 4 — Generate the instrumentation snippet

Produce a complete, ready-to-paste snippet. Every milestone from the manifest appears as a call. Include one inline comment per milestone.

### `async` — context managers, async

```python
from lignos import intent_scope, milestone

async def run(self, input):
    async with intent_scope("[intentId]", manifest_version="1.0.0"):
        async with milestone("[milestone-1]"):
            # [what this step does, from the milestone name]
            pass
        async with milestone("[milestone-2]"):
            # [what this step does]
            pass
```

### `sync` — context managers, sync

```python
from lignos import sync_intent_scope, sync_milestone

def run(self, input):
    with sync_intent_scope("[intentId]", manifest_version="1.0.0"):
        with sync_milestone("[milestone-1]"):
            pass
```

### `decorator` — async decorators

```python
from lignos import lignos_intent, lignos_milestone

@lignos_intent("[intentId]", manifest_version="1.0.0")
async def run(self, input):
    ...

@lignos_milestone("[milestone-1]")
async def milestone_1_fn(self, ...):
    # [what this step does]
    ...
```

Also show the three `.env` lines to add — these are for when Lignos Studio launches. Add them now so the integration is ready to activate:

```
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_TRACES_EXPORTER=otlp
OTEL_SERVICE_NAME=[intentId]
```

---

## Step 5 — Close

Confirm the manifest is written. Then say:

*"`.lignos/manifest.yaml` is ready — your governance contract is set. Paste the snippet into your agent's entry point and add the three env vars.*

*When Lignos Studio launches, it will verify every production session against this manifest — the same standard you defined in the canvas."*

---

## What not to do

- Do not use a named agent type (triage, summarization, etc.) to look up SLA values — infer from the canvas.
- Do not copy generic milestone names — derive them from the actual JTBD flow.
- Do not skip the SLA preview — the user needs to see and own these numbers before they govern production.
- Do not reference Lignos Studio as currently available — it is coming soon.
- Do not produce placeholder brackets in the code snippet — every value must be filled in.
