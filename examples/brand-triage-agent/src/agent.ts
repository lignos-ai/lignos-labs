import dotenv from 'dotenv';
import { AgentGuard, cliUndoWindow } from '@lignos/governance';
import { parseInboundPitch } from './parser.js';
import { calculateCounterProposal } from './rules.js';
import { promptHumanCheckpoint, type DealReviewState } from './checkpoint.js';
import { dealRiskEngine } from './risk.js';
import type { CounterProposal } from './types.js';

dotenv.config();

interface CounterEmailDispatch {
  to: string;
  brand: string;
  counterRate: number;
  draftBody: string;
}

// Low blast radius: offer under the floor, no whitelisting, no exclusivity.
// Policy counters at $2,500 and risk stays LOW, so the run auto-dispatches into the time-lock.
const lowRiskEmail = `
Hey team! We're reaching out from Zenith Watches.
We love your content and want to sponsor 1 dedicated Instagram Reel next month.
Our starting budget is $2,200. We do not require any paid ad whitelisting or category exclusivity.
Let us know if you'd be interested!
`;

// High blast radius: exclusivity plus whitelisting on a sub-floor offer.
// Risk scores HIGH, so the run halts at the human checkpoint before any time-lock.
const highRiskEmail = `
Hi — Northwind Athletics here.
We want 1 Instagram Reel plus 30 days of paid whitelisting, and we need category exclusivity against other footwear brands.
Budget is $1,800. Can you lock this in this week?
`;

const highRisk = process.argv.includes('--high-risk');
const sampleEmail = highRisk ? highRiskEmail : lowRiskEmail;

const shouldHalt = (risk: { level: string }) => risk.level !== 'LOW';

const guard = new AgentGuard({
  dbPath: './vault.db',
  telemetrySink: './telemetry_stream.jsonl',
  defaultTimeLockSeconds: 10,
  timeLockInterceptor: cliUndoWindow(),
});

async function sendCounterEmail(actionId: string, payload: CounterEmailDispatch): Promise<void> {
  console.log(`\n🚀 [COMMITTED] Action [${actionId}] executed! Email sent to ${payload.brand} ($${payload.counterRate}).`);
}

async function runAgent() {
  console.log('======================================================');
  console.log('     AUTONOMOUS BRAND DEAL TRIAGE AGENT               ');
  console.log(`     ${highRisk ? 'HIGH-RISK → HUMAN CHECKPOINT' : 'LOW-RISK  → AUTO TIME-LOCK'}`.padEnd(54));
  console.log('======================================================\n');

  // Check for any actions that matured while the agent was down
  const recovery = await guard.drainMaturedActions(async (action) => {
    await sendCounterEmail(action.id, action.payload as CounterEmailDispatch);
    console.log(`[CRASH-RECOVERY] Successfully executed pending job ${action.id}: "${action.description}"`);
  });
  if (recovery.inDoubt.length > 0) {
    console.warn(`[CRASH-RECOVERY] ${recovery.inDoubt.length} action(s) were mid-dispatch at crash; reconcile manually: ${recovery.inDoubt.join(', ')}`);
  }

  console.log('1. INGESTION: Parsing inbound brand pitch (scratchpad first)...');
  const parsedPitch = await parseInboundPitch(sampleEmail);
  console.log(`✓ Scratchpad:      ${parsedPitch.analysisScratchpad}`);
  console.log(`✓ Extracted Brand: ${parsedPitch.brandName}`);
  console.log(`✓ Deliverables:    ${parsedPitch.deliverables.join(', ')}`);
  console.log(`✓ Offered Budget:  $${parsedPitch.offeredBudgetUsd ?? 'None specified'}\n`);

  console.log('2. POLICY: Calculating counter proposal...');
  const stagedProposal = calculateCounterProposal(parsedPitch);
  console.log(`✓ Staged Counter:  $${stagedProposal.counterRateUsd}`);
  console.log(`✓ Whitelisting:    ${stagedProposal.whitelistingApproved ? 'Approved' : 'Declined'}`);
  console.log(`✓ Exclusivity:     ${stagedProposal.exclusivityAccepted ? 'Accepted' : 'Declined'}\n`);

  console.log('3. GOVERNANCE: Evaluating operational risk score...');
  const riskAssessment = dealRiskEngine.evaluate({
    offeredBudgetUsd: parsedPitch.offeredBudgetUsd,
    counterRateUsd: stagedProposal.counterRateUsd,
    exclusivityRequested: parsedPitch.exclusivityRequested,
    whitelistingRequested: parsedPitch.whitelistingRequested,
  });
  console.log(`✓ Risk Level:      [${riskAssessment.level}] (Score: ${riskAssessment.score}/100)`);
  if (riskAssessment.reasons.length > 0) {
    console.log(`  Reasons:         ${riskAssessment.reasons.join(' | ')}`);
  }
  console.log(`✓ Routing Action:  ${shouldHalt(riskAssessment) ? '⚠️  HALT FOR HUMAN REVIEW' : '⚡ AUTO-ROUTE TO TIME-LOCK'}\n`);

  console.log('4-5. SUPERVISION + TIME-LOCK: Handing off to @lignos/governance...');
  const result = await guard.executeWithGovernance<DealReviewState, CounterProposal, CounterEmailDispatch>({
    stepId: 'brand_pitch_counter',
    beforeState: { pitch: parsedPitch, stagedProposal, riskAssessment },
    proposedState: stagedProposal,
    riskScore: riskAssessment.score,
    riskLevel: riskAssessment.level,
    checkpoint: { prompt: promptHumanCheckpoint, shouldHalt },
    timeLock: (finalProposal) => ({
      description: `Dispatch counter email to ${parsedPitch.contactPerson || parsedPitch.brandName} ($${finalProposal.counterRateUsd})`,
      payload: {
        to: parsedPitch.contactPerson || parsedPitch.brandName,
        brand: parsedPitch.brandName,
        counterRate: finalProposal.counterRateUsd,
        draftBody: finalProposal.draftEmailBody,
      },
    }),
    commit: sendCounterEmail,
  });

  if (result.status === 'REJECTED') {
    console.log('\n❌ Proposal rejected by operator. Aborting execution.');
  } else if (result.status === 'FAILED') {
    console.error(`\n💥 Action [${result.actionId}] failed during dispatch:`, result.error);
  }
  console.log(`\nOutcome: ${result.status} (route=${result.route}, decision=${result.decision}, mutationRatio=${result.mutationRatio})`);
}

runAgent()
  .catch(console.error)
  .finally(() => guard.close());
