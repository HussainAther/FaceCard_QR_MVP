export const CONTACT_FIELD_KEYS = ['email', 'phone', 'website', 'linkedin', 'github', 'company', 'jobTitle', 'note'] as const;
export type ContactFieldKey = (typeof CONTACT_FIELD_KEYS)[number];
export type CardStyle = 'classic' | 'midnight' | 'warm';

export interface IdentityProfile {
  id: string; createdAt: string; identityHash: string; embeddingVersion: string; localEmbeddingReference?: string;
}
export interface ContactFields {
  email?: string; phone?: string; website?: string; linkedin?: string; github?: string; company?: string; jobTitle?: string; note?: string;
}
export interface ContactCard {
  id: string; label: string; displayName: string; tagline?: string; fields: ContactFields;
  shareDisplayName: boolean; sharedFieldKeys: ContactFieldKey[]; style: CardStyle; createdAt: string; expiresAt?: string;
}
export interface FaceCardPayload {
  v: 1; type: 'facecard'; owner_id: string; name?: string; tagline?: string;
  fields: Partial<ContactFields>; expires_at?: string;
}
export interface EnrollmentImage { uri: string; width: number; height: number }
export interface AppSnapshot { identity: IdentityProfile | null; cards: ContactCard[]; hasCompletedPrivacyIntro: boolean }
