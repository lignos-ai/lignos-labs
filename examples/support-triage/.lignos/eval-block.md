# Eval Block — Support Triage Summarizer

Generated from `.lignos/canvas.md`. Copy the sections below into your eval platform or LLM chat.

---

## Judge Prompt

```
You are evaluating outputs from an AI agent called "Support Triage Summarizer".

Job: Give support reps a concise triage of complex tickets so they can respond in under 2 minutes without reading the full thread.

Product Standard: Three bullets max. Each bullet is one confident, complete sentence. Sounds like your most experienced support rep — names the specific issue, likely cause, and urgency. Never hedges, never restates the customer's words.

Tone: Direct, confident
Format: 3 bullet points max, each a complete sentence
Rule: Never produce more than 3 bullets. Never use hedging language.

Anti-Pattern — automatic FAIL if present: Hedged language ("it seems like", "might", "possibly", "could be"), more than 3 bullet points, or restating what the customer said without triage insight.

Drift signals (any of these = FAIL):
- "it seems like"
- "possibly"
- "might be experiencing"
- "could be related to"
- 4 or more bullet points
- no specific issue named — just rephrasing the ticket

Value Signal: The rep can act on the summary immediately without asking a follow-up question about something already in the ticket.

Evaluate the output provided. Respond with: PASS or FAIL / One sentence explaining why.
```

---

## Scenario Seeds

**Seed 1 — Anti-pattern trigger (expect FAIL)**
> Input: "Hi, I've been trying to upload a CSV file for the last hour and keep getting a 'file format not supported' error even though the file is definitely a CSV. I've tried renaming it and re-exporting from Excel. Nothing works. I need this data in by end of day for a board meeting."

Watch for: hedging language or restating the problem without naming a cause.

---

**Seed 2 — Anti-pattern trigger (expect FAIL)**
> Input: "Our entire team got locked out of the admin panel this morning around 9am. We had a new person join yesterday and the IT admin tried to change their permissions and now nobody can log in. We have a demo in 3 hours."

Watch for: bullet dump with 5+ points, or vague bullets like "user is experiencing login issues."

---

**Seed 3 — Clean input (expect PASS)**
> Input: "User is on the Pro plan and can't export reports to PDF. The button appears grayed out. They've tried Chrome and Firefox. No recent plan changes."

Expect: 3 confident bullets — blocked PDF export, likely permissions or plan-level feature flag, low urgency.

---

**Seed 4 — Clean input (expect PASS)**
> Input: "API rate limit errors starting at 2pm today. User is on the Starter plan, 10k requests/month limit. They say they've only made 3k requests this month. Billing cycle resets next week."

Expect: 3 bullets — rate limit hit unexpectedly, discrepancy between usage and limit (possible counting bug or burst spike), medium urgency.

---

**Seed 5 — Edge case (expect PASS)**
> Input: "Customer says the mobile app crashes every time they try to open a specific project. Happens on both iOS and Android. Project was created 2 days ago. Other projects open fine."

Expect: 3 bullets — crash on specific project open, isolated to one project (likely data corruption or bad state), medium urgency.

---

## Blocking Assertion

Run this string-match check before the judge prompt. If any of these appear in the output, it's an automatic FAIL — no need to run the judge:

- `it seems like`
- `possibly`
- `might be experiencing`
- `could be related to`
- `may be`

These are the hedging phrases your standard explicitly prohibits.
