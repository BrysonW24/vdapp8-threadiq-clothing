/**
 * ThreadIQ URL Scraper Service
 * Fetches product info from URLs by parsing Open Graph meta tags
 * v1: Mock scraper for known retailers + basic OG tag fetch
 * v2: Server-side proxy with full HTML parsing
 */

import type { ItemCategory, ItemColor } from '../../types/wardrobe.types';

// ============================================
// TYPES
// ============================================

export interface ScrapedProduct {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  salePrice?: number;
  siteName?: string;
  brand?: string;
  ogUrl: string;
  // Pre-inferred fields for wardrobe/wishlist
  suggestedCategory?: ItemCategory;
  suggestedColors?: ItemColor[];
}

// ============================================
// KNOWN RETAILER PATTERNS
// ============================================

interface RetailerPattern {
  domain: string;
  name: string;
  logoIcon: string;
}

const KNOWN_RETAILERS: RetailerPattern[] = [
  { domain: 'theiconic.com.au', name: 'THE ICONIC', logoIcon: 'shopping' },
  { domain: 'asos.com', name: 'ASOS', logoIcon: 'shopping' },
  { domain: 'farfetch.com', name: 'Farfetch', logoIcon: 'shopping' },
  { domain: 'ssense.com', name: 'SSENSE', logoIcon: 'shopping' },
  { domain: 'mrporter.com', name: 'Mr Porter', logoIcon: 'shopping' },
  { domain: 'net-a-porter.com', name: 'Net-a-Porter', logoIcon: 'shopping' },
  { domain: 'uniqlo.com', name: 'Uniqlo', logoIcon: 'shopping' },
  { domain: 'zara.com', name: 'Zara', logoIcon: 'shopping' },
  { domain: 'hm.com', name: 'H&M', logoIcon: 'shopping' },
  { domain: 'nike.com', name: 'Nike', logoIcon: 'shopping' },
  { domain: 'adidas.com', name: 'Adidas', logoIcon: 'shopping' },
];

function identifyRetailer(url: string): RetailerPattern | undefined {
  const hostname = new URL(url).hostname.toLowerCase();
  return KNOWN_RETAILERS.find((r) => hostname.includes(r.domain));
}

// Category inference from URL path or title
function inferCategory(text: string): ItemCategory | undefined {
  const lower = text.toLowerCase();
  if (/shoe|sneaker|boot|loafer|sandal|heel/i.test(lower)) return 'shoes';
  if (/jacket|coat|blazer|parka|puffer|vest|cardigan/i.test(lower)) return 'outerwear';
  if (/jean|chino|trouser|pant|short|skirt/i.test(lower)) return 'bottoms';
  if (/shirt|tee|t-shirt|polo|sweater|hoodie|blouse|top|tank/i.test(lower)) return 'tops';
  if (/suit|tuxedo/i.test(lower)) return 'suits';
  if (/watch|belt|scarf|hat|beanie|bag|wallet|tie|sunglasses/i.test(lower)) return 'accessories';
  return undefined;
}

// Color inference from text
function inferColors(text: string): ItemColor[] {
  const colorMap: Record<string, ItemColor> = {
    black: 'black', white: 'white', navy: 'navy', grey: 'grey', gray: 'grey',
    charcoal: 'charcoal', brown: 'brown', tan: 'tan', beige: 'beige', cream: 'cream',
    blue: 'blue', red: 'red', green: 'green', olive: 'olive', burgundy: 'burgundy',
    pink: 'pink', yellow: 'yellow', orange: 'orange', purple: 'purple',
  };
  const lower = text.toLowerCase();
  return Object.entries(colorMap)
    .filter(([keyword]) => lower.includes(keyword))
    .map(([_, color]) => color);
}

// ============================================
// MOCK DATA for known retailer URLs
// ============================================

