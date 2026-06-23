# Marketing Content Generator

**Does your content agent write like your brand — or like every other AI?**

This canvas defines the standard: active voice, specific true claims, first paragraph earns attention without a generic opener. Not "In today's fast-paced world, finding the right solution has never been more important."

## Steal this

1. Copy `.lignos/canvas.md` into your project as `.lignos/canvas.md`
2. Swap the JTBD, standard, and anti-pattern for your brand voice (different tone, audience, content types, style rules, etc.)
3. Copy the judge prompt from `.lignos/eval-block.md` — paste an output from your agent and ask any LLM: "Does this PASS or FAIL?"

## What this catches

The anti-pattern for content agents is generic AI prose: buzzwords, fluffy openers, passive voice, and "revolutionary" claims with nothing behind them. The scenario seeds include prompts that deliberately bait these patterns — "write an intro for our new AI-powered feature" — to see if the agent reaches for a generic opener.

## Files

| File | What it is |
|------|-----------|
| `.lignos/canvas.md` | The Product Standard — JTBD, quality bar, anti-pattern, value proxy |
| `.lignos/eval-block.md` | Judge prompt + 5 scenario seeds + blocking assertion |
