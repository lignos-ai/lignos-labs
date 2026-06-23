# `/lignos-score` — Pre-Ship Evaluation

Evaluates whether the agent as implemented will actually behave the way the PM intended when they filled out the canvas. Reads the canvas and constitution, takes your system prompt and entry point, and produces an honest pass/fail report across 5 dimensions before anything ships.

## Usage

```
/lignos-score
```

No arguments. Reads `.lignos/canvas.md` and `.lignos/constitution.md` automatically, then finds your entry point file.

## Before anything else — confirm you're in the right project

Print the current working directory. Say: *"Starting in `<cwd>` — is this the correct project? Reply yes to continue, or tell me the right folder."*

Do not proceed until the user confirms.

---

## Prerequisites

`.lignos/canvas.md` must exist. Run `/lignos-canvas` first.

`.lignos/constitution.md` should also exist (run `/lignos-govern` if it doesn't) — the system prompt lives there and is read automatically.

## What it does

Reads `.lignos/canvas.md` and `.lignos/constitution.md` automatically. Then looks for your agent's entry point file to check governance readiness. Nothing to paste.

Then evaluates across 5 dimensions:

| Dimension | What it checks |
|-----------|---------------|
| JTBD Coverage | Does the system prompt direct the agent toward the exact job, for the right user, toward the right outcome? |
| Standard Alignment | Does it encode the specific quality bar, tone, and constraints from the canvas — not generically? |
| Anti-Pattern Guard | Does it explicitly prevent the exact drift behavior described in the canvas? |
| Value Proxy Awareness | Does it include a self-check that reflects when a run was worth running? |
| Governance Readiness | Is `intent_scope` present? Are all required milestones instrumented? (Only if entry point was provided) |

Each dimension gets one of:
- `✓ Covered` — clearly addressed
- `⚠ Partial` — present but incomplete or too generic
- `✗ Missing` — not covered

`⚠ Partial` is not assigned charitably. Generic language that doesn't reflect the specific standard the PM described is `⚠ Partial`, not `✓ Covered`.

## Output

```
My Agent — Pre-Ship Evaluation
Standard: This agent is hired to [...] and must always [...]

Overall: Needs attention

JTBD Coverage         ✓  System prompt names the support rep situation and 2-min response goal.
Standard Alignment    ⚠  Length constraint present but tone ("confident, no hedging") is absent.
Anti-Pattern Guard    ✗  No prohibition targeting the over-explanation failure mode.
Value Proxy Awareness ✓  Self-check present: "would the rep act on this without follow-up?"
Governance Readiness  ⚠  intent_scope present; classify-intent milestone missing.

─────────────────────────────────────────────────
2 finding(s) before shipping:

1. Anti-Pattern Guard — The canvas says the specific failure is writing 400-word prose when
   3 bullets were needed, and hedging with "it seems like possibly." The system prompt has no
   prohibition targeting this. Under efficiency pressure, this is the most likely drift pattern.

2. Governance Readiness — The manifest declares classify-intent as a required milestone but
   the entry point has no milestone("classify-intent") call. When Lignos Studio launches,
   the milestone timeline will be incomplete. Run /lignos-scope to get the updated snippet.
─────────────────────────────────────────────────
```

## Overall judgments

| Judgment | Criteria |
|----------|----------|
| **Ready to ship** | All dimensions `✓` or `⚠ Partial` with minor gaps; no `✗ Missing` on dimensions 2, 3, or 4 |
| **Needs attention** | 1–2 dimensions `✗ Missing`; can ship after addressing findings |
| **At risk** | Dimension 3 (Anti-Pattern Guard) is `✗ Missing`, OR 3+ dimensions `✗ Missing`. Do not ship without addressing. |

A missing Anti-Pattern Guard is always a blocking finding. An agent without an explicit prohibition for its known failure mode will drift toward that failure under efficiency pressure.

## Patch offers

After the report, the skill asks if you want the exact sentences to add to your system prompt for each gap. It writes targeted additions — not a full rewrite — so your implementation voice is preserved.

Example:
```
# Add to your system prompt — Anti-Pattern Guard:
You never write prose when bullets will do.
You never qualify an obvious answer with hedging language ("it seems like", "possibly").
If the answer is clear from the available information, state it directly.
```

## Steps

**Step 1 — Read the canvas**

Read `.lignos/canvas.md`. If it does not exist, stop: *"No canvas found. Run `/lignos-canvas` first."*

Extract: `agent_name`, `jtbd`, `standard`, `anti_pattern`, `value_proxy`, `one_sentence_standard`.

**Step 2 — Read the constitution**

Read `.lignos/constitution.md`. Extract the text under `## System Prompt` — everything from that heading to the next `---` or end of file.

If `constitution.md` does not exist, say: *"No constitution found at `.lignos/constitution.md`. Run `/lignos-govern` first to generate it — or paste your system prompt here and I'll evaluate that instead."* Accept a paste as fallback.

**Step 3 — Find the entry point**

Look for the agent's main entry point file. Check in order:
- Any file the user has open or recently referenced in this session
- Common names: `agent.py`, `main.py`, `app.py`, `run.py`, `chain.py`, `handler.py`
- A `src/` subdirectory with the same names

Tell the user what you found: *"I found `[filename]` — is this the file where your agent calls the LLM? Say yes, give me a different path, or say skip to evaluate without it."*

If nothing is found: *"I didn't find an obvious entry point. Give me the file path, or say skip — I'll evaluate the system prompt only and flag Governance Readiness as unreviewed."*

**Step 4 — Evaluate**

Run the evaluation across all 5 dimensions using the extracted system prompt and entry point (if provided).

**Step 5 — Patch offers**

After the report, ask: *"Want the exact sentences to add for each gap? I'll write targeted additions — not a rewrite — so your implementation voice is preserved."*

## Re-running

Run `/lignos-score` again after addressing findings to confirm before shipping. The skill reads the current canvas and constitution each time — it tracks the standard, not the history.

## After score

Ship. Then run `/lignos-scope` to instrument your entry point with `intent_scope` and milestone calls — ready for when Lignos Studio launches and verifies sessions against your manifest automatically.
