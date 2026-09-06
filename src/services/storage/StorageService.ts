import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { AppSnapshot, ContactCard, IdentityProfile } from '../../models';

const IDENTITY_KEY = 'facecard.identity.v1';
const CARDS_KEY = 'facecard.cards.v1';
const INTRO_KEY = 'facecard.privacy-intro.v1';

export interface StorageAdapter {
  getSecure(key: string): Promise<string | null>; setSecure(key: string, value: string): Promise<void>; deleteSecure(key: string): Promise<void>;
  get(key: string): Promise<string | null>; set(key: string, value: string): Promise<void>; remove(key: string): Promise<void>;
}

const nativeAdapter: StorageAdapter = {
  getSecure: (key) => SecureStore.getItemAsync(key),
  setSecure: (key, value) => SecureStore.setItemAsync(key, value, {keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY}),
  deleteSecure: (key) => SecureStore.deleteItemAsync(key),
  get: (key) => AsyncStorage.getItem(key), set: (key, value) => AsyncStorage.setItem(key, value), remove: (key) => AsyncStorage.removeItem(key),
};

export class StorageService {
  constructor(private adapter: StorageAdapter = nativeAdapter) {}
  async load(): Promise<AppSnapshot> {
    const [identity, cards, intro] = await Promise.all([this.adapter.getSecure(IDENTITY_KEY), this.adapter.get(CARDS_KEY), this.adapter.get(INTRO_KEY)]);
    return {identity: identity ? JSON.parse(identity) as IdentityProfile : null, cards: cards ? JSON.parse(cards) as ContactCard[] : [], hasCompletedPrivacyIntro: intro === 'true'};
  }
  saveIdentityMetadata(identity: IdentityProfile): Promise<void> { return this.adapter.setSecure(IDENTITY_KEY, JSON.stringify(identity)); }
  saveCards(cards: ContactCard[]): Promise<void> { return this.adapter.set(CARDS_KEY, JSON.stringify(cards)); }
  markPrivacyIntroComplete(): Promise<void> { return this.adapter.set(INTRO_KEY, 'true'); }
  deleteIdentity(): Promise<void> { return this.adapter.deleteSecure(IDENTITY_KEY); }
  async deleteAllLocalData(): Promise<void> { await Promise.all([this.adapter.deleteSecure(IDENTITY_KEY), this.adapter.remove(CARDS_KEY), this.adapter.remove(INTRO_KEY)]); }
}

export const storageService = new StorageService();
