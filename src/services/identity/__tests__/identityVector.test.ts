import { averageVectors, canonicalizeVector, createIdentityHash, personalIdFromHash } from '../identityVector';

describe('identity hashing', () => {
  it('is deterministic for the same stable vector', async () => {
    const vector = averageVectors([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
    expect(canonicalizeVector(vector)).toBe(canonicalizeVector(vector));
    expect(await createIdentityHash(vector)).toBe(await createIdentityHash([...vector]));
  });
  it('changes when the descriptor changes and derives a non-global 128-bit label', async () => {
    const one = await createIdentityHash([1, 2, 3]); const two = await createIdentityHash([1, 3, 2]);
    expect(one).not.toBe(two); expect(personalIdFromHash(one)).toHaveLength(32);
  });
});
