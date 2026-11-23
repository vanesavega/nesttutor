/**
 * f1.event-loop-async · 01 - exercise skeleton.
 *
 * Fill in the TODO. Do not change the function signatures:
 * the tests import them as-is.
 */

/**
 * Sums every integer from 0 up to (but not including) `limit`.
 * This version is GIVEN and works, but it blocks the main thread
 * until the loop finishes. Do not modify it.
 */
export function sumRangeBlocking(limit: number): number {
  let total = 0;
  for (let i = 0; i < limit; i++) {
    total += i;
  }
  return total;
}

/**
 * Same result as sumRangeBlocking, but it must NOT block the event loop
 * for the whole computation: process `chunkSize` numbers at a time and
 * give the event loop a chance to run other tasks between chunks.
 */
export async function sumRangeInChunks(
  limit: number,
  chunkSize: number,
): Promise<number> {
  const chunks: number = Math.ceil(limit / chunkSize);
  let start = 0;
  let end: number = Math.min(limit, start + chunkSize);
  let total = 0;
  for (let i = 0; i < chunks; i++) {
    total += loopChunk(start, end);
    start = end;
    end = Math.min(limit, start + chunkSize);
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
  return total;
}

function loopChunk(start: number, end: number): number {
  let total = 0;
  for (let i = start; i < end; i++) {
    total += i;
  }
  return total;
}