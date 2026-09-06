import { z } from 'zod';
import type { ContactCard, ContactFieldKey, FaceCardPayload, IdentityProfile } from '../../models';

export const MAX_QR_BYTES = 2400;

const safeUrl = z.string().trim().max(300).refine((value) => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
}, 'Only http(s) URLs are allowed');

const fieldsSchema = z.object({
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(3).max(40).regex(/^[+()\-\s.0-9]+$/).optional(),
  website: safeUrl.optional(),
  linkedin: safeUrl.optional(),
  github: safeUrl.optional(),
  company: z.string().trim().max(100).optional(),
  jobTitle: z.string().trim().max(100).optional(),
  note: z.string().trim().max(280).optional(),
}).strict();

const payloadSchema = z.object({
  v: z.literal(1),
  type: z.literal('facecard'),
  owner_id: z.string().regex(/^[a-f0-9]{16,64}$/),
  name: z.string().trim().min(1).max(100).optional(),
  tagline: z.string().trim().max(120).optional(),
  fields: fieldsSchema,
  expires_at: z.iso.datetime().optional(),
}).strict();

export function selectedFields(card: ContactCard): Partial<ContactCard['fields']> {
  const selected: Partial<ContactCard['fields']> = {};
  for (const key of card.sharedFieldKeys) {
    const value = card.fields[key];
    if (value?.trim()) selected[key] = value.trim();
  }
  return selected;
}

export class QRService {
  static encodeContactCard(identity: IdentityProfile, card: ContactCard): string {
    const payload: FaceCardPayload = {
      v: 1, type: 'facecard', owner_id: identity.id,
      ...(card.shareDisplayName ? {name: card.displayName.trim()} : {}),
      ...(card.shareDisplayName && card.tagline?.trim() ? { tagline: card.tagline.trim() } : {}),
      fields: selectedFields(card),
      ...(card.expiresAt ? { expires_at: card.expiresAt } : {}),
    };
    const validated = payloadSchema.parse(payload);
    const encoded = JSON.stringify(validated);
    if (new TextEncoder().encode(encoded).length > MAX_QR_BYTES) throw new Error('This card is too large for a reliable QR code. Shorten its fields.');
    return encoded;
  }

  static decodeContactCard(raw: string): FaceCardPayload {
    if (new TextEncoder().encode(raw).length > MAX_QR_BYTES) throw new Error('QR payload is too large.');
    let candidate: unknown;
    try { candidate = JSON.parse(raw); } catch { throw new Error('This is not a valid FaceCard QR.'); }
    const parsed = payloadSchema.safeParse(candidate);
    if (!parsed.success) throw new Error('This FaceCard QR is malformed or unsupported.');
    if (parsed.data.expires_at && Date.parse(parsed.data.expires_at) <= Date.now()) throw new Error('This FaceCard has expired.');
    return parsed.data;
  }
}

export const qrPayloadSchema = payloadSchema;
export const FREE_FIELD_KEYS: ContactFieldKey[] = ['email', 'phone', 'website'];
