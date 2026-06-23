# `/lignos-govern` — Agent Constitution + Manifest

Reads the Intent Canvas and produces two governing artifacts: the Agent Constitution (with a ready-to-paste system prompt) and the LignosManifest (the contract Studio verifies every session against).

## Usage

```
/lignos-govern
/lignos-govern [agent-name]
```

Pass an agent name to override the name from the canvas.

## Prerequisites

`.lignos/canvas.md` must exist. Run `/lignos-canvas` first.

## What it does

1. Reads `.lignos/canvas.md` and classifies the agent into one of six JTBD types:

   | Type | Signals |
   |------|---------|
   | `triage` | Classifying, routing, prioritizing items |
   | `summarization` | Condensing or extracting from existing content |
   | `research` | Gathering and synthesizing from multiple sources |
   | `generation` | Creating new content (drafts, code, documents) |
   | `customer-facing` | Direct real-time communication with end customers |
   | `workflow` | Orchestrating multi-step processes |

2. Generates both artifacts using type-appropriate SLA defaults and milestone scaffolding.

3. Shows you the system prompt and SLA block for review before writing anything.

4. Asks you to confirm or adjust the SLA numbers before writing the files.

## Output

### `.lignos/constitution.md`

The Agent Constitution contains:
- **Mission** — one-sentence statement of what the agent exists to do
- **Values** — principles expressed in every run, regardless of efficiency pressure
- **Non-Negotiables** — lines never crossed even under time or token pressure
- **Reasoning Under Uncertainty** — how the agent handles gaps without guessing
- **Value Signal** — the self-check that defines a successful run
- **System Prompt** — complete, ready-to-paste, no placeholders

### `.lignos/manifest.yaml`

```yaml
apiVersion: lignos/v1
kind: Manifest
metadata:
  intentId: agent-name-slug
  displayName: "Agent Name"
  version: "1.0.0"

spec:
  topology:
    milestones:
      - span: ingest-input
        required: true
      - span: classify-intent
        required: true
      - span: generate-summary
        required: true
    terminalFailureConditions:
      - attribute: "error"
        value: "true"

  sla:
    maxTurns: 8
    maxDurationMs: 15000
    maxCostUsd: 0.05
    maxTokens: 20000

  compliance:
    anonymizeAttributes:
      - traceloop.entity.input
      - traceloop.entity.output
```

SLA defaults by type:

| Type | maxTurns | maxDurationMs | maxCostUsd | maxTokens |
|------|----------|---------------|------------|-----------|
| `triage` | 8 | 15,000 | $0.05 | 20,000 |
| `summarization` | 6 | 20,000 | $0.08 | 30,000 |
| `research` | 15 | 60,000 | $0.25 | 80,000 |
| `generation` | 10 | 45,000 | $0.15 | 50,000 |
| `customer-facing` | 8 | 10,000 | $0.05 | 20,000 |
| `workflow` | 20 | 120,000 | $0.50 | 100,000 |

If either file exists, the skill shows what changed and asks for confirmation before overwriting.

## Next steps

After `/lignos-govern`:

1. Copy the system prompt from `.lignos/constitution.md` into your agent's system prompt.
2. Run `/lignos-scope` to get the instrumentation snippet that connects the agent to Studio.
3. Run `/lignos-score` before shipping to verify the implementation matches the canvas.

**Open Studio** to import your standard and measure live agents: http://127.0.0.1:4000?standard=ready&from=labs — upload `.lignos/canvas.md` (+ manifest after govern).
