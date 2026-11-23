/** The tutor runs: npx jest starter.spec.ts */
import { sumRangeBlocking, sumRangeInChunks } from './starter';

const LIMIT = 100_000_000;
const EXPECTED = (LIMIT * (LIMIT - 1)) / 2;

/** Counts how many times a 5 ms interval fires while `work` runs. */
async function countTicksDuring(work: () => Promise<number> | number): Promise<{ ticks: number; result: number }> {
  let ticks = 0;
  const timer = setInterval(() => {
    ticks++;
  }, 5);
  try {
    const result = await work();
    return { ticks, result };
  } finally {
    clearInterval(timer);
  }
}

describe('sumRangeBlocking (given baseline)', () => {
  it('gives the right result but lets NO timer fire while it runs', async () => {
    const { ticks, result } = await countTicksDuring(() => sumRangeBlocking(LIMIT));
    expect(result).toBe(EXPECTED);
    expect(ticks).toBe(0);
  });
});

describe('sumRangeInChunks', () => {
  it('returns a promise', () => {
    const value = sumRangeInChunks(10, 5);
    expect(value).toBeInstanceOf(Promise);
    return value;
  });

  it('gives the same result as the blocking version', async () => {
    expect(await sumRangeInChunks(1000, 7)).toBe(sumRangeBlocking(1000));
    expect(await sumRangeInChunks(0, 10)).toBe(0);
  });

  it('lets timers fire while it works', async () => {
    const { ticks, result } = await countTicksDuring(() => sumRangeInChunks(LIMIT, 1_000_000));
    expect(result).toBe(EXPECTED);
    expect(ticks).toBeGreaterThanOrEqual(3);
  });
});
