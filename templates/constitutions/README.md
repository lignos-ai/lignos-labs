# Lignos-Ready Constitution Templates

Six system prompt templates — one for each common agent JTBD type. Copy, fill in the brackets, and paste into your agent's system prompt.

These are starting points. A template with `[brackets]` still filled in provides no governance value — Studio will score it `⚠ Partial` on Standard Alignment. The brackets represent the minimum specificity required.

For a constitution derived from your specific context, run `/lignos-canvas` then `/lignos-govern` in Claude Code — that produces a constitution grounded in the exact standard you described, not a generic template.

## Templates

| File | JTBD type | Use when |
|------|-----------|----------|
| [`triage-agent.md`](triage-agent.md) | `triage` | Classifying, routing, or prioritizing items |
| [`summarization-agent.md`](summarization-agent.md) | `summarization` | Condensing or extracting from existing content |
| [`research-agent.md`](research-agent.md) | `research` | Gathering and synthesizing from multiple sources |
| [`generation-agent.md`](generation-agent.md) | `generation` | Creating new content — drafts, code, documents |
| [`customer-facing-agent.md`](customer-facing-agent.md) | `customer-facing` | Direct real-time communication with end customers |
| [`workflow-agent.md`](workflow-agent.md) | `workflow` | Orchestrating multi-step processes or coordinating systems |

## What makes a Lignos-Ready constitution

Every template is structured around four sections that map to the Intent Canvas:

1. **Mission** — the specific user situation and outcome (from JTBD)
2. **Standard** — behavioral rules encoding quality, tone, and scope (from Product Standard)
3. **Non-negotiables** — explicit prohibitions targeting the known failure mode (from Anti-Pattern)
4. **Value signal** — a self-check that tells the agent when a run was worth running (from Value Proxy)

A constitution without explicit non-negotiables (section 3) is the most common gap. An agent without a prohibition for its specific anti-pattern will drift toward that failure under efficiency pressure.

## Using with Studio

When you instrument your agent with `intent_scope` and run `/lignos-score`, Studio evaluates whether your system prompt covers all four sections against your canvas standard. A missing Anti-Pattern Guard is a blocking finding — the skill will not clear you to ship without it.
