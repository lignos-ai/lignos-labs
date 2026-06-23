# Research Synthesis Agent

**Does your research agent draw conclusions — or just dump facts?**

This canvas defines the standard: conclusions first, evidence second, clear point of view. Not a neutral "on one hand... on the other hand" summary that leaves the PM to do all the thinking anyway.

## Steal this

1. Copy `.lignos/canvas.md` into your project as `.lignos/canvas.md`
2. Swap the JTBD, standard, and anti-pattern for your research domain (competitive intel, technical landscape, market sizing, etc.)
3. Copy the judge prompt from `.lignos/eval-block.md` — paste an output from your agent and ask any LLM: "Does this PASS or FAIL?"

## What this catches

The anti-pattern for research agents is false neutrality. When the model doesn't want to be wrong, it presents "both sides" without committing. That's not synthesis — it's just organized noise. The scenario seeds in `eval-block.md` include prompts specifically designed to trigger this hedge.

## Files

| File | What it is |
|------|-----------|
| `.lignos/canvas.md` | The Product Standard — JTBD, quality bar, anti-pattern, value proxy |
| `.lignos/eval-block.md` | Judge prompt + 5 scenario seeds + blocking assertion |
