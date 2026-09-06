import type { ContactCard, IdentityProfile } from '../../../models'; import { MAX_QR_BYTES, QRService } from '../QRService';
const identity: IdentityProfile = {id: 'a'.repeat(32), createdAt: '2026-09-01T00:00:00.000Z', identityHash: 'a'.repeat(64), embeddingVersion: 'test'};
const card: ContactCard = {id: 'card_1', label: 'Work', displayName: 'Hussain Ather', tagline: 'AI Engineer / Scientist', shareDisplayName: true, fields: {email: 'h@example.com', phone: '+1 555 555 1212', website: 'https://example.com', note: 'secret local note'}, sharedFieldKeys: ['email', 'website'], style: 'classic', createdAt: '2026-09-01T00:00:00.000Z'};

describe('QRService', () => {
  it('round trips a versioned contact payload', () => { const encoded = QRService.encodeContactCard(identity, card); expect(QRService.decodeContactCard(encoded)).toEqual(JSON.parse(encoded)); });
  it('includes only explicitly selected fields', () => { const payload = QRService.decodeContactCard(QRService.encodeContactCard(identity, card)); expect(payload.fields).toEqual({email: 'h@example.com', website: 'https://example.com'}); expect(payload.fields).not.toHaveProperty('phone'); expect(payload.fields).not.toHaveProperty('note'); });
  it('can omit the display name', () => { const payload = QRService.decodeContactCard(QRService.encodeContactCard(identity, {...card, shareDisplayName: false})); expect(payload).not.toHaveProperty('name'); });
  it('rejects unexpected properties, scripts, malformed URLs, and huge payloads', () => {
    expect(() => QRService.decodeContactCard(JSON.stringify({v: 1, type: 'facecard', owner_id: 'a'.repeat(32), fields: {}, hidden: 'no'}))).toThrow();
    expect(() => QRService.decodeContactCard(JSON.stringify({v: 1, type: 'facecard', owner_id: 'a'.repeat(32), fields: {website: 'javascript:alert(1)'}}))).toThrow();
    expect(() => QRService.decodeContactCard('{nope')).toThrow(); expect(() => QRService.decodeContactCard('x'.repeat(MAX_QR_BYTES + 1))).toThrow();
  });
});
