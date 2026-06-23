# Customer Product Assistant

**Does your agent actually resolve things — or just apologize and point to docs?**

This canvas defines the standard: direct answer first, resolve in one message, never ask for information the customer already gave you. "I completely understand your frustration" is not a resolution.

## Steal this

1. Copy `.lignos/canvas.md` into your project as `.lignos/canvas.md`
2. Swap the JTBD, standard, and anti-pattern for your product (different resolution scope, escalation rules, tone requirements, etc.)
3. Copy the judge prompt from `.lignos/eval-block.md` — paste an output from your agent and ask any LLM: "Does this PASS or FAIL?"

## What this catches

The anti-pattern for customer chat agents is deflection: "please see our help center," asking the customer to confirm things they already said, or empathy without resolution. The scenario seeds include a customer who already provided all the information — to see if the agent asks for it again anyway.

## Files

| File | What it is |
|------|-----------|
| `.lignos/canvas.md` | The Product Standard — JTBD, quality bar, anti-pattern, value proxy |
| `.lignos/eval-block.md` | Judge prompt + 5 scenario seeds + blocking assertion |
