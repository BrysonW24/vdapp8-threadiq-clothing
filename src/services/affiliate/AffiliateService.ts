/**
 * ThreadIQ Affiliate Service
 * Handles affiliate link tracking, click recording, URL opening, and shop purchase intent
 */

import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AffiliateLink } from '../../types/discover.types';
import { ItemCategory, ItemColor, ItemSubcategory } from '../../types/wardrobe.types';

const CLICK_LOG_KEY = 'threadiq-affiliate-clicks';

interface ClickLog {
  linkId: string;
  itemId: string;
  profileId: string;
  source: 'home' | 'profile' | 'trending' | 'match';
  timestamp: string;
}

export interface TrendingItemSnapshot {
  trendingItemId: string;
  productName: string;
  brand?: string;
  imageUri: string;
  suggestedCategory: ItemCategory;
  suggestedSubcategory?: ItemSubcategory;
  suggestedColors: ItemColor[];
}

type ShopIntentHandler = (
  link: AffiliateLink,
  snapshot: TrendingItemSnapshot,
) => Promise<string>; // returns purchaseId

class AffiliateService {
  private pendingClicks: ClickLog[] = [];
  private shopIntentHandler?: ShopIntentHandler;

  registerShopIntentHandler(handler: ShopIntentHandler): void {
    this.shopIntentHandler = handler;
  }

  async trackClick(
    link: AffiliateLink,
    profileId: string,
    source: 'home' | 'profile' | 'trending' | 'match',
  ): Promise<void> {
    const clickLog: ClickLog = {
      linkId: link.id,
      itemId: link.itemId,
      profileId,
      source,
      timestamp: new Date().toISOString(),
    };

    this.pendingClicks.push(clickLog);

    // Persist to AsyncStorage for batch upload
    try {
      const existing = await AsyncStorage.getItem(CLICK_LOG_KEY);
      const logs: ClickLog[] = existing ? JSON.parse(existing) : [];
      logs.push(clickLog);
      await AsyncStorage.setItem(CLICK_LOG_KEY, JSON.stringify(logs));
    } catch {
      // Silently fail — click tracking is not critical
    }
  }

  async openLink(
    link: AffiliateLink,
    profileId: string,
    source: 'home' | 'profile' | 'trending' | 'match',
  ): Promise<void> {
    await this.trackClick(link, profileId, source);
    await Linking.openURL(link.affiliateUrl);
  }

  async openShopLink(
    link: AffiliateLink,
    snapshot: TrendingItemSnapshot,
    profileId: string,
    source: 'home' | 'profile' | 'trending' | 'match',
  ): Promise<string | null> {
    await this.trackClick(link, profileId, source);

    let purchaseId: string | null = null;
    if (this.shopIntentHandler) {
      try {
        purchaseId = await this.shopIntentHandler(link, snapshot);
      } catch {
        // Purchase intent recording is not critical — still open the link
      }
    }

    await Linking.openURL(link.affiliateUrl);
    return purchaseId;
  }

  buildAffiliateUrl(
    baseUrl: string,
    params: {
      profileId: string;
      itemId: string;
      source: 'home' | 'profile' | 'trending' | 'match';
    },
  ): string {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}ref=${params.profileId}&item=${params.itemId}&utm_source=threadiq&utm_medium=${params.source}`;
  }

  async getClickLogs(): Promise<ClickLog[]> {
    try {
      const data = await AsyncStorage.getItem(CLICK_LOG_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async clearClickLogs(): Promise<void> {
    await AsyncStorage.removeItem(CLICK_LOG_KEY);
    this.pendingClicks = [];
  }
}

export default new AffiliateService();
