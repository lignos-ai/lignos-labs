import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Compile `.lignos/intent-standard.json` into a Promptfoo suite.
 *
 * Scenario lines that start with `js:` become deterministic `javascript`
 * assertions. Anti-pattern signals and "Do not use the phrase:" blocking
 * rules become `not-contains` assertions. Everything else is judged with
 * the standard's judge prompt.
 */

interface ScenarioSeed {
  id: string;
  inputSketch: string;
  expectedBehavior: string;
  failureMode: string;
}

interface IntentStandard {
  schemaVersion: string;
  intentId: string;
  displayName: string;
  oneSentenceStandard: string;
  jtbd: { situation: string; user: string; outcome: string };
  productStandard: { summary: string; tone: string; format?: string; constraints: string[] };
  antiPattern: { description: string; signals: string[]; examples?: string[] };
  valueProxy: { observableSuccess: string; judgeQuestion: string };
  eval?: {
    judgePrompt?: string;
    dimensions?: string[];
    scenarioSeeds?: ScenarioSeed[];
    blockingAssertions?: string[];
  };
}

interface Assertion {
  type: 'is-json' | 'not-contains' | 'javascript' | 'llm-rubric';
  value?: string;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const standardPath = path.join(root, '.lignos', 'intent-standard.json');
const outputPath = path.join(root, 'evals', 'promptfoo-suite.yaml');

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, where: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${where}.${key} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(record: Record<string, unknown>, key: string, where: string): string[] {
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    fail(`${where}.${key} must be an array of non-empty strings`);
  }
  return value;
}

