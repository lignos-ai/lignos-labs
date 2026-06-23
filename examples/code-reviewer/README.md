# PR Code Review Assistant

**Does your review agent catch the real bugs — or just complain about formatting?**

This canvas defines the standard: every comment cites file and line, states the risk, and gives a concrete fix. The most critical issues appear first. No leading with "looks good!" when a SQL injection is hiding in line 47.

## Steal this

1. Copy `.lignos/canvas.md` into your project as `.lignos/canvas.md`
2. Swap the JTBD, standard, and anti-pattern for your codebase (different risk priorities, different languages, stricter security requirements, etc.)
3. Copy the judge prompt from `.lignos/eval-block.md` — paste an output from your agent and ask any LLM: "Does this PASS or FAIL?"

## What this catches

The anti-pattern for review agents is priority inversion: 12 style comments before the one correctness issue that actually matters. The scenario seeds in `eval-block.md` include a PR with a clear security flaw to see whether the agent buries it under low-priority feedback.

## Files

| File | What it is |
|------|-----------|
| `.lignos/canvas.md` | The Product Standard — JTBD, quality bar, anti-pattern, value proxy |
| `.lignos/eval-block.md` | Judge prompt + 5 scenario seeds + blocking assertion |
