import { canCreateCard, canHighResolutionExport, canShareField, canUseStyle, hasProEntitlement } from '../proGating';
describe('Pro gating', () => {
  it('allows one basic free card and gates premium capabilities', () => { expect(canCreateCard(0, false)).toBe(true); expect(canCreateCard(1, false)).toBe(false); expect(canUseStyle('classic', false)).toBe(true); expect(canUseStyle('warm', false)).toBe(false); expect(canShareField('email', false)).toBe(true); expect(canShareField('github', false)).toBe(false); expect(canHighResolutionExport(false)).toBe(false); });
  it('unlocks every gate with Pro', () => { expect(canCreateCard(4, true)).toBe(true); expect(canUseStyle('midnight', true)).toBe(true); expect(canShareField('note', true)).toBe(true); expect(canHighResolutionExport(true)).toBe(true); });
  it('reads only the configured RevenueCat entitlement', () => { expect(hasProEntitlement({pro: {identifier: 'pro'}})).toBe(true); expect(hasProEntitlement({premium: {}})).toBe(false); });
});
