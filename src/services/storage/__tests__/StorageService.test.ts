import type { ContactCard, IdentityProfile } from '../../../models'; import { StorageService, type StorageAdapter } from '../StorageService';
class MemoryAdapter implements StorageAdapter {
  values = new Map<string, string>(); secure = new Map<string, string>();
  async getSecure(key: string) { return this.secure.get(key) ?? null; } async setSecure(key: string, value: string) { this.secure.set(key, value); } async deleteSecure(key: string) { this.secure.delete(key); }
  async get(key: string) { return this.values.get(key) ?? null; } async set(key: string, value: string) { this.values.set(key, value); } async remove(key: string) { this.values.delete(key); }
}
const identity: IdentityProfile = {id: 'b'.repeat(32), createdAt: '2026-09-01T00:00:00.000Z', identityHash: 'b'.repeat(64), embeddingVersion: 'test'};
const card: ContactCard = {id: 'card', label: 'Work', displayName: 'Test', shareDisplayName: true, fields: {email: 'test@example.com'}, sharedFieldKeys: ['email'], style: 'classic', createdAt: '2026-09-01T00:00:00.000Z'};
describe('StorageService', () => {
  it('persists cards and protected identity metadata', async () => { const adapter = new MemoryAdapter(); const storage = new StorageService(adapter); await storage.saveIdentityMetadata(identity); await storage.saveCards([card]); const loaded = await storage.load(); expect(loaded.identity).toEqual(identity); expect(loaded.cards).toEqual([card]); expect(adapter.secure.size).toBe(1); });
  it('deletes identity separately and all local state on request', async () => { const adapter = new MemoryAdapter(); const storage = new StorageService(adapter); await storage.saveIdentityMetadata(identity); await storage.saveCards([card]); await storage.markPrivacyIntroComplete(); await storage.deleteIdentity(); expect((await storage.load()).identity).toBeNull(); expect((await storage.load()).cards).toHaveLength(1); await storage.deleteAllLocalData(); expect(await storage.load()).toEqual({identity: null, cards: [], hasCompletedPrivacyIntro: false}); });
});
