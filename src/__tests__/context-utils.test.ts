import { describe, it, expect } from 'vitest';
import {
  getContextThreshold,
  formatTokenCount,
  getContextPercentage,
  getContextLimit,
  estimateCost,
  DEFAULT_CONTEXT_LIMIT,
  CONTEXT_LIMIT_1M,
  CONTEXT_LIMIT_DEFAULT,
} from '../lib/context-utils';

describe('context-utils', () => {
  describe('getContextThreshold', () => {
    it('returns "ok" when usage is below 75%', () => {
      expect(getContextThreshold(0)).toBe('ok');
      expect(getContextThreshold(125_000)).toBe('ok'); // 50%
      expect(getContextThreshold(187_499)).toBe('ok'); // just under 75%
    });

    it('returns "warning" when usage is 75-89%', () => {
      expect(getContextThreshold(187_500)).toBe('warning'); // exactly 75%
      expect(getContextThreshold(200_000)).toBe('warning'); // 80%
      expect(getContextThreshold(224_999)).toBe('warning'); // just under 90%
    });

    it('returns "critical" when usage is 90% or more', () => {
      expect(getContextThreshold(225_000)).toBe('critical'); // exactly 90%
      expect(getContextThreshold(237_500)).toBe('critical'); // 95%
      expect(getContextThreshold(250_000)).toBe('critical'); // 100%
      expect(getContextThreshold(300_000)).toBe('critical'); // over limit
    });

    it('uses custom limit when provided', () => {
      const customLimit = 100_000;
      expect(getContextThreshold(50_000, customLimit)).toBe('ok'); // 50%
      expect(getContextThreshold(75_000, customLimit)).toBe('warning'); // 75%
      expect(getContextThreshold(90_000, customLimit)).toBe('critical'); // 90%
    });

    it('handles edge cases gracefully', () => {
      expect(getContextThreshold(0, 0)).toBe('ok'); // zero limit
      expect(getContextThreshold(-100)).toBe('ok'); // negative usage
      expect(getContextThreshold(100, -100)).toBe('ok'); // negative limit
    });

    it('uses DEFAULT_CONTEXT_LIMIT correctly', () => {
      expect(DEFAULT_CONTEXT_LIMIT).toBe(250_000);
    });
  });

  describe('getContextLimit', () => {
    it('returns 1M for models with [1m] suffix', () => {
      expect(getContextLimit('opus[1m]')).toBe(CONTEXT_LIMIT_1M);
      expect(getContextLimit('claude-opus-4-6[1m]')).toBe(CONTEXT_LIMIT_1M);
      expect(getContextLimit('sonnet[1M]')).toBe(CONTEXT_LIMIT_1M);
    });

    it('returns default limit for standard models', () => {
      expect(getContextLimit('opus')).toBe(CONTEXT_LIMIT_DEFAULT);
      expect(getContextLimit('claude-opus-4-6')).toBe(CONTEXT_LIMIT_DEFAULT);
      expect(getContextLimit('sonnet')).toBe(CONTEXT_LIMIT_DEFAULT);
    });

    it('returns default limit for undefined/empty model', () => {
      expect(getContextLimit()).toBe(CONTEXT_LIMIT_DEFAULT);
      expect(getContextLimit('')).toBe(CONTEXT_LIMIT_DEFAULT);
      expect(getContextLimit(undefined)).toBe(CONTEXT_LIMIT_DEFAULT);
    });
  });

  describe('formatTokenCount', () => {
    it('formats thousands with "k" suffix', () => {
      expect(formatTokenCount(1_000)).toBe('1k');
      expect(formatTokenCount(50_000)).toBe('50k');
      expect(formatTokenCount(145_000)).toBe('145k');
      expect(formatTokenCount(1_000_000)).toBe('1000k');
    });

    it('rounds to nearest thousand', () => {
      expect(formatTokenCount(1_499)).toBe('1k');
      expect(formatTokenCount(1_500)).toBe('2k');
      expect(formatTokenCount(145_678)).toBe('146k');
    });

    it('returns "—" for zero, undefined, or negative', () => {
      expect(formatTokenCount(0)).toBe('—');
      expect(formatTokenCount(undefined)).toBe('—');
      expect(formatTokenCount(-100)).toBe('—');
    });

    it('handles small values', () => {
      expect(formatTokenCount(500)).toBe('1k'); // rounds up
      expect(formatTokenCount(100)).toBe('0k'); // rounds down
    });
  });

  describe('getContextPercentage', () => {
    it('calculates percentage correctly', () => {
      expect(getContextPercentage(125_000)).toBe(50);
      expect(getContextPercentage(250_000)).toBe(100);
      expect(getContextPercentage(62_500)).toBe(25);
    });

    it('handles custom limits', () => {
      expect(getContextPercentage(50_000, 100_000)).toBe(50);
      expect(getContextPercentage(75_000, 100_000)).toBe(75);
    });

    it('handles edge cases', () => {
      expect(getContextPercentage(0)).toBe(0);
      expect(getContextPercentage(100, 0)).toBe(0); // zero limit
      expect(getContextPercentage(100, -100)).toBe(0); // negative limit
    });

    it('allows values over 100%', () => {
      expect(getContextPercentage(375_000)).toBe(150);
    });
  });

  describe('estimateCost', () => {
    // 1M input + 1M output tokens → cost equals per-MTok pricing directly
    const MTOK = 1_000_000;

    it('prices Fable 5 at $10/$50 per MTok', () => {
      for (const model of ['fable', 'claude-fable-5', 'claude-fable-5[1m]']) {
        const cost = estimateCost(MTOK, MTOK, model);
        expect(cost.inputCost).toBe(10);
        expect(cost.outputCost).toBe(50);
        expect(cost.totalCost).toBe(60);
      }
    });

    it('prices modern Opus (4.5+ and bare alias) at $5/$25 per MTok', () => {
      for (const model of [
        'opus',
        'claude-opus-4-8',
        'claude-opus-4-7',
        'claude-opus-4-6[1m]',
        'claude-opus-4-5-20251101',
      ]) {
        const cost = estimateCost(MTOK, MTOK, model);
        expect(cost.inputCost).toBe(5);
        expect(cost.outputCost).toBe(25);
      }
    });

    it('prices deprecated Opus (4.1 and earlier) at $15/$75 per MTok', () => {
      for (const model of [
        'claude-opus-4-1-20250805',
        'claude-opus-4-20250514',
        'claude-3-opus-20240229',
      ]) {
        const cost = estimateCost(MTOK, MTOK, model);
        expect(cost.inputCost).toBe(15);
        expect(cost.outputCost).toBe(75);
      }
    });

    it('prices Sonnet at $3/$15 per MTok', () => {
      for (const model of ['sonnet', 'claude-sonnet-4-6', 'claude-3-5-sonnet-20241022']) {
        const cost = estimateCost(MTOK, MTOK, model);
        expect(cost.inputCost).toBe(3);
        expect(cost.outputCost).toBe(15);
      }
    });

    it('prices Haiku 4.5 at $1/$5 and Haiku 3.5 at $0.80/$4 per MTok', () => {
      const modern = estimateCost(MTOK, MTOK, 'claude-haiku-4-5-20251001');
      expect(modern.inputCost).toBe(1);
      expect(modern.outputCost).toBe(5);

      const legacy = estimateCost(MTOK, MTOK, 'claude-3-5-haiku-20241022');
      expect(legacy.inputCost).toBe(0.8);
      expect(legacy.outputCost).toBe(4);
    });

    it('falls back to Sonnet pricing for unknown models', () => {
      const cost = estimateCost(MTOK, MTOK, 'unknown-model');
      expect(cost.inputCost).toBe(3);
      expect(cost.outputCost).toBe(15);
    });

    it('scales with token counts', () => {
      const cost = estimateCost(100_000, 10_000, 'claude-fable-5');
      expect(cost.inputCost).toBeCloseTo(1.0);
      expect(cost.outputCost).toBeCloseTo(0.5);
      expect(cost.totalCost).toBeCloseTo(1.5);
    });
  });
});
