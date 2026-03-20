/**
 * ThreadIQ Shop Mock Data
 * Pre-built purchases for development and testing
 */

import { Purchase } from '../types/shop.types';

const now = new Date().toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

export const mockPurchases: Purchase[] = [
  {
    id: 'purchase-mock-001',
    sourceTrendingItemId: 'trend-001',
    sourceAffiliateLinkId: 'aff-001',
    productName: 'Common Projects Original Achilles',
    brand: 'Common Projects',
    imageUri: 'https://picsum.photos/seed/cp-white-sneakers/400/500',
    retailerName: 'Mr Porter',
    price: 595,
    currency: 'AUD',
    productUrl: 'https://threadiq.com/go/mrporter/cp-achilles?ref=sp-001',
    suggestedCategory: 'shoes',
    suggestedSubcategory: 'sneakers',
    suggestedColors: ['white'],
    status: 'ordered',
    clickedAt: twoDaysAgo,
    orderedAt: twoDaysAgo,
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: 'purchase-mock-002',
    sourceTrendingItemId: 'trend-004',
    sourceAffiliateLinkId: 'aff-005',
    productName: 'Stussy Basic Logo Hoodie',
    brand: 'Stussy',
    imageUri: 'https://picsum.photos/seed/stussy-hoodie-blk/400/500',
    retailerName: 'THE ICONIC',
    price: 139.95,
    currency: 'AUD',
    productUrl: 'https://threadiq.com/go/theiconic/stussy-hoodie?ref=sp-002',
    suggestedCategory: 'tops',
    suggestedSubcategory: 'hoodie',
    suggestedColors: ['black'],
    status: 'shipped',
    clickedAt: fiveDaysAgo,
    orderedAt: fiveDaysAgo,
    shippedAt: twoDaysAgo,
    createdAt: fiveDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: 'purchase-mock-003',
    sourceTrendingItemId: 'trend-003',
    sourceAffiliateLinkId: 'aff-003',
    productName: 'Acne Studios Wool Jacket',
    brand: 'Acne Studios',
    imageUri: 'https://picsum.photos/seed/acne-wool-jacket/400/500',
    retailerName: 'SSENSE',
    price: 890,
    currency: 'AUD',
    salePrice: 712,
    productUrl: 'https://threadiq.com/go/ssense/acne-jacket?ref=sp-001',
    suggestedCategory: 'outerwear',
    suggestedSubcategory: 'blazer',
    suggestedColors: ['charcoal'],
    status: 'delivered',
    clickedAt: fiveDaysAgo,
    orderedAt: fiveDaysAgo,
    shippedAt: twoDaysAgo,
    deliveredAt: now,
    createdAt: fiveDaysAgo,
    updatedAt: now,
  },
];
