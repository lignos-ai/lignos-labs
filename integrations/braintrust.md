# Lignos → Braintrust

Export your Product Standard as a Braintrust eval suite in under 30 minutes.
Lignos authors the rubric; Braintrust runs the evals.

## Prerequisites

- `.lignos/canvas.md` — run `/lignos-canvas` to generate it
- Braintrust account with a project created for your agent
- `BRAINTRUST_API_KEY` in your env

## Step 1 — Get your eval block

Run `/lignos-canvas` in Claude Code, Cursor, or Codex. At the end of the session, three artifacts appear in the chat automatically:

- **Judge Prompt** — your LLM evaluator system prompt, derived from your Product Standard
- **Scenario Seeds** — 5 test inputs (2 anti-pattern triggers, 3 clean passes, 1 edge case)
- **Blocking Assertion** — string-match pre-check; catches the most common failure before the judge runs

Copy the Judge Prompt and Scenario Seeds — you'll use them in Steps 2 and 3.

Already have a canvas? Run `/lignos-eval` to regenerate the eval block from `.lignos/canvas.md` at any time.

## Step 2 — Create a Braintrust dataset

Expand the Scenario Seeds into full `(input, expected)` pairs:

```python
import braintrust

project = braintrust.init(project="support-ticket-triage")

# Adapt the seeds from your /lignos-canvas output
seeds = [
    {
        "input": "Customer cannot log in after password reset; rep needs next step.",
        "expected": "Three bullets: likely cause, one clear action, escalation if still blocked.",
        "metadata": {
            "seedId": "support-ticket-triage-happy-path",
            "failureMode": "Multi-paragraph hedge without a recommended action.",
        },
    },
    # Add remaining seeds from your eval block...
]

dataset = project.create_dataset("support-ticket-triage-v1")
for row in seeds:
    dataset.insert(**row)
dataset.flush()
```

## Step 3 — Configure the LLM judge

Paste the Judge Prompt from your `/lignos-canvas` output as the scorer's system prompt:

```python
from braintrust import LLMClassifier

# judgePrompt: paste from your /lignos-canvas or /lignos-eval output
JUDGE_PROMPT = """..."""

scorer = LLMClassifier(
    name="ProductStandardScore",
    prompt_template=JUDGE_PROMPT + "\n\nOutput to evaluate:\n{{output}}",
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
        )
```

## Step 5 — Add the blocking assertion

Run the Blocking Assertion from your eval block as a pre-check before the LLM judge:

```python
def blocking_scorer(output, expected, metadata):
    # Signal phrases from your /lignos-canvas anti-pattern field
    signals = ["it seems like", "possibly", "might want to consider"]
    for sig in signals:
        if sig in output.lower():
            return {"score": 0, "rationale": f"Anti-pattern signal detected: '{sig}'"}
    return None  # pass to LLM judge
```

## Interpreting results

| What to look for | Signal |
|-----------------|--------|
| Anti-pattern phrases in output | Failing `blocking_scorer` — highest priority fix |
| Generic tone / wrong format | Judge returns FAIL with Standard Alignment rationale |
| Output doesn't enable action | Judge returns FAIL with Value Signal rationale |

When evals catch drift, update your system prompt and re-run evals to verify the fix.
