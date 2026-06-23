# Lignos → LangSmith

Export your Product Standard as a LangSmith eval suite.
Lignos authors the rubric; LangSmith runs the evals.
No Lignos lock-in — the export is portable JSON.

## Prerequisites

- `.lignos/canvas.md` committed and imported via `POST /api/intent/import`
- LangSmith account; `LANGCHAIN_API_KEY` and `LANGCHAIN_PROJECT` in your env
- `langsmith` Python package: `pip install langsmith`

## Step 1 — Generate the eval block

```bash
curl -X POST http://localhost:4000/api/intent/export-eval \
  -H "Content-Type: application/json" \
  -d '{}'
```

Save the `eval` block from the response — you'll use `judgePrompt` and `scenarioSeeds`.

## Step 2 — Create a LangSmith dataset

```python
from langsmith import Client

client = Client()

# Seeds are starting sketches — expand each into full examples
seeds = [
    {
        "inputs": {"input": "Customer cannot log in after password reset; rep needs next step."},
        "outputs": {"expected": "Three bullets: likely cause, one clear action, escalation if still blocked."},
        "metadata": {
            "seedId": "support-ticket-triage-happy-path",
            "failureMode": "Multi-paragraph hedge without a recommended action.",
            "lignos.intent.id": "support-ticket-triage",
        },
    },
    # Add more from scenarioSeeds...
]

dataset = client.create_dataset(
    "support-ticket-triage-v1",
    description="Generated from Lignos Product Standard. Edit seeds before production evals.",
)
client.create_examples(
    inputs=[s["inputs"] for s in seeds],
    outputs=[s["outputs"] for s in seeds],
    metadata=[s["metadata"] for s in seeds],
    dataset_id=dataset.id,
)
```

## Step 3 — Configure the LLM evaluator

Use the exported `judgePrompt` as your custom evaluator's system prompt:

```python
from langsmith.evaluation import LangChainStringEvaluator
from langchain_anthropic import ChatAnthropic

judge_llm = ChatAnthropic(model="claude-haiku-4-5-20251001")

evaluator = LangChainStringEvaluator(
    "labeled_score_string",
    config={
        "llm": judge_llm,
        "criteria": {
            "product_standard": (
                # Paste your judgePrompt here:
                "You are evaluating a triage agent against its Product Standard.\n"
                "Score 1 if the output matches the standard; 0 if it exhibits drift."
            ),
        },
        "normalize_by": 1,
    },
)
```

## Step 4 — Run the eval

```python
from langsmith.evaluation import evaluate

results = evaluate(
    your_agent,                         # callable: input dict → output str
    data="support-ticket-triage-v1",
    evaluators=[evaluator],
    experiment_prefix="lignos-slice4",
    metadata={"lignos.intent.id": "support-ticket-triage"},
)
```

## Step 5 — Blocking assertions as custom evaluators

The `blockingAssertions` array maps directly to `exact_match` or custom string checks:

```python
def blocking_evaluator(run, example):
    output = run.outputs.get("output", "")
    drift_signals = ["it seems like", "possibly", "might want to consider"]
    for signal in drift_signals:
        if signal in output.lower():
            return {"key": "blocking_assertion", "score": 0,
                    "comment": f"Drift signal found: \"{signal}\""}
    return {"key": "blocking_assertion", "score": 1}

results = evaluate(
    your_agent,
    data="support-ticket-triage-v1",
    evaluators=[evaluator, blocking_evaluator],
)
```

## Interpreting results

| Dimension | LangSmith metric | What to look for |
|-----------|-----------------|-----------------|
| `jtbd_fit` | `labeled_score_string` | Output answers the actual job |
| `standard_adherence` | `labeled_score_string` | Tone + format + length match standard |
| `anti_pattern_guard` | `blocking_assertion` | No drift signals in output |
| `value_signal` | `labeled_score_string` | Rep could act without follow-up |
| `structural_integrity` | `labeled_score_string` | Output complete, no truncation |

## Connecting to Studio monitoring

### Path B — Link prod traces (preferred for teams already on LangSmith)

No OTLP re-pointing required. Studio pulls runs from your existing LangSmith project and
scores them against your imported Product Standard.

**Step 1 — Import your Product Standard** (if not already done):

```bash
curl -X POST http://localhost:4000/api/intent/import \
  -H "Content-Type: application/json" \
  -d "{\"canvasMarkdown\": $(cat .lignos/canvas.md | jq -Rs .)}"
```

**Step 2 — Link your LangSmith project:**

```bash
curl -X POST http://localhost:4000/api/intent/link-traces \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "langsmith",
    "apiKey": "ls__...",
    "projectName": "your-project-name",
    "lookbackHours": 24
  }'
```

Response shape — Cursor reads `prodTraceLinked: linkStatus.linked` to mark Path B complete:

```json
{
  "ok": true,
  "provider": "langsmith",
  "projectName": "your-project-name",
  "runsImported": 47,
  "driftSummary": {
    "sessionsScored": 47,
    "driftSessions": 6,
    "driftRate": 0.13,
    "antiPattern": {
      "description": "Writing 400-word hedged prose when three bullets would let the rep act immediately.",
      "signals": ["it seems like", "possibly", "might want to consider"]
    },
    "samples": [
      {
        "runId": "abc123",
        "drifted": true,
        "rationale": "Because you said: \"Writing 400-word hedged prose…\" — signals seen: it seems like.",
        "snippet": "It seems like the user may want to consider…"
      }
    ]
  },
  "linkedAt": "2026-06-19T10:00:00.000Z"
}
```

**Step 3 — Check link status:**

```bash
curl http://localhost:4000/api/intent/link-status
# { "linked": true, "provider": "langsmith", "projectName": "...", "linkedAt": "...", "runsImported": 47 }
```

**Step 4 — Re-sync when new runs land:**

```bash
curl -X POST http://localhost:4000/api/intent/link-traces/sync \
  -H "Content-Type: application/json" \
  -d '{ "apiKey": "ls__...", "lookbackHours": 24 }'
```

**Step 5 — Clear link (rotate project or API key):**

```bash
curl -X DELETE http://localhost:4000/api/intent/link-traces
```

The drift rationale always cites your canvas anti-pattern: "Because you said…" — not generic
ops metrics. That is the litmus test.

---

### Path C — Local audit (OTLP)

When your agent is instrumented with the Lignos SDK, each run emits `lignos.intent.id`
as a span attribute. Point OTEL at Studio (`localhost:4318`) or filter LangSmith traces by this attribute to compare:
- Pre-production eval scores vs. live drift signals in Studio
- Intent compliance rate vs. `anti_pattern_guard` scores

This closes the loop from V0 → eval → production without re-defining the standard.

## Partnership goal

Second vendor for neutrality gate — export works without Lignos-only lock-in.
See [`LIGNOS-PARTNERSHIP-STRATEGY.md`](../LIGNOS-PARTNERSHIP-STRATEGY.md).
