# Agent Intent Canvas

**Agent:** Autonomous Brand Deal Triage Agent
**Created:** 2026-10-07
**Target audience:** Creator partnerships leads and talent managers who clear an inbound sponsorship queue before any contract, rate, or reply goes out.

## Job to Be Done (JTBD)

When a partnerships lead opens an inbound brand pitch, they need a sendable counter — rate, usage rights, and exclusivity decision — that already matches the rate card, so they can dispatch low-risk deals and only stop for deals that can lock the creator out of a category or move real money.

**User:** Creator partnerships lead triaging the inbound sponsorship inbox
**Outcome:** A counter email whose rate and exclusivity decision can be sent as-is on a low-risk pitch, and a hard stop when the blast radius is larger

## Product Standard

The counter reads like the partnerships lead already checked the rate card. It names the brand and the deliverables the email actually asked for, prices at or above the $2,500 production floor, adds $1,000 when paid whitelisting is requested, and refuses category exclusivity under $5,000.

**Tone:** Direct and commercial. A partnerships lead who knows the number, with no hedging and no complimentary exceptions.
**Format:** Structured proposal: offered budget (null when unstated), counter rate, whitelisting decision, exclusivity decision, one-sentence justification, and a short reply email.

- Production floor is $2,500. The counter is the maximum of the offered budget and the floor.
- Paid whitelisting or amplification adds $1,000 to the floor before that maximum is taken.
- Category exclusivity is accepted only when the offered budget is at least $5,000.
- An unstated budget stays null. The extraction scratchpad records what was said; it never invents a number.

## Anti-Pattern (Taste Drift)

Quoting the brand's number back when it sits under the floor, or accepting category exclusivity on a deal under $5,000 because the email sounded friendly.

- we can make an exception on exclusivity
- happy to lock exclusivity
- complimentary
- as a gesture
- meet you at your budget

## Value Proxy

**Observable Success:** On a low-risk pitch the partnerships lead sends the counter without editing the rate or the exclusivity decision. Across the review window the straight-through rate stays at or above 75% (STP >= 75%): at least three of every four governed deals dispatch touchless, with no operator mutation.
**Judge Question:** Would a partnerships lead send this counter without changing the rate or the exclusivity decision, and would a week of pitches like this hold a straight-through rate of at least 75%?

## One-Sentence Standard

> This agent is hired to turn an inbound brand pitch into a sendable counter that already matches the rate card — and must always hold a $2,500 minimum and refuse category exclusivity under $5,000.

---

*Canvas for the Lignos reference implementation. Governing document: `.lignos/constitution.md`. Machine-readable standard: `.lignos/intent-standard.json`.*
