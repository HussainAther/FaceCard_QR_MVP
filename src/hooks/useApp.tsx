import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ContactCard, IdentityProfile } from '../models';
import { storageService } from '../services/storage/StorageService';
import { revenueCatService } from '../services/revenuecat/RevenueCatService';

interface AppContextValue {
  ready: boolean; identity: IdentityProfile | null; cards: ContactCard[]; isPro: boolean; hasCompletedPrivacyIntro: boolean;
  setIdentity(identity: IdentityProfile): Promise<void>; saveCard(card: ContactCard): Promise<void>; deleteCard(id: string): Promise<void>;
  completePrivacyIntro(): Promise<void>; refreshEntitlements(): Promise<void>; purchasePro(): Promise<{cancelled?: boolean}>; restorePurchases(): Promise<boolean>;
  deleteIdentity(): Promise<void>; deleteAllLocalData(): Promise<void>;
}
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({children}: {children: ReactNode}) {
  const [ready, setReady] = useState(false); const [identity, updateIdentity] = useState<IdentityProfile | null>(null);
  const [cards, updateCards] = useState<ContactCard[]>([]); const [isPro, setPro] = useState(false); const [hasCompletedPrivacyIntro, setIntro] = useState(false);
  useEffect(() => { (async () => { const snapshot = await storageService.load(); updateIdentity(snapshot.identity); updateCards(snapshot.cards); setIntro(snapshot.hasCompletedPrivacyIntro); await revenueCatService.initialize(); setPro((await revenueCatService.getEntitlements()).isPro); setReady(true); })().catch(() => setReady(true)); }, []);
  const value = useMemo<AppContextValue>(() => ({ready, identity, cards, isPro, hasCompletedPrivacyIntro,
    setIdentity: async (next) => { await storageService.saveIdentityMetadata(next); updateIdentity(next); },
    saveCard: async (card) => { const next = [...cards.filter((item) => item.id !== card.id), card]; await storageService.saveCards(next); updateCards(next); },
    deleteCard: async (id) => { const next = cards.filter((card) => card.id !== id); await storageService.saveCards(next); updateCards(next); },
    completePrivacyIntro: async () => { await storageService.markPrivacyIntroComplete(); setIntro(true); },
    refreshEntitlements: async () => setPro((await revenueCatService.getEntitlements()).isPro),
    purchasePro: async () => { const result = await revenueCatService.purchasePro(); setPro(result.isPro); return {cancelled: result.cancelled}; },
    restorePurchases: async () => { const result = await revenueCatService.restorePurchases(); setPro(result.isPro); return result.isPro; },
    deleteIdentity: async () => { await storageService.deleteIdentity(); await storageService.saveCards([]); updateIdentity(null); updateCards([]); },
    deleteAllLocalData: async () => { await storageService.deleteAllLocalData(); updateIdentity(null); updateCards([]); setIntro(false); },
  }), [ready, identity, cards, isPro, hasCompletedPrivacyIntro]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(): AppContextValue { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used inside AppProvider'); return value; }