const MOCK_PRODUCTS: Record<string, ScrapedProduct> = {
  'theiconic': {
    title: 'Relaxed Linen Blend Shirt',
    description: 'A breezy linen-blend shirt perfect for warm days. Features a relaxed fit with button-through front.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    price: 89.95,
    currency: 'AUD',
    salePrice: 62.97,
    siteName: 'THE ICONIC',
    brand: 'Assembly Label',
    ogUrl: '',
    suggestedCategory: 'tops',
    suggestedColors: ['blue'],
  },
  'asos': {
    title: 'Oversized Denim Jacket in Mid Wash',
    description: 'Oversized fit denim jacket. Perfect for layering.',
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600',
    price: 75.00,
    currency: 'AUD',
    siteName: 'ASOS',
    brand: 'ASOS DESIGN',
    ogUrl: '',
    suggestedCategory: 'outerwear',
    suggestedColors: ['blue'],
  },
  'nike': {
    title: 'Air Force 1 \'07',
    description: 'The radiance lives on in the Nike Air Force 1 \'07.',
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600',
    price: 170.00,
    currency: 'AUD',
    siteName: 'Nike',
    brand: 'Nike',
    ogUrl: '',
    suggestedCategory: 'shoes',
    suggestedColors: ['white'],
  },
};

// ============================================
// SERVICE
// ============================================

class UrlScraperService {
  /**
   * Scrape product data from a URL
   * v1: Returns mock data for known retailers, basic fetch for others
   */
  async scrapeUrl(url: string): Promise<ScrapedProduct> {
    // Validate URL
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL');
    }

    const retailer = identifyRetailer(url);

    // v1: Return mock data for known retailers
    if (retailer) {
      const mockKey = Object.keys(MOCK_PRODUCTS).find((key) =>
        retailer.domain.includes(key),
      );
      if (mockKey) {
        return {
          ...MOCK_PRODUCTS[mockKey],
          ogUrl: url,
          siteName: retailer.name,
        };
      }
    }

    // Attempt basic fetch for unknown URLs
    // Note: This will fail for most sites due to CORS in React Native
    // v2 will use a server-side proxy
    try {
      return await this.fetchOGTags(url);
    } catch {
      // Fallback: extract what we can from the URL itself
      return this.extractFromUrl(url);
    }
  }

  /**
   * Attempt to fetch and parse OG tags directly
   * Works for some sites, blocked by CORS on others
   */
  private async fetchOGTags(url: string): Promise<ScrapedProduct> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ThreadIQ/1.0',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();

    // Parse OG tags with regex (lightweight, no DOM parser needed)
    const getMetaContent = (property: string): string | undefined => {
      const regex = new RegExp(
        `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
        'i',
      );
      const match = html.match(regex);
      return match?.[1];
    };

    const title = getMetaContent('og:title') || getMetaContent('title') || 'Untitled Product';
    const description = getMetaContent('og:description') || getMetaContent('description');
    const imageUrl = getMetaContent('og:image');
    const siteName = getMetaContent('og:site_name');
    const priceStr = getMetaContent('product:price:amount') || getMetaContent('og:price:amount');
    const currency = getMetaContent('product:price:currency') || getMetaContent('og:price:currency');

    return {
      title,
      description,
      imageUrl,
      price: priceStr ? parseFloat(priceStr) : undefined,
      currency: currency || 'AUD',
      siteName,
      ogUrl: url,
      suggestedCategory: inferCategory(title),
      suggestedColors: inferColors(title + ' ' + (description || '')),
    };
  }

  /**
   * Extract basic info from URL path when fetch fails
   */
  private extractFromUrl(url: string): ScrapedProduct {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || '';
    const title = lastPart
      .replace(/[-_]/g, ' ')
      .replace(/\.\w+$/, '')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const retailer = identifyRetailer(url);

    return {
      title: title || 'Product from ' + parsed.hostname,
      ogUrl: url,
      siteName: retailer?.name || parsed.hostname,
      brand: retailer?.name,
      suggestedCategory: inferCategory(title + ' ' + parsed.pathname),
      suggestedColors: inferColors(title + ' ' + parsed.pathname),
    };
  }

  /**
   * Check if a string looks like a valid product URL
   */
  isValidProductUrl(text: string): boolean {
    try {
      const url = new URL(text);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }
}

export default new UrlScraperService();
