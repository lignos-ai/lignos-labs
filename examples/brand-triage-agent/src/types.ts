import { z } from 'zod';

export const BrandPitchSchema = z.object({
  analysisScratchpad: z.string().describe('Step-by-step extraction notes. Pricing is decided later by policy, never here.'),
  brandName: z.string().describe('The name of the brand or company reaching out'),
  contactPerson: z.string().optional().describe('Name of the person reaching out if mentioned'),
  deliverables: z.array(z.string()).describe('List of content items requested, e.g. ["1 Instagram Reel", "2 Stories"]'),
  offeredBudgetUsd: z.number().nullable().describe('Offered compensation in USD, or null if unstated'),
  timelineWeeks: z.number().nullable().describe('Desired delivery timeline in weeks from agreement'),
  whitelistingRequested: z.boolean().describe('True if brand asks to run paid ads/amplification through creator handles'),
  exclusivityRequested: z.boolean().describe('True if brand asks creator not to work with competitors'),
  rawEmailText: z.string().describe('Original email content')
});

export type BrandPitch = z.infer<typeof BrandPitchSchema>;
// Runtime placeholder so ESM named export resolution succeeds in Node 25
export const BrandPitch = {};

export interface CounterProposal {
  counterRateUsd: number;
  deliverables: string[];
  whitelistingApproved: boolean;
  exclusivityAccepted: boolean;
  justification: string;
  draftEmailBody: string;
}

export type Proposal = CounterProposal;
export const Proposal = {};
export const CounterProposal = {};
