import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import { hasProEntitlement, PRO_PRODUCT_ID } from './proGating';

export interface Entitlements { isPro: boolean }
export interface PurchaseResult extends Entitlements { cancelled?: boolean }
const MOCK_KEY = 'facecard.mock-pro.v1';

export class RevenueCatService {
  private initialized = false;
  private mock = process.env.EXPO_PUBLIC_REVENUECAT_MOCK === 'true';

  async initialize(): Promise<void> {
    if (this.initialized) return;
    const apiKey = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
    if (this.mock) { this.initialized = true; return; }
    if (!apiKey) throw new Error('RevenueCat is not configured. Add the platform public SDK key or explicitly enable mock mode for local development.');
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({apiKey});
    this.initialized = true;
  }

  private fromCustomerInfo(info: CustomerInfo): Entitlements { return {isPro: hasProEntitlement(info.entitlements.active)}; }
  async getEntitlements(): Promise<Entitlements> {
    await this.initialize();
    if (this.mock) return {isPro: (await AsyncStorage.getItem(MOCK_KEY)) === 'true'};
    return this.fromCustomerInfo(await Purchases.getCustomerInfo());
  }
  async getProPackage(): Promise<PurchasesPackage> {
    const offerings = await Purchases.getOfferings();
    const found = offerings.current?.availablePackages.find((item) => item.product.identifier === PRO_PRODUCT_ID);
    if (!found) throw new Error('FaceCard Pro is not available. Check the RevenueCat offering configuration.');
    return found;
  }
  async purchasePro(): Promise<PurchaseResult> {
    await this.initialize();
    if (this.mock) { await AsyncStorage.setItem(MOCK_KEY, 'true'); return {isPro: true}; }
    try { return this.fromCustomerInfo((await Purchases.purchasePackage(await this.getProPackage())).customerInfo); }
    catch (error: any) { if (error?.userCancelled) return {isPro: false, cancelled: true}; throw error; }
  }
  async restorePurchases(): Promise<Entitlements> {
    await this.initialize();
    if (this.mock) return this.getEntitlements();
    return this.fromCustomerInfo(await Purchases.restorePurchases());
  }
  isMockMode(): boolean { return this.mock; }
}

export const revenueCatService = new RevenueCatService();
