import OpenAI from 'openai';
import dotenv from 'dotenv';
import { type BrandPitch } from './types.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function parseInboundPitch(rawEmailText: string): Promise<BrandPitch> {
  const jsonSchema = {
    name: 'pitch_extraction',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        analysisScratchpad: {
          type: 'string',
          description: 'Reason step-by-step: 1) Identify sender and brand. 2) List explicit deliverables. 3) Note if budget is stated or unstated (null if unstated). 4) Check for paid ad whitelisting. 5) Check for category exclusivity.'
        },
        brandName: {
          type: 'string',
          description: 'The clean brand or company name'
        },
        contactPerson: {
          type: ['string', 'null'],
          description: 'Name of sender if mentioned, or null'
        },
        deliverables: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of requested deliverables, e.g. ["1 Instagram Reel"]'
        },
        offeredBudgetUsd: {
          type: ['integer', 'null'],
          description: 'Offered compensation in integer USD, or null if unstated'
        },
        timelineWeeks: {
          type: ['integer', 'null'],
          description: 'Delivery timeline in weeks, or null if unstated'
        },
        whitelistingRequested: {
          type: 'boolean',
          description: 'True if brand asks to run paid ads or whitelisting'
        },
        exclusivityRequested: {
          type: 'boolean',
          description: 'True if brand asks creator not to work with competitors'
        }
      },
      required: [
        'analysisScratchpad',
        'brandName',
        'contactPerson',
        'deliverables',
        'offeredBudgetUsd',
        'timelineWeeks',
        'whitelistingRequested',
        'exclusivityRequested'
      ],
      additionalProperties: false
    }
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.0,
    messages: [
      {
        role: 'system',
        content: 'You analyze and extract sponsorship pitch details into strict JSON. Always reason step-by-step in analysisScratchpad first. Never fabricate numbers; use null when unstated.'
      },
      {
        role: 'user',
        content: rawEmailText
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: jsonSchema
    }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  const parsed = JSON.parse(content);

  return {
    analysisScratchpad: parsed.analysisScratchpad,
    brandName: parsed.brandName,
    contactPerson: parsed.contactPerson ?? undefined,
    deliverables: parsed.deliverables,
    offeredBudgetUsd: parsed.offeredBudgetUsd,
    timelineWeeks: parsed.timelineWeeks,
    whitelistingRequested: parsed.whitelistingRequested,
    exclusivityRequested: parsed.exclusivityRequested,
    rawEmailText
  };
}
