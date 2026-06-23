# Eval Block — Marketing Content Generator

Generated from `.lignos/canvas.md`. Copy the sections below into your eval platform or LLM chat.

---

## Judge Prompt

```
You are evaluating outputs from an AI agent called "Marketing Content Generator".

Job: Turn a product feature brief into a customer-facing blog post or email that's at least 80% publishable — so the marketer edits sentences, not sections.

Product Standard: Active voice. Concrete examples over abstract claims. First paragraph opens with a specific, true claim — not a generic industry statement. No buzzwords without substance. Reads like a knowledgeable peer, not a content template.

Tone: Informed, direct, peer-level — not salesy
Format: Blog post or email as requested. Short paragraphs. No section headers unless the brief calls for them.
Rule: Never open with a generic industry statement. Never use "revolutionary", "game-changing", "next-generation", or "in today's [adjective] world" without an immediately following specific claim that earns the word.

Anti-Pattern — automatic FAIL if present: "In today's fast-paced world...", "revolutionary", "game-changing", "next-generation" (unearned), or a first paragraph that contains no specific product claim.

Drift signals (any of these = FAIL):
- "in today's fast-paced world"
- "in today's competitive landscape"
- "revolutionary" without an immediately following specific claim
- "game-changing" or "next-generation" used as standalone descriptors
- first paragraph ends without a specific, verifiable product claim
- passive voice in more than 2 sentences in the first 3 paragraphs

Value Signal: The marketer edits specific sentences — they don't rewrite or restructure. The draft ships with minor changes.

Evaluate the output provided. Respond with: PASS or FAIL / One sentence explaining why.
```

---

## Scenario Seeds

**Seed 1 — Anti-pattern trigger (expect FAIL)**
> Input: "Write an intro paragraph announcing our new AI-powered search feature for a product blog."

Watch for: "In today's fast-paced world, finding the right information quickly has never been more important..." or any opener that delays the product claim by more than one sentence.

---

**Seed 2 — Anti-pattern trigger (expect FAIL)**
> Input: "Write an email subject line and first paragraph for our new analytics dashboard. Position it as a competitive advantage."

Watch for: "game-changing", "revolutionary", or "next-generation" used as the lead claim without a specific feature or outcome following immediately.

---

**Seed 3 — Clean input (expect PASS)**
> Input: "Feature brief: Our new export feature lets users download any report as a CSV, PDF, or Slack message in one click. Available on Pro plan and above. Write a 2-paragraph announcement."

Expect: First paragraph opens with the specific capability and who it's for. Active voice. No buzzwords. Second paragraph handles the plan/availability detail.

---

**Seed 4 — Clean input (expect PASS)**
> Input: "Write a cold outreach email for a B2B SaaS product that helps engineering managers track deployment frequency. Keep it under 100 words."

Expect: Subject line with a specific claim. Email opens with the problem or result (not a compliment or generic opener). Under 100 words. Asks for one specific next step.

---

**Seed 5 — Edge case (expect PASS)**
> Input: "Rewrite this paragraph to be more direct: 'Our platform has been designed with the modern enterprise in mind, offering a comprehensive suite of tools that empower teams to achieve their goals more effectively and efficiently.'"

Expect: Active voice rewrite with a specific claim replacing the vague original. The output should be shorter and more concrete than the input.

---

## Blocking Assertion

Run this string-match check before the judge prompt. If any of these appear in the first paragraph, it's an automatic FAIL:

- `in today's fast-paced world`
- `in today's competitive landscape`
- `in today's digital age`
- `game-changing`
- `revolutionary` (when used as a standalone descriptor without a following specific claim)

These are the generic opener patterns this agent must never produce.
