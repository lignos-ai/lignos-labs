# `/lignos-scope` — Instrumentation Snippet

Reads the LignosManifest and produces a single, complete, ready-to-paste code block that instruments your agent with `intent_scope` and `milestone` calls. No placeholders — paste and run.

## Usage

```
/lignos-scope
/lignos-scope async
/lignos-scope sync
/lignos-scope decorator
```

Pass a style argument to skip the style question.

## Prerequisites

`.lignos/manifest.yaml` must exist. Run `/lignos-govern` first.

## What it does

1. Reads `.lignos/manifest.yaml` for `intentId`, `manifest_version`, and the milestone list.
2. Reads `.lignos/canvas.md` for the agent name and one-sentence standard (used in code comments).
3. Asks which code style fits your codebase (if not passed as an argument).
4. Produces a complete snippet — every milestone from the manifest appears as a call in the output.
5. Shows the three `.env` variables to add.

## Style options

### `async` — context managers, async (default for LangChain / OpenAI SDK)

```python
from lignos import intent_scope, milestone

async def run(self, input):
    async with intent_scope("my-agent", manifest_version="1.0.0"):
        async with milestone("ingest-input"):
            # load and validate the incoming input
            pass
        async with milestone("classify-intent"):
            # determine the intent or category of the input
            pass
        async with milestone("generate-summary"):
            # produce the final output
            pass
```

### `sync` — context managers, sync

```python
from lignos import sync_intent_scope, sync_milestone

def run(self, input):
    with sync_intent_scope("my-agent", manifest_version="1.0.0"):
        with sync_milestone("ingest-input"):
            pass
```

### `decorator` — async decorators

```python
from lignos import lignos_intent, lignos_milestone

@lignos_intent("my-agent", manifest_version="1.0.0")
async def run(self, input):
    ...

@lignos_milestone("ingest-input")
async def ingest_input(self, ...):
    # load and validate the incoming input
    ...
```

## Output

A complete snippet containing:

- `setup_lignos()` — one-time OTLP exporter setup; call this at app startup (e.g., in `main.py` or your app factory)
- The governed entry point with `intent_scope` wrapping all milestone calls
- One inline comment per milestone describing what that step does

Plus the three `.env` lines to add:

```
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_TRACES_EXPORTER=otlp
OTEL_SERVICE_NAME=my-agent
```

## After pasting

1. Call `setup_lignos()` once at startup.
2. Add the three env vars to your `.env`.
3. Run `/lignos-score` before shipping — evaluates your implementation against the canvas standard.

When Lignos Studio launches, it will verify each session against your manifest automatically — milestone progress and drift findings against the same anti-pattern you defined in the canvas.

## Next step

```
/lignos-score
```
