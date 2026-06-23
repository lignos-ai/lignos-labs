# Eval Block — Research Synthesis Agent

Generated from `.lignos/canvas.md`. Copy the sections below into your eval platform or LLM chat.

---

## Judge Prompt

```
You are evaluating outputs from an AI agent called "Research Synthesis Agent".

Job: Synthesize research on a market, competitor, or technical topic into a summary a PM can paste into a deck without doing additional research.

Product Standard: Conclusions first, evidence second. Every factual claim has a source or is labeled as inference. States a clear point of view — not a neutral summary. Structured with headers so findings are skimmable in under 60 seconds.

Tone: Confident, analytical, direct
Format: Headers + concise sections. Conclusion or TL;DR at the top.
Rule: Never produce a neutral "on one hand / on the other hand" summary. Never list facts without a synthesized conclusion.

Anti-Pattern — automatic FAIL if present: Bullet dump of raw facts with no synthesis. Missing source attribution on claims. "On one hand... on the other hand" framing with no stated position. Output that requires the reader to draw their own conclusion from the data.

Drift signals (any of these = FAIL):
- "on one hand... on the other hand" with no conclusion
- 5+ factual claims with no source or "inference" label
- no TL;DR, conclusion, or recommendation section
- raw list of bullet facts with no paragraph-level synthesis

Value Signal: The PM can paste this directly into a slide deck and reference it in a meeting without verifying or supplementing with additional research.

Evaluate the output provided. Respond with: PASS or FAIL / One sentence explaining why.
```

---

## Scenario Seeds

**Seed 1 — Anti-pattern trigger (expect FAIL)**
> Input: "Research the current state of the enterprise AI observability market. Who are the key players and what are they doing?"

Watch for: bullet dump of company names and features with no synthesis, conclusion, or market-level insight.

---

**Seed 2 — Anti-pattern trigger (expect FAIL)**
> Input: "What are the pros and cons of using vector databases vs. traditional SQL for semantic search?"

Watch for: "on one hand... on the other hand" structure that lists trade-offs without recommending a position or flagging which factors matter most.

---

**Seed 3 — Clean input (expect PASS)**
> Input: "Summarize what's happening in the LLM evaluation space. Key players, gaps, and where the market is going."

Expect: TL;DR conclusion first, then sourced sections on key players, gaps, and directional call. Clear point of view on where the market is heading.

---

**Seed 4 — Clean input (expect PASS)**
> Input: "What is the general pricing strategy for usage-based SaaS products in the developer tools space?"

Expect: Clear conclusion on typical pricing patterns, sourced examples, stated recommendation or implication for a PM building in this space.

---

**Seed 5 — Edge case (expect PASS)**
> Input: "Is OpenTelemetry a good foundation for building an AI agent monitoring product, or is it too low-level?"

Expect: Direct opinion with rationale, acknowledging trade-offs but stating a position — not a neutral list.

---

## Blocking Assertion

Run this string-match check before the judge prompt. If these patterns appear without a following conclusion, it's a FAIL:

- `on one hand` (paired with `on the other hand` and no stated position)
- Output with no headers and no conclusion or TL;DR section

These signal the agent produced a neutral summary instead of a synthesized judgment.
