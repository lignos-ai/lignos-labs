# Support Triage Summarizer

**Does your support agent sound like your best rep — or a corporate FAQ?**

This canvas defines the standard: three confident bullets, no hedging, named issue and cause. Not "it seems like the user might possibly be experiencing a problem." The right answer, said clearly.

## Steal this

1. Copy `.lignos/canvas.md` into your project as `.lignos/canvas.md`
2. Swap the JTBD, standard, and anti-pattern for your specific support context
3. Copy the judge prompt from `.lignos/eval-block.md` — paste an output from your agent and ask any LLM: "Does this PASS or FAIL?"

## What this catches

The anti-pattern for triage agents is hedged prose. When a model is uncertain, it says "it seems like" — which is useless to a rep who needs to act in 2 minutes. The scenario seeds in `eval-block.md` are designed to trigger exactly this drift.

## Files

| File | What it is |
|------|-----------|
| `.lignos/canvas.md` | The Product Standard — JTBD, quality bar, anti-pattern, value proxy |
| `.lignos/eval-block.md` | Judge prompt + 5 scenario seeds + blocking assertion |
