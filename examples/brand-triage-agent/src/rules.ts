import type { BrandPitch, CounterProposal } from './types.js';

export function calculateCounterProposal(pitch: BrandPitch): CounterProposal {
  const baseRate = 2500;
  const whitelistingFee = pitch.whitelistingRequested ? 1000 : 0;
  const floorRate = baseRate + whitelistingFee;

  // Rule: Exclusivity locked out unless budget exceeds $5,000
  const offered = pitch.offeredBudgetUsd ?? 0;
  const exclusivityAccepted = pitch.exclusivityRequested ? offered >= 5000 : true;

  // Rate logic: Counter at MAX(offered, floorRate)
  const counterRateUsd = Math.max(offered, floorRate);

  const justification = `Standard base of $${baseRate}` +
    (whitelistingFee > 0 ? ` + $${whitelistingFee} for whitelisting rights.` : '.') +
    (!exclusivityAccepted ? ' Exclusivity clause declined due to rate floor.' : '');

  const draftEmailBody = draftCounterEmail(pitch, counterRateUsd, exclusivityAccepted);

  return {
    counterRateUsd,
    deliverables: pitch.deliverables,
    whitelistingApproved: pitch.whitelistingRequested,
    exclusivityAccepted,
    justification,
    draftEmailBody
  };
}

export function draftCounterEmail(pitch: BrandPitch, counterRateUsd: number, exclusivityAccepted: boolean): string {
  return `Hi ${pitch.contactPerson || pitch.brandName},\n\n` +
    `Thanks for reaching out! We'd love to partner on ${pitch.deliverables.join(' and ')}. ` +
    `Our standard package rate for these deliverables is $${counterRateUsd}. ` +
    (pitch.exclusivityRequested && !exclusivityAccepted
      ? `Please note that category exclusivity is reserved for broader multi-month campaigns.\n\n`
      : `\n\n`) +
    `Looking forward to collaborating!\nBest,\nPartnerships Team`;
}