function loadStandard(filePath: string): IntentStandard {
  if (!fs.existsSync(filePath)) {
    fail(`Intent standard not found at ${filePath}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Intent standard is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!isRecord(parsed)) fail('Intent standard must be a JSON object');
  if (parsed.schemaVersion !== '1.0.0') fail('schemaVersion must be "1.0.0"');

  const jtbd = parsed.jtbd;
  const productStandard = parsed.productStandard;
  const antiPattern = parsed.antiPattern;
  const valueProxy = parsed.valueProxy;
  if (!isRecord(jtbd) || !isRecord(productStandard) || !isRecord(antiPattern) || !isRecord(valueProxy)) {
    fail('jtbd, productStandard, antiPattern, and valueProxy are required objects');
  }

  const standard: IntentStandard = {
    schemaVersion: '1.0.0',
    intentId: requireString(parsed, 'intentId', 'intent'),
    displayName: requireString(parsed, 'displayName', 'intent'),
    oneSentenceStandard: requireString(parsed, 'oneSentenceStandard', 'intent'),
    jtbd: {
      situation: requireString(jtbd, 'situation', 'jtbd'),
      user: requireString(jtbd, 'user', 'jtbd'),
      outcome: requireString(jtbd, 'outcome', 'jtbd'),
    },
    productStandard: {
      summary: requireString(productStandard, 'summary', 'productStandard'),
      tone: requireString(productStandard, 'tone', 'productStandard'),
      format: typeof productStandard.format === 'string' ? productStandard.format : undefined,
      constraints: requireStringArray(productStandard, 'constraints', 'productStandard'),
    },
    antiPattern: {
      description: requireString(antiPattern, 'description', 'antiPattern'),
      signals: requireStringArray(antiPattern, 'signals', 'antiPattern'),
      examples: Array.isArray(antiPattern.examples) ? requireStringArray(antiPattern, 'examples', 'antiPattern') : undefined,
    },
    valueProxy: {
      observableSuccess: requireString(valueProxy, 'observableSuccess', 'valueProxy'),
      judgeQuestion: requireString(valueProxy, 'judgeQuestion', 'valueProxy'),
    },
  };

  if (parsed.eval !== undefined) {
    if (!isRecord(parsed.eval)) fail('eval must be an object');
    const seeds = parsed.eval.scenarioSeeds;
    standard.eval = {
      judgePrompt: typeof parsed.eval.judgePrompt === 'string' ? parsed.eval.judgePrompt : undefined,
      dimensions: Array.isArray(parsed.eval.dimensions) ? requireStringArray(parsed.eval, 'dimensions', 'eval') : undefined,
      blockingAssertions: Array.isArray(parsed.eval.blockingAssertions)
        ? requireStringArray(parsed.eval, 'blockingAssertions', 'eval')
        : undefined,
      scenarioSeeds: Array.isArray(seeds)
        ? seeds.map((seed, index) => {
            if (!isRecord(seed)) fail(`eval.scenarioSeeds[${index}] must be an object`);
            return {
              id: requireString(seed, 'id', `eval.scenarioSeeds[${index}]`),
              inputSketch: requireString(seed, 'inputSketch', `eval.scenarioSeeds[${index}]`),
              expectedBehavior: requireString(seed, 'expectedBehavior', `eval.scenarioSeeds[${index}]`),
              failureMode: requireString(seed, 'failureMode', `eval.scenarioSeeds[${index}]`),
            };
          })
        : undefined,
    };
  }

  return standard;
}

function quote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function block(value: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return value
    .replace(/\s+$/g, '')
    .split('\n')
    .map((line) => `${pad}${line}`)
    .join('\n');
}

function phraseBan(assertion: string): string | undefined {
  const match = assertion.match(/^Do not use the phrase:\s*(.+)$/i);
  return match?.[1]?.trim();
}

function assertionsFor(standard: IntentStandard, seed: ScenarioSeed): Assertion[] {
  const assertions: Assertion[] = [{ type: 'is-json' }];
  const seen = new Set<string>();

  const ban = (phrase: string) => {
    if (seen.has(phrase)) return;
    seen.add(phrase);
    assertions.push({ type: 'not-contains', value: phrase });
  };

  for (const signal of standard.antiPattern.signals) ban(signal);
  for (const rule of standard.eval?.blockingAssertions ?? []) {
    const phrase = phraseBan(rule);
    if (phrase) ban(phrase);
  }

  const prose: string[] = [];
  for (const line of seed.expectedBehavior.split('\n')) {
    if (line.startsWith('js:')) {
      assertions.push({ type: 'javascript', value: line.slice(3).trim() });
    } else if (line.trim()) {
      prose.push(line.trim());
    }
  }

  const judge = standard.eval?.judgePrompt ?? standard.oneSentenceStandard;
  const rubric = [
    judge.trim(),
    '',
    `Expected: ${prose.join(' ')}`,
    `Failure mode: ${seed.failureMode}`,
    `Judge question: ${standard.valueProxy.judgeQuestion}`,
    '',
    'Blocking rules:',
    ...(standard.eval?.blockingAssertions ?? []).map((rule) => `- ${rule}`),
  ].join('\n');
  assertions.push({ type: 'llm-rubric', value: rubric });
  return assertions;
}

function renderPrompt(standard: IntentStandard): string {
  const rules = standard.productStandard.constraints.map((rule) => `- ${rule}`).join('\n');
  const bans = standard.antiPattern.signals.map((signal) => `- ${signal}`).join('\n');
  const format = standard.productStandard.format ?? 'A JSON object and nothing else.';
  return [
    `You are the ${standard.displayName}.`,
    standard.oneSentenceStandard,
    '',
    `Job: ${standard.jtbd.situation}`,
    `User: ${standard.jtbd.user}`,
    `Outcome: ${standard.jtbd.outcome}`,
    '',
    `Product standard: ${standard.productStandard.summary}`,
    `Tone: ${standard.productStandard.tone}`,
    `Format: ${format}`,
    'Rules:',
    rules,
    '',
    `Never: ${standard.antiPattern.description}`,
    bans,
    '',
    'Respond with raw JSON only.',
    '',
    'Inbound pitch:',
    '"""',
    '{{pitch_text}}',
    '"""',
  ].join('\n');
}

function renderAssertion(assertion: Assertion, indent: number): string {
  const pad = ' '.repeat(indent);
  if (assertion.type === 'is-json') return `${pad}- type: is-json`;
  if (assertion.type === 'javascript' || assertion.type === 'not-contains') {
    return `${pad}- type: ${assertion.type}\n${pad}  value: ${quote(assertion.value ?? '')}`;
  }
  return [
    `${pad}- type: llm-rubric`,
    `${pad}  provider: openai:gpt-4o-mini`,
    `${pad}  value: |`,
    block(assertion.value ?? '', indent + 4),
  ].join('\n');
}

function renderSuite(standard: IntentStandard): string {
  const seeds = standard.eval?.scenarioSeeds ?? [];
  if (seeds.length === 0) fail('eval.scenarioSeeds must contain at least one scenario');

  const tests = seeds
    .map((seed) => {
      const body = assertionsFor(standard, seed).map((assertion) => renderAssertion(assertion, 6)).join('\n');
      return [
        `  - description: ${quote(seed.id)}`,
        '    vars:',
        '      pitch_text: |',
        block(seed.inputSketch, 8),
        '    assert:',
        body,
      ].join('\n');
    })
    .join('\n\n');

  return [
    `# Generated from .lignos/intent-standard.json by scripts/export-evals.ts.`,
    `# Re-run with: npm run evals:export`,
    `description: ${quote(`${standard.displayName} — ${standard.intentId}`)}`,
    'prompts:',
    '  - |',
    block(renderPrompt(standard), 4),
    'providers:',
    '  - id: openai:chat:gpt-4o-mini',
    '    config:',
    '      temperature: 0.0',
    '      response_format:',
    '        type: json_object',
    'tests:',
    tests,
    '',
  ].join('\n');
}

const standard = loadStandard(standardPath);
const suite = renderSuite(standard);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, suite, 'utf8');
const testCount = standard.eval?.scenarioSeeds?.length ?? 0;
console.log(`Compiled ${testCount} Promptfoo test(s) to ${path.relative(root, outputPath)}`);
