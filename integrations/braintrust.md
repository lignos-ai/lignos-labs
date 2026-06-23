# Lignos → Braintrust

Export your Product Standard as a Braintrust eval suite in under 30 minutes.
Lignos authors the rubric; Braintrust runs the evals.

## Prerequisites

- `.lignos/canvas.md` committed and imported via `POST /api/intent/import`
- Braintrust account with a project created for your agent
- `BRAINTRUST_API_KEY` in your env

## Step 1 — Generate the eval block

```bash
curl -X POST http://localhost:4000/api/intent/export-eval \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response includes your `IntentStandard` with a populated `eval` block:

```json
{
  "intentId": "support-ticket-triage",
  "eval": {
    "judgePrompt": "You are evaluating a triage agent...",
    "dimensions": ["jtbd_fit", "standard_adherence", "anti_pattern_guard", "value_signal", "structural_integrity"],
    "scenarioSeeds": [
      {
        "id": "support-ticket-triage-happy-path",
        "inputSketch": "Tier-1 support rep in a typical case: ...",
        "expectedBehavior": "Fast, confident, scoped to the ticket...",
        "failureMode": "Writing 400-word hedged prose..."
      }
    ],
    "blockingAssertions": [
      "Output must not contain the drift signal: \"it seems like\"",
      "Never exceed 120 words unless the ticket explicitly requires a checklist"
    ]
  }
}
```

## Step 2 — Create a Braintrust dataset

```python
import braintrust

project = braintrust.init(project="support-ticket-triage")

# Seeds are starting sketches — expand each into full (input, expected) pairs
seeds = [
    {
        "input": "Customer cannot log in after password reset; rep needs next step.",
        "expected": "Three bullets: likely cause, one clear action, escalation if still blocked.",
        "metadata": {
            "seedId": "support-ticket-triage-happy-path",
            "failureMode": "Multi-paragraph hedge without a recommended action.",
        },
    },
    # Add more from scenarioSeeds...
]

dataset = project.create_dataset("support-ticket-triage-v1")
for row in seeds:
    dataset.insert(**row)
dataset.flush()
```

## Step 3 — Configure the LLM judge

Use the exported `judgePrompt` as your scorer's system prompt:

```python
from braintrust import LLMClassifier

scorer = LLMClassifier(
    name="ProductStandardScore",
    prompt_template="""
{{ eval.judgePrompt }}

Output to evaluate:
{{ output }}

Return JSON: { "score": 0-1, "rationale": "..." }
""",
    choice_scores={"pass": 1.0, "fail": 0.0},
)
```

## Step 4 — Run the eval

```python
with braintrust.init(project="support-ticket-triage") as experiment:
    for row in dataset:
        output = your_agent(row["input"])
        experiment.log(
            input=row["input"],
            output=output,
            expected=row["expected"],
            scores={"ProductStandardScore": scorer(output, row["expected"])},
            metadata={"lignos.intent.id": "support-ticket-triage"},
        )
```

## Step 5 — Tag with `lignos.intent.id`

When your agent uses the Lignos SDK, span attributes include `lignos.intent.id`.
Filter Braintrust results by this tag to isolate governed runs from ad-hoc testing.

## Interpreting results

| Dimension | What to look for |
|-----------|-----------------|
| `jtbd_fit` | Does the output answer the actual job the rep needed done? |
| `standard_adherence` | Tone, format, length — matches the product standard |
| `anti_pattern_guard` | Hedging phrases absent; no drift signals found |
| `value_signal` | Rep could act on this answer without follow-up |
| `structural_integrity` | Output is complete — no truncation or missing escalation path |

## Blocking assertions

The `blockingAssertions` array contains hard-failure conditions suitable for a
`BraintrusScorer` that returns 0 immediately on any match:

```python
def blocking_scorer(output, expected, metadata):
    assertions = metadata.get("blockingAssertions", [])
    for rule in assertions:
        # Simple substring check — refine per your agent's output format
        if any(sig in output.lower() for sig in ["it seems like", "possibly", "might want to consider"]):
            return {"score": 0, "rationale": f"Blocking assertion failed: {rule}"}
    return None  # pass to other scorers
```

## Partnership goal

Median **< 30 min** from canvas complete to first meaningful eval run.
See [`LIGNOS-PARTNERSHIP-STRATEGY.md`](../LIGNOS-PARTNERSHIP-STRATEGY.md).
