# Lignos Examples — Steal and Adapt

Five real agent canvases, each with a pre-generated eval block.
Pick the one closest to your agent, swap the fields, and have a judge prompt running in under 10 minutes — no server, no account.

## What's in each example

```
examples/
  <agent-type>/
    .lignos/
      canvas.md       ← the Product Standard (edit this)
      eval-block.md   ← judge prompt + scenario seeds + blocking assertion
```

Copy the judge prompt from `eval-block.md` into any LLM chat or eval platform.
Use the scenario seeds as your first test dataset — they're sketches, expand them.

## The five examples

| Example | Agent type | Key anti-pattern |
|---------|-----------|-----------------|
| [`support-triage/`](support-triage/) | Tier-1 support queue | Hedged prose instead of bullets |
| [`research-agent/`](research-agent/) | Internal research / synthesis | Fact dump with no judgment or conclusion |
| [`code-reviewer/`](code-reviewer/) | PR review assistant | Nitpicking style instead of surfacing risk |
| [`customer-chat/`](customer-chat/) | Customer-facing product assistant | Deflecting to docs instead of resolving |
| [`content-generator/`](content-generator/) | Marketing copy / email generation | Generic AI prose that ignores brand voice |

## How to adapt

1. Copy the folder closest to your agent into your repo as `.lignos/`
2. Edit `canvas.md` — fill in your actual JTBD, standard, and anti-pattern
3. Copy the judge prompt from `eval-block.md` into any LLM chat — paste an output and ask for PASS or FAIL
4. When you're ready to automate, point the judge prompt + seeds at Promptfoo or Braintrust

## Generate your own

Run `/lignos-canvas` in your project to produce a `canvas.md` tailored to your agent. The skill outputs the eval block automatically at the end — same format as `eval-block.md` here.
