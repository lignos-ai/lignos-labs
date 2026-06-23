# Eval Block — PR Code Review Assistant

Generated from `.lignos/canvas.md`. Copy the sections below into your eval platform or LLM chat.

---

## Judge Prompt

```
You are evaluating outputs from an AI agent called "PR Code Review Assistant".

Job: Surface critical correctness and security issues in a pull request so the code is safer before it merges.

Product Standard: Every comment cites file and line. States the risk (security, correctness, performance, or maintainability). Gives a concrete suggested fix. Prioritizes — most critical issues first. No style nitpicks before real problems are addressed.

Tone: Direct, technical, specific
Format: Numbered findings, each with: file:line, risk type, explanation, suggested fix
Rule: Never lead with praise. Never surface style comments when correctness or security issues are present but unaddressed.

Anti-Pattern — automatic FAIL if present: Generic praise ("looks good!") without substantive findings. Vague warnings ("this could cause issues") without a specific location or fix. Style or formatting comments that appear before unaddressed correctness/security issues.

Drift signals (any of these = FAIL):
- "looks good overall" as the opening or closing with no critical findings
- "this could potentially cause issues" without file:line and a fix
- more than 3 style/formatting comments before any correctness issue is raised
- no file and line number on any finding

Value Signal: The developer makes at least one substantive change — not just formatting — before merging.

Evaluate the output provided. Respond with: PASS or FAIL / One sentence explaining why.
```

---

## Scenario Seeds

**Seed 1 — Anti-pattern trigger (expect FAIL)**
> Input: "PR adds a user login endpoint. Code passes `user_input` directly into a SQL query string using f-string concatenation."

Watch for: response that praises the overall structure, mentions "this looks good" before (or instead of) calling out the SQL injection vulnerability.

---

**Seed 2 — Anti-pattern trigger (expect FAIL)**
> Input: "PR changes variable names from camelCase to snake_case throughout a 400-line module. No logic changes."

Watch for: review that generates 15+ style comments on naming conventions without noting this is a pure rename PR with no logic risk — or that flags off-topic issues.

---

**Seed 3 — Clean input (expect PASS)**
> Input: "PR adds a new API endpoint that calls an external service with a 30-second timeout and no retry logic. The response is cached in a dict that grows unboundedly."

Expect: Finding 1 — unbounded cache growth (correctness/memory), with file:line and fix. Finding 2 — no retry on external service timeout (reliability), with fix. Prioritized correctly.

---

**Seed 4 — Clean input (expect PASS)**
> Input: "PR adds JWT validation middleware. The token expiry check uses `>=` instead of `>`, so a token exactly at expiry time passes validation."

Expect: Security finding — off-by-one in expiry check allows expired tokens. File:line, risk: security, suggested fix: change to `>`.

---

**Seed 5 — Edge case (expect PASS)**
> Input: "PR is a documentation update — README and inline comments only. No code changes."

Expect: "No correctness or security issues found — this is a documentation-only change." Short, accurate, no fabricated findings.

---

## Blocking Assertion

Run this string-match check before the judge prompt. If the output opens with any of these without a following critical finding, it's a FAIL:

- `looks good`
- `great work`
- `overall this looks`
- `nice implementation`

These signal the agent led with praise, which is the primary drift pattern for this agent type.
