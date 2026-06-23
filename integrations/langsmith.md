# Lignos → LangSmith

Export your Product Standard as a LangSmith eval suite.
Lignos authors the rubric; LangSmith runs the evals.
No Lignos lock-in — the export is portable JSON.

## Prerequisites

- `.lignos/canvas.md` — run `/lignos-canvas` to generate it
- LangSmith account; `LANGCHAIN_API_KEY` and `LANGCHAIN_PROJECT` in your env
- `langsmith` Python package: `pip install langsmith`

## Step 1 — Get your eval block

Run `/lignos-canvas` in Claude Code, Cursor, or Codex. At the end of the session, three artifacts appear in the chat automatically:

- **Judge Prompt** — your LLM evaluator system prompt, derived from your Product Standard
- **Scenario Seeds** — 5 test inputs (2 anti-pattern triggers, 3 clean passes, 1 edge case)
- **Blocking Assertion** — string-match pre-check for the most common drift signal

Copy the Judge Prompt and Scenario Seeds — you'll use them in Steps 2 and 3.

Already have a canvas? Run `/lignos-eval` to regenerate the eval block from `.lignos/canvas.md` at any time.

## Step 2 — Create a LangSmith dataset

Expand the Scenario Seeds into full `(input, expected)` pairs:

```python
from langsmith import Client

client = Client()

# Adapt the seeds from your /lignos-canvas output
seeds = [
    {
        "inputs": {"input": "Customer cannot log in after password reset; rep needs next step."},
        "outputs": {"expected": "Three bullets: likely cause, one clear action, escalation if still blocked."},
        "metadata": {
            "seedId": "support-ticket-triage-happy-path",
            "failureMode": "Multi-paragraph hedge without a recommended action.",
        },
    },
    # Add remaining seeds from your eval block...
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

Paste the Judge Prompt from your `/lignos-canvas` output as the evaluator's criteria:

```python
from langsmith.evaluation import LangChainStringEvaluator
from langchain_anthropic import ChatAnthropic

judge_llm = ChatAnthropic(model="claude-haiku-4-5-20251001")

# JUDGE_PROMPT: paste from your /lignos-canvas or /lignos-eval output
JUDGE_PROMPT = """..."""

evaluator = LangChainStringEvaluator(
    "labeled_score_string",
    config={
        "llm": judge_llm,
        "criteria": {"product_standard": JUDGE_PROMPT},
        "normalize_by": 1,
    },
)
```

## Step 4 — Run the eval

```python
from langsmith.evaluation import evaluate

results = evaluate(
    your_agent,
    data="support-ticket-triage-v1",
    evaluators=[evaluator],
    experiment_prefix="lignos",
)
```

## Step 5 — Add the blocking assertion

Run the Blocking Assertion from your eval block as a pre-check before the LLM evaluator:

```python
def blocking_evaluator(run, example):
    output = run.outputs.get("output", "")
    # Signal phrases from your /lignos-canvas anti-pattern field
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

| What to look for | Signal |
|-----------------|--------|
| `blocking_assertion` score 0 | Anti-pattern phrase in output — fix first |
| `product_standard` score < 0.5 | Output doesn't match tone, format, or quality bar |
| All scores ≥ 0.8 across seeds | Ready to run `/lignos-score` and ship |

When evals catch drift, update your system prompt and re-run `/lignos-score` to verify the fix before re-running evals.

---

## Production monitoring — Lignos Studio (coming soon)

When Lignos Studio launches, it will pull your LangSmith runs and score them against your imported Product Standard — the same anti-pattern you defined in the canvas becomes your production drift alert. No re-pointing OTLP required.
