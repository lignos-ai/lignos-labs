import fs from 'fs';
import path from 'path';

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

interface AdoptionScorecard {
  totalEvents: number;
  interactionCounts: {
    APPROVED: number;
    MUTATED: number;
    REJECTED: number;
  };
  touchlessRate: number;
  interventionRate: number;
  avgSupervisionLatencyMs: number;
  medianSupervisionLatencyMs: number;
  avgMutationRatio: number;
  mostMutatedPaths: Record<string, number>;
  delegationMaturityTier: string;
  adoptionRiskVerdict: 'LOW_RISK' | 'MODERATE_FRICTION' | 'CRITICAL_ABANDONMENT_RISK';
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function analyzeSupervisionEconomics(events: ZeroPayloadTelemetryEvent[]): AdoptionScorecard {
  if (events.length === 0) {
    throw new Error('No telemetry events found for adoption analysis.');
  }

  const counts = { APPROVED: 0, MUTATED: 0, REJECTED: 0 };
  const latencies: number[] = [];
  const mutationRatios: number[] = [];
  const pathFrequencies: Record<string, number> = {};

  for (const ev of events) {
    counts[ev.interactionType] = (counts[ev.interactionType] || 0) + 1;
    latencies.push(ev.supervisionLatencyMs);

    if (ev.interactionType === 'MUTATED') {
      mutationRatios.push(ev.mutationRatio);
      for (const field of ev.mutatedPaths) {
        pathFrequencies[field] = (pathFrequencies[field] || 0) + 1;
      }
    }
  }

  const total = events.length;
  const touchlessRate = (counts.APPROVED / total) * 100;
  const interventionRate = ((counts.MUTATED + counts.REJECTED) / total) * 100;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const medianLatency = calculateMedian(latencies);
  const avgMutationRatio = mutationRatios.length > 0
    ? mutationRatios.reduce((a, b) => a + b, 0) / mutationRatios.length
    : 0;

  let delegationMaturityTier = 'Tier 1: Mandatory Human In The Loop';
  if (touchlessRate >= 80 && avgMutationRatio < 0.1) {
    delegationMaturityTier = 'Tier 3: Autonomous (Straight-Through Enabled)';
  } else if (touchlessRate >= 50 && avgMutationRatio < 0.25) {
    delegationMaturityTier = 'Tier 2: Reversible Guarded (Time-Lock Primary)';
  }

  let adoptionRiskVerdict: 'LOW_RISK' | 'MODERATE_FRICTION' | 'CRITICAL_ABANDONMENT_RISK' = 'LOW_RISK';
  if (interventionRate > 60 || avgLatency > 45000) {
    adoptionRiskVerdict = 'CRITICAL_ABANDONMENT_RISK';
  } else if (interventionRate > 30 || avgLatency > 20000) {
    adoptionRiskVerdict = 'MODERATE_FRICTION';
  }

  return {
    totalEvents: total,
    interactionCounts: counts,
    touchlessRate: Number(touchlessRate.toFixed(1)),
    interventionRate: Number(interventionRate.toFixed(1)),
    avgSupervisionLatencyMs: Math.round(avgLatency),
    medianSupervisionLatencyMs: Math.round(medianLatency),
    avgMutationRatio: Number(avgMutationRatio.toFixed(3)),
    mostMutatedPaths: pathFrequencies,
    delegationMaturityTier,
    adoptionRiskVerdict,
  };
}

async function run() {
  const telemetryPath = path.join(process.cwd(), 'telemetry_stream.jsonl');

  if (!fs.existsSync(telemetryPath)) {
    console.error(`Telemetry stream missing at: ${telemetryPath}`);
    process.exit(1);
  }

  const lines = fs.readFileSync(telemetryPath, 'utf-8').trim().split('\n').filter(Boolean);
  // Pre-SDK lines have no eventType; SDK lines also include timelock.* lifecycle events.
  const events: ZeroPayloadTelemetryEvent[] = lines
    .map((l) => JSON.parse(l) as ZeroPayloadTelemetryEvent)
    .filter((e) => e.eventType === undefined || e.eventType === 'governance.decision');

  const report = analyzeSupervisionEconomics(events);

  console.log('======================================================');
  console.log('       LAYER 4: SUPERVISION ECONOMICS SCORECARD       ');
  console.log('       (Zero-PII Human-Agent Adoption Analytics)      ');
  console.log('======================================================\n');

  console.log(`Transactions Analyzed:     ${report.totalEvents}`);
  console.log(`Current Delegation Tier:   ${report.delegationMaturityTier}`);
  console.log(`Adoption Risk Profile:     [${report.adoptionRiskVerdict}]\n`);

  console.log('--- 1. DELEGATION & TOUCHLESS RATIOS ---');
  console.log(`  Straight-Through (Touchless): ${report.touchlessRate}%`);
  console.log(`  Operator Interventions:       ${report.interventionRate}%`);
  console.log(`  Approvals: ${report.interactionCounts.APPROVED} | Mutations: ${report.interactionCounts.MUTATED} | Rejections: ${report.interactionCounts.REJECTED}\n`);

  console.log('--- 2. COGNITIVE TAX & LATENCY ---');
  console.log(`  Average Review Dwell Time:    ${(report.avgSupervisionLatencyMs / 1000).toFixed(1)}s`);
  console.log(`  Median Review Dwell Time:     ${(report.medianSupervisionLatencyMs / 1000).toFixed(1)}s\n`);

  console.log('--- 3. ALIGNMENT DISTANCE ---');
  console.log(`  Average Mutation Magnitude:   ${(report.avgMutationRatio * 100).toFixed(1)}% of fields changed`);
  console.log('  Top Overridden Paths:');
  const sortedPaths = Object.entries(report.mostMutatedPaths).sort((a, b) => b[1] - a[1]);
  if (sortedPaths.length === 0) {
    console.log('    None (Zero mutations recorded)');
  } else {
    for (const [p, count] of sortedPaths) {
      console.log(`    - ${p}: ${count} override(s)`);
    }
  }

  console.log('\n======================================================');
  if (report.adoptionRiskVerdict === 'CRITICAL_ABANDONMENT_RISK') {
    console.log('⚠️  ACTION REQUIRED: High operator friction detected.');
    console.log('   The operator is spending high mental effort or frequently rewriting output.');
  } else if (report.adoptionRiskVerdict === 'MODERATE_FRICTION') {
    console.log('ℹ️  STATUS: Moderate operator friction.');
    console.log('   Interventions are stabilizing but still require review oversight.');
  } else {
    console.log('✓  STATUS: Low friction. System is progressing cleanly towards higher autonomy.');
  }
  console.log('======================================================\n');
}

run().catch((err) => {
  console.error('Analytics execution failed:', err);
});
