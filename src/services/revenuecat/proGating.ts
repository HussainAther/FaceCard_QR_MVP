import type { CardStyle, ContactFieldKey } from '../../models';
export const PRO_PRODUCT_ID = 'facecard_pro_lifetime';
export const PRO_ENTITLEMENT_ID = 'pro';
export const PRO_FIELDS: ContactFieldKey[] = ['linkedin', 'github', 'company', 'jobTitle', 'note'];
export function hasProEntitlement(active: Record<string, unknown>): boolean { return Boolean(active[PRO_ENTITLEMENT_ID]); }
export function canCreateCard(cardCount: number, isPro: boolean): boolean { return isPro || cardCount === 0; }
export function canUseStyle(style: CardStyle, isPro: boolean): boolean { return style === 'classic' || isPro; }
export function canShareField(key: ContactFieldKey, isPro: boolean): boolean { return !PRO_FIELDS.includes(key) || isPro; }
export function canHighResolutionExport(isPro: boolean): boolean { return isPro; }
