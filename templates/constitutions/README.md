# Agent Constitution Templates

Ready-to-paste system prompt templates for common agent types. Each template is written as an Agent Constitution — a set of values and rules that define how your agent makes judgment calls when no explicit instruction exists.

Copy the closest template, fill in the `[bracketed]` fields from your `/lignos-canvas` output, and paste into your agent's system prompt.

## Templates

| Template | Agent type | Key standard |
|----------|-----------|-------------|
| [`support-triage.md`](support-triage.md) | Tier-1 support summarizer | Confident bullets, no hedging |
| [`research-agent.md`](research-agent.md) | Research synthesis | Conclusions first, never neutral |
| [`customer-chat.md`](customer-chat.md) | Customer-facing assistant | Resolve in one message, never deflect |
| [`code-reviewer.md`](code-reviewer.md) | PR review assistant | Risk-first, always cite file and line |

## How to use

1. Run `/lignos-canvas` to define your standard
2. Copy the constitution template closest to your agent type
3. Replace `[bracketed]` fields with values from your canvas
4. Paste the filled template as your agent's system prompt
5. Run `/lignos-govern` to generate a constitution tailored exactly to your canvas

These templates are starting points. `/lignos-govern` produces a constitution derived directly from your canvas answers — more specific and more accurate than any template.
