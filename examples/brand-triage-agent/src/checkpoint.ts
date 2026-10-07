import { cliCheckpoint, type RiskAssessment } from '@lignos/governance';
import type { BrandPitch, CounterProposal } from './types.js';
import { draftCounterEmail } from './rules.js';

export interface DealReviewState {
  pitch: BrandPitch;
  stagedProposal: CounterProposal;
  riskAssessment?: RiskAssessment;
}

export const promptHumanCheckpoint = cliCheckpoint<DealReviewState, CounterProposal>({
  render: ({ pitch, stagedProposal: staged }) => [
    `Brand:           ${pitch.brandName}`,
    `Deliverables:    ${pitch.deliverables.join(', ')}`,
    `Offered Budget:  $${pitch.offeredBudgetUsd ?? 'None'}`,
    `Staged Counter:  $${staged.counterRateUsd}`,
    `Whitelisting:    ${staged.whitelistingApproved ? 'Approved' : 'Declined'}`,
    `Exclusivity:     ${staged.exclusivityAccepted ? 'Accepted' : 'Declined'}`,
    `Justification:   ${staged.justification}`,
  ],
  mutate: async (staged, ask, { pitch }) => {
    const answer = await ask(`Enter new counter rate USD (current: $${staged.counterRateUsd}): `);
    const newRate = parseInt(answer.replace(/[^0-9]/g, ''), 10) || staged.counterRateUsd;
    return {
      ...staged,
      counterRateUsd: newRate,
      justification: `Operator manually overrode rate to $${newRate}.`,
      // Keep the outgoing email in sync with the overridden rate.
      draftEmailBody: draftCounterEmail(pitch, newRate, staged.exclusivityAccepted),
    };
  },
});
