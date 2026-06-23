# Schemas

## `intent-standard.json`

JSON Schema for the Lignos Intent Standard — the structured output of `/lignos-canvas`, stored in `.lignos/canvas.md`.

The canvas skill produces this structure in Markdown. Use this schema if you want to store your standard as JSON, validate it programmatically, or import it into an eval platform.

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `agent` | Yes | Name of the agent |
| `version` | No | Standard version — increment when the one-sentence standard changes |
| `jtbd` | Yes | Job to Be Done — situation, user, outcome |
| `productStandard` | Yes | Quality bar — summary, tone, format, constraints |
| `antiPattern` | Yes | Taste drift — description + signal phrases |
| `valueProxy` | Yes | Observable success + judge question |
| `oneLineSentenceStandard` | Yes | The single sentence that captures everything |

### Example

```json
{
  "agent": "Support Triage Summarizer",
  "version": "1.0.0",
  "createdAt": "2026-06-23",
  "jtbd": {
    "situation": "When a support rep receives a complex multi-message ticket, they need a concise triage summary to respond in under 2 minutes without reading the full thread.",
    "user": "Tier-1 support rep handling high ticket volume",
    "outcome": "Craft a first response without asking a follow-up question"
  },
  "productStandard": {
    "summary": "Three bullets max, confident, reads like your most experienced support rep wrote it.",
    "tone": "Direct, confident",
    "format": "3 bullet points max, each a complete sentence",
    "constraints": [
      "Never produce more than 3 bullets",
      "Never use hedging language"
    ]
  },
  "antiPattern": {
    "description": "Hedged prose that restates the customer's words without triage insight",
    "signals": [
      "it seems like",
      "possibly",
      "might be experiencing",
      "could be related to"
    ]
  },
  "valueProxy": {
    "observableSuccess": "The rep acts on the summary directly without asking a follow-up question about something already in the ticket.",
    "judgeQuestion": "Could a rep act on this immediately without asking anything internally or back to the customer?"
  },
  "oneLineSentenceStandard": "This agent is hired to give support reps a triage summary in under 2 minutes and must always deliver 3 confident bullets naming the issue, likely cause, and urgency — never hedge, never restate, never over-explain."
}
```
