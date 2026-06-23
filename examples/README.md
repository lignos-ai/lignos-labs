# Lignos Examples — Steal and Adapt

Five real agent canvases, each with a pre-generated eval block.
Pick the one closest to your agent, swap the fields, and have a judge prompt in Braintrust or LangSmith in under 10 minutes.

## What's in each example

```
examples/
  <agent-type>/
    .lignos/
      canvas.md       ← the Product Standard (edit this)
      eval-block.json ← judge prompt + scenario seeds + blocking assertions (generated from canvas)
```

The `eval-block.json` is what `POST /api/intent/export-eval` returns. You can use it directly without running the server — copy `judgePrompt` into your eval platform and import `scenarioSeeds` as starting test cases.

## The five examples

| Example | Agent type | Key anti-pattern |
|---------|-----------|-----------------|
| [`support-triage/`](support-triage/) | Tier-1 support queue | Hedged prose instead of bullets |
| [`research-agent/`](research-agent/) | Internal research / synthesis | Citing sources without judgment |
| [`code-reviewer/`](code-reviewer/) | PR review assistant | Nitpicking style over surfacing risk |
| [`customer-chat/`](customer-chat/) | Customer-facing product assistant | Promising features that don't exist |
| [`content-generator/`](content-generator/) | Marketing copy / email generation | Generic output that ignores brand voice |

## How to adapt

1. Copy the folder closest to your agent into your repo as `.lignos/`
2. Edit `canvas.md` — fill in your actual JTBD, product standard, and anti-pattern
3. Run `POST /api/intent/import` (or `lignos import`) to generate your `eval-block.json`
4. Paste `eval-block.json → judgePrompt` into Braintrust or LangSmith
5. Import `scenarioSeeds` as your first test cases (they're sketches — expand them)

## Fastest path (no server)

If you just want the judge prompt right now:
1. Open `canvas.md` in any example
2. Copy the `## Product Standard`, `## Anti-Pattern`, and `## Value Proxy` sections
3. Paste them into this template:

```
You are evaluating a <agent type> against its Product Standard.

JTBD: <one-sentence standard from canvas>

Product Standard: <summary>
Tone: <tone>
Constraints:
- <constraint 1>
- <constraint 2>

Anti-pattern: <description>
Drift signals: <signals, comma-separated>

Judge question: <judgeQuestion from Value Proxy>

Score whether the output matches the Product Standard, not generic quality or helpfulness.
```

That's the same prompt `generateEvalBlock()` builds — no magic, just your canvas in a consistent shape.
