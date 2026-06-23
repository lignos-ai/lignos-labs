# Intent Standard — API contract (v1)

**Canonical object:** one agent’s Product Standard, shared by Labs, eval export, and Studio.

| File | Purpose |
|------|---------|
| [`intent-standard.schema.json`](intent-standard.schema.json) | JSON Schema — validate at API boundary |
| [`intent-standard.example.json`](intent-standard.example.json) | **Handoff fixture** — Cursor builds UI against this until API lands |

**TypeScript mirrors (keep in sync with schema):**

| Location | Owner |
|----------|-------|
| `mcp-server/src/intent-standard.ts` | Claude — parse, validate, generate from `.lignos/` |
| `mcp-server/studio-ui/src/types/studio.ts` → `IntentStandard` | Cursor — display only; no parsing markdown in UI |

---

## API (Slice 1 — agreed contract)

### `POST /api/intent/import`

Import from a `.lignos/` directory on the server filesystem or from uploaded files.

**Request (v1 — multipart):**

| Field | Type | Required |
|-------|------|----------|
| `canvas` | file | yes |
| `manifest` | file | no |
| `constitution` | file | no |

**Request (v1 — JSON alternative for tests):**

```json
{
  "canvasMarkdown": "# Agent Intent Canvas\n...",
  "manifestYaml": "apiVersion: lignos/v1\n...",
  "constitutionMarkdown": "# Agent Constitution\n..."
}
```

**Response `200`:** `IntentStandard` (see example JSON).

**Response `4xx`:** `{ "error": string, "details"?: string[] }`

### `GET /api/intent/standard`

Returns the active Product Standard for the workspace, or `404` if none imported.

**Response `200`:** `IntentStandard`

### `GET /api/intent/standard/:intentId`

Returns standard for one agent when multiple are supported (Slice 3+). Slice 1 may only support one active standard.

---

## Vertical slices

See [`ROADMAP.md`](../../ROADMAP.md) → **Vertical slices (contract-first)**.

| Slice | UI | API / engine |
|-------|-----|----------------|
| **1** | Intent Card shows `oneSentenceStandard` | Import canvas → return standard |
| **2** | Anti-pattern label on drift copy | `antiPattern` on `economic-summary` + compliance rows; `anti_pattern_guard` at verify |
| **3** | Manifest on governed workflow + per-intent standard | `GET /intent/standard/:id`, `POST /manifests/from-standard` |
| **4** | “Add to eval suite” CTA | `eval.scenarioSeeds` + export |

---

## Five dimensions (vocabulary lock)

Use these ids everywhere (`/lignos-score`, Studio, `eval.dimensions`):

| Id | Label |
|----|-------|
| `jtbd_fit` | JTBD fit |
| `standard_adherence` | Standard adherence |
| `anti_pattern_guard` | Anti-pattern guard |
| `value_signal` | Value signal |
| `structural_integrity` | Structural integrity |

---

## Rules

1. **UI never parses** `canvas.md` — engine returns `IntentStandard`.
2. **Validate** all API responses against `intent-standard.schema.json`.
3. **Extend** schema with optional fields only; bump `schemaVersion` for breaking changes.
4. **Delete UI fixtures** once `GET /api/intent/standard` is wired — do not maintain two shapes.
