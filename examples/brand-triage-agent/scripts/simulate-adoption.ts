import fs from 'fs';
import path from 'path';
import { GovernanceVault } from '@lignos/governance';

interface ZeroPayloadTelemetryEvent {
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

async function simulateAdoptionBatch() {
  const telemetryPath = path.join(process.cwd(), 'telemetry_stream.jsonl');
  const vault = new GovernanceVault();

  console.log('======================================================');
  console.log('      SIMULATING 10-TRANSACTION ADOPTION LIFECYCLE    ');
  console.log('======================================================\n');

  const scenarios = [
    {
      brand: 'Glow Botanics',
      budget: 1500,
      stagedRate: 2500,
      interactionType: 'MUTATED' as const,
      mutatedPaths: ['counterRateUsd', 'justification'],
      finalRate: 3500,
      dwellMs: 38200,
      ratio: 0.286
    },
    {
      brand: 'Aura Supplements',
      budget: 4000,
      stagedRate: 4000,
      interactionType: 'REJECTED' as const,
      mutatedPaths: ['status'],
      finalRate: 0,
      dwellMs: 29400,
      ratio: 0.143
    },
    {
      brand: 'Apex Athletics',
      budget: 3000,
      stagedRate: 3000,
      interactionType: 'MUTATED' as const,
      mutatedPaths: ['exclusivityAccepted'],
      finalRate: 3000,
      dwellMs: 22100,
      ratio: 0.143
    },
    {
      brand: 'Nordic Cleanse',
      budget: 2500,
      stagedRate: 2500,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 2500,
      dwellMs: 14200,
      ratio: 0.0
    },
    {
      brand: 'Solaris Energy',
      budget: 3500,
      stagedRate: 3500,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 3500,
      dwellMs: 11800,
      ratio: 0.0
    },
    {
      brand: 'Verve Beverage',
      budget: 4500,
      stagedRate: 4500,
      interactionType: 'MUTATED' as const,
      mutatedPaths: ['counterRateUsd'],
      finalRate: 5000,
      dwellMs: 9400,
      ratio: 0.143
    },
    {
      brand: 'Kroma Apparel',
      budget: 3000,
      stagedRate: 3000,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 3000,
      dwellMs: 6800,
      ratio: 0.0
    },
    {
      brand: 'Zenith Watches',
      budget: 6000,
      stagedRate: 6000,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 6000,
      dwellMs: 4200,
      ratio: 0.0
    },
    {
      brand: 'Peak Hydration',
      budget: 3500,
      stagedRate: 3500,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 3500,
      dwellMs: 3500,
      ratio: 0.0
    },
    {
      brand: 'Timber & Iron Outdoors',
      budget: 5000,
      stagedRate: 5000,
      interactionType: 'APPROVED' as const,
      mutatedPaths: [],
      finalRate: 5000,
      dwellMs: 2900,
      ratio: 0.0
    }
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i]!;
    const timestamp = new Date(Date.now() - (10 - i) * 3600000).toISOString();

    const beforeState = {
      pitch: {
        brandName: s.brand,
        contactPerson: 'Partnerships Lead',
        deliverables: ['1 dedicated Instagram Reel'],
        offeredBudgetUsd: s.budget,
        rawEmailText: `Inbound pitch from ${s.brand} with budget $${s.budget}.`
      },
      stagedProposal: {
        counterRateUsd: s.stagedRate,
        justification: `Standard base calculation of $${s.stagedRate}.`
      }
    };

    const hashBefore = vault.putSnapshot(beforeState);

    let hashAfter: string | null = null;
    if (s.interactionType === 'MUTATED') {
      const afterState = {
        ...beforeState,
        finalProposal: {
          counterRateUsd: s.finalRate,
          justification: `Operator adjusted counter rate to $${s.finalRate}.`
        }
      };
      hashAfter = vault.putSnapshot(afterState);
    }

    const event: ZeroPayloadTelemetryEvent = {
      eventId: `sim_${Date.now()}_${i + 1}`,
      timestamp,
      stepId: 'brand_pitch_counter',
      interactionType: s.interactionType,
      hashBefore,
      hashAfter,
      mutatedPaths: s.mutatedPaths,
      mutationRatio: s.ratio,
      supervisionLatencyMs: s.dwellMs
    };

    fs.appendFileSync(telemetryPath, JSON.stringify(event) + '\n', 'utf-8');
    console.log(`[Batch ${String(i + 1).padStart(2, '0')}/10] ${s.brand.padEnd(24)} | ${s.interactionType.padEnd(8)} | Dwell: ${(s.dwellMs / 1000).toFixed(1)}s`);
  }

  vault.close();
  console.log('\nSimulation complete: 10 transactions appended to telemetry_stream.jsonl.');
}

simulateAdoptionBatch().catch(console.error);
