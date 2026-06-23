# Lignos → Promptfoo

Run evals locally with no account, no cloud, and no signup. Promptfoo reads a YAML config and runs your judge prompt against real agent outputs in your terminal.

## Prerequisites

- Node.js 18+ (check: `node --version`)
- Your `/lignos-canvas` output — specifically the Judge Prompt and Scenario Seeds
- An OpenAI or Anthropic API key in your env

## Step 1 — Install Promptfoo

No global install needed:

```bash
npx promptfoo@latest --version
```

That's it. `npx` downloads and runs it on demand.

## Step 2 — Create the eval config

Create `.promptfoo/config.yaml` in your project root. Fill in the values from your `/lignos-canvas` output:

```yaml
# .promptfoo/config.yaml
description: "{{agent_name}} — Lignos eval"

prompts:
  - "{{input}}"

providers:
  - id: openai:gpt-4o-mini   # or anthropic:claude-haiku-4-5-20251001
    config:
      systemPrompt: |
        {{paste your Judge Prompt here — the full block from /lignos-canvas output}}

tests:
  # Seed 1 — anti-pattern trigger (should FAIL)
  - description: "Anti-pattern trigger — hedged response"
    vars:
      input: "{{paste seed-1 input from your canvas output}}"
    assert:
      - type: not-contains
        value: "it seems like"      # from your Blocking Assertion
      - type: not-contains
        value: "possibly"
      - type: llm-rubric
        value: "Does this output match the Product Standard? PASS if yes, FAIL if it hedges or over-explains."
        provider: openai:gpt-4o-mini

  # Seed 2 — anti-pattern trigger (should FAIL)
  - description: "Anti-pattern trigger — over-explanation"
    vars:
      input: "{{paste seed-2 input}}"
    assert:
      - type: not-contains
        value: "might want to consider"
      - type: llm-rubric
        value: "Does this output match the Product Standard? PASS if yes, FAIL if it hedges or over-explains."
        provider: openai:gpt-4o-mini

  # Seed 3 — clean pass (should PASS)
  - description: "Clean input — expect pass"
    vars:
      input: "{{paste seed-3 input}}"
    assert:
      - type: llm-rubric
        value: "Does this output match the Product Standard? PASS if yes."
        provider: openai:gpt-4o-mini
```

## Step 3 — Point it at your agent

Replace the `providers` block with your actual agent. Promptfoo can call any HTTP endpoint, Python script, or LLM directly:

```yaml
providers:
  # Option A: call your agent via HTTP
  - id: http
    config:
      url: http://localhost:8000/run
      method: POST
      body:
        input: "{{input}}"
      responseParser: "json.output"

  # Option B: run a Python script
  - id: python:your_agent.py
```

## Step 4 — Run

```bash
npx promptfoo@latest eval
```

Results appear in your terminal. To open the visual report:

```bash
npx promptfoo@latest view
```

A local web UI opens at `http://localhost:15500` showing pass/fail per seed, the judge rationale, and which blocking assertions fired.

## What good looks like

```
✓ Seed 3 — clean input           PASS  (score: 1.0)
✓ Seed 4 — clean input           PASS  (score: 1.0)
✗ Seed 1 — anti-pattern trigger  FAIL  "output contains: 'it seems like'"
✗ Seed 2 — anti-pattern trigger  FAIL  "hedges with over-explanation"
✓ Seed 5 — edge case             PASS  (score: 0.9)
```

Seeds 1 and 2 should fail — they're designed to trigger the anti-pattern. If they pass, your agent's system prompt isn't enforcing the prohibition. Update the constitution and add an explicit prohibition for the failure mode.

## Re-running after changes

Edit your system prompt, then:

```bash
npx promptfoo@latest eval --no-cache
```

`--no-cache` forces fresh runs instead of using cached responses.

## Sharing results

```bash
npx promptfoo@latest share
```

Generates a shareable link to your results — useful for async review without a cloud account.

---

Ready to track evals over time with a persistent UI? → [Braintrust](braintrust.md)
