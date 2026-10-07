import { PolicyRiskEngine } from '@lignos/governance';

export interface EvaluatedDealContext {
  offeredBudgetUsd: number | null;
  counterRateUsd: number;
  exclusivityRequested: boolean;
  whitelistingRequested: boolean;
}

export const dealRiskEngine = new PolicyRiskEngine<EvaluatedDealContext>({
  thresholds: { medium: 25, high: 40 },
  rules: [
    // 1. High Financial Value / Blast Radius
    {
      id: 'high_financial_value',
      when: (c) => c.counterRateUsd >= 5000,
      weight: 45,
      reason: (c) => `High financial value ($${c.counterRateUsd} >= $5,000 threshold)`,
    },
    {
      id: 'moderate_financial_value',
      when: (c) => c.counterRateUsd >= 3500 && c.counterRateUsd < 5000,
      weight: 20,
      reason: (c) => `Moderate financial value ($${c.counterRateUsd} >= $3,500)`,
    },
    // 2. High Legal / Exclusivity Risk
    {
      id: 'exclusivity_requested',
      when: (c) => c.exclusivityRequested,
      weight: 40,
      reason: 'Category exclusivity requested (locks out competing sponsors)',
    },
    // 3. Paid Amplification / Whitelisting
    {
      id: 'whitelisting_requested',
      when: (c) => c.whitelistingRequested,
      weight: 15,
      reason: 'Ad whitelisting requested (requires ad account access and usage terms)',
    },
    // 4. Missing Initial Budget (Unanchored Negotiation)
    {
      id: 'unanchored_budget',
      when: (c) => c.offeredBudgetUsd === null || c.offeredBudgetUsd === 0,
      weight: 25,
      reason: 'No initial budget provided by brand (cold discovery negotiation)',
    },
  ],
});
