/** The tutor runs: npx jest starter.spec.ts */
import { targetFunction } from './starter';

describe('targetFunction', () => {
  it('handles the base case', () => {
    expect(targetFunction('<input>')).toBe('<expected output>');
  });
});
