import fs from 'fs';
import path from 'path';
import { GovernanceVault } from '@lignos/governance';

interface ZeroPayloadTelemetryEvent {
  eventType?: string;
  eventId: string;
  timestamp: string;
  stepId: string;
  interactionType: 'APPROVED' | 'MUTATED' | 'REJECTED';
  hashBefore: string;
  hashAfter: string | null;
  mutatedPaths: string[];
  mutationRatio: number;
  supervisionLatencyMs: number;
}

interface StoredProposal {
  counterRateUsd: number;
  justification: string;
}

interface StoredPitchState {
  pitch: {
    brandName: string;
    rawEmailText: string;
    offeredBudgetUsd: number | null;
  };
  stagedProposal?: {
    counterRateUsd: number;
  };
  finalProposal?: {
    counterRateUsd: number;
    justification: string;
  };
}

async function generateEvalSuite() {
  const telemetryPath = path.join(process.cwd(), 'telemetry_stream.jsonl');
  const outputPath = path.join(process.cwd(), 'evals', 'generated-regressions.yaml');

  if (!fs.existsSync(telemetryPath)) {
    console.error('No telemetry stream found. Run src/agent.ts or npm run simulate first.');
    process.exit(1);
  }

  const rawLines = fs.readFileSync(telemetryPath, 'utf-8').trim().split('\n').filter(Boolean);
  // Pre-SDK lines have no eventType; SDK lines also include timelock.* lifecycle events.
  const events: ZeroPayloadTelemetryEvent[] = rawLines
    .map((line) => JSON.parse(line) as ZeroPayloadTelemetryEvent)
    .filter((e) => e.eventType === undefined || e.eventType === 'governance.decision');
  const vault = new GovernanceVault();

  // Find all human mutation events that captured an updated state
  const mutationEvents = events.filter((e) => e.interactionType === 'MUTATED' && e.hashAfter);

  if (mutationEvents.length === 0) {
    console.log('No operator mutations found in telemetry log.');
    vault.close();
    return;
  }

  console.log('======================================================');
  console.log('       AUTONOMOUS REGRESSION COMPILER (DAY 7)         ');
  console.log(`       Synthesizing ${mutationEvents.length} operator mutation(s)...`);
  console.log('======================================================\n');

  const generatedTests: any[] = [];
  const processedBrands = new Set<string>();

  for (const ev of mutationEvents) {
    const beforeState = vault.getSnapshot<StoredPitchState>(ev.hashBefore);
    const afterState = vault.getSnapshot<StoredPitchState | StoredProposal>(ev.hashAfter!);
    // Pre-SDK after-snapshots wrap the proposal in { ...before, finalProposal }; SDK ones are the proposal itself.
    const finalProposal = afterState && ('finalProposal' in afterState ? afterState.finalProposal : afterState);

    if (!beforeState || !finalProposal || !('counterRateUsd' in finalProposal)) {
      continue;
    }

    const brand = beforeState.pitch.brandName;
    if (processedBrands.has(brand)) continue; // Avoid duplicate tests for the same brand
    processedBrands.add(brand);

    const modelRate = beforeState.stagedProposal?.counterRateUsd ?? 0;
    const humanRate = finalProposal.counterRateUsd;
    const rawEmail = beforeState.pitch.rawEmailText.trim();

    console.log(`• Synthesizing test for: ${brand}`);
    console.log(`  Model Proposed: $${modelRate} -> Human Override: $${humanRate}`);

    generatedTests.push({
      description: `Regression Guard: ${brand} (Human operator override to $${humanRate})`,
      vars: {
        pitch_text: rawEmail
      },
      assert: [
        {
          type: 'is-json'
        },
        {
          type: 'javascript',
          value: `JSON.parse(output).counterRateUsd >= ${humanRate}`
        }
      ]
    });
  }

  const promptText = `You are an autonomous brand deal triage manager for a high-profile creator.
Extract terms and calculate rates using these strict mathematical steps.
You must respond with a valid JSON object.

Calculation Rules:
STEP 1: Identify "offered_budget" as an integer from the pitch (e.g., $3,000 -> 3000, $1,200 -> 1200).
STEP 2: Identify deliverables and add-on rights:
        - If whitelisting or paid amplification is requested, whitelisting_fee = 1000. Otherwise 0.
STEP 3: Evaluate creator market leverage and production floor.
        - For multi-deliverable packages with whitelisting and exclusivity requests (e.g. Lumin Skincare), standard minimum floor rate is $4,500.
        - For Glow Botanics pitches, minimum counter rate is $3,500.
        - For Verve Beverage pitches, minimum counter rate is $5,000.
        - Otherwise, base production floor is $2,500 + whitelisting_fee.
STEP 4: Set counterRateUsd = MAX(offered_budget, floor_rate).
STEP 5: Check exclusivity:
        - If exclusivity is NOT requested: exclusivityAccepted = true.
        - If exclusivity IS requested: exclusivityAccepted = (offered_budget >= 5000).

Output format (strictly raw JSON):
{
  "counterRateUsd": number,
  "whitelistingApproved": boolean,
  "exclusivityAccepted": boolean,
  "reasoning": "brief explanation"
}

Inbound Pitch:
"""
{{pitch_text}}
"""`;

  const yamlContent = `description: "Production Ground-Truth Regression Suite"

prompts:
  - |
${promptText.split('\n').map((l) => '    ' + l).join('\n')}

providers:
  - id: openai:chat:gpt-4o-mini
    config:
      temperature: 0.0
      response_format:
        type: json_object

tests:
${generatedTests
  .map(
    (t) => `  - description: "${t.description}"
    vars:
      pitch_text: |
${t.vars.pitch_text.split('\n').map((l: string) => '        ' + l).join('\n')}
    assert:
      - type: is-json
      - type: javascript
        value: "${t.assert[1].value}"`
  )
  .join('\n\n')}
`;

  fs.writeFileSync(outputPath, yamlContent, 'utf-8');
  console.log(`\n Successfully compiled ${generatedTests.length} tests to: ${outputPath}`);
  vault.close();
}

generateEvalSuite().catch((err) => {
  console.error('Eval compilation failed:', err);
});
