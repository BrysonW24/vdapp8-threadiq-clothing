import type { WardrobeItem } from '@/types/wardrobe.types';

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const SEED_ITEMS: WardrobeItem[] = [
  {
    id: 'seed-1', category: 'tops', subcategory: 't-shirt', colors: ['white'],
    pattern: 'solid', material: 'cotton', seasons: ['all-season'], formality: 1,
    brand: 'Uniqlo', size: 'M', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/white-tshirt.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: daysAgo(2) },
    careState: 'clean', wearCount: 12, lastWornAt: daysAgo(1), isFavorite: true, createdAt: daysAgo(90), updatedAt: now,
  },
  {
    id: 'seed-2', category: 'tops', subcategory: 'shirt', colors: ['light-blue'],
    pattern: 'solid', material: 'cotton', seasons: ['spring', 'summer', 'autumn'], formality: 3,
    brand: 'Ralph Lauren', size: 'M', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/blue-shirt.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: daysAgo(5) },
    careState: 'clean', wearCount: 8, lastWornAt: daysAgo(3), isFavorite: false, createdAt: daysAgo(60), updatedAt: now,
  },
  {
    id: 'seed-3', category: 'tops', subcategory: 'sweater', colors: ['navy'],
    pattern: 'solid', material: 'wool', seasons: ['autumn', 'winter'], formality: 3,
    brand: 'COS', size: 'M', condition: 'good', inventoryState: 'available',
    imageUri: '/placeholder/navy-sweater.svg', careProfile: { type: 'hand-wash', wearsBeforeCare: 5, lastCaredAt: daysAgo(14) },
    careState: 'due-soon', wearCount: 4, lastWornAt: daysAgo(5), isFavorite: true, createdAt: daysAgo(120), updatedAt: now,
  },
  {
    id: 'seed-4', category: 'tops', subcategory: 'polo', colors: ['black'],
    pattern: 'solid', material: 'cotton', seasons: ['spring', 'summer'], formality: 2,
    brand: 'Lacoste', size: 'M', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/black-polo.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: daysAgo(1) },
    careState: 'clean', wearCount: 6, lastWornAt: daysAgo(7), isFavorite: false, createdAt: daysAgo(45), updatedAt: now,
  },
  {
    id: 'seed-5', category: 'bottoms', subcategory: 'jeans', colors: ['blue'],
    pattern: 'solid', material: 'denim', seasons: ['all-season'], formality: 2,
    brand: 'Levi\'s', size: '32', condition: 'good', inventoryState: 'available',
    imageUri: '/placeholder/blue-jeans.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 5, lastCaredAt: daysAgo(7) },
    careState: 'clean', wearCount: 20, lastWornAt: daysAgo(2), isFavorite: true, createdAt: daysAgo(180), updatedAt: now,
  },
  {
    id: 'seed-6', category: 'bottoms', subcategory: 'chinos', colors: ['tan'],
    pattern: 'solid', material: 'cotton', seasons: ['spring', 'summer', 'autumn'], formality: 3,
    brand: 'Bonobos', size: '32', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/tan-chinos.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: daysAgo(3) },
    careState: 'clean', wearCount: 10, lastWornAt: daysAgo(4), isFavorite: false, createdAt: daysAgo(75), updatedAt: now,
  },
  {
    id: 'seed-7', category: 'bottoms', subcategory: 'trousers', colors: ['charcoal'],
    pattern: 'solid', material: 'wool', seasons: ['autumn', 'winter'], formality: 4,
    brand: 'Suitsupply', size: '32', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/charcoal-trousers.svg', careProfile: { type: 'dry-clean', wearsBeforeCare: 5, lastCaredAt: daysAgo(10) },
    careState: 'clean', wearCount: 3, lastWornAt: daysAgo(8), isFavorite: false, createdAt: daysAgo(30), updatedAt: now,
  },
  {
    id: 'seed-8', category: 'outerwear', subcategory: 'jacket', colors: ['black'],
    pattern: 'solid', material: 'leather', seasons: ['autumn', 'winter'], formality: 2,
    brand: 'AllSaints', size: 'M', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/black-jacket.svg', careProfile: { type: 'leather-care', wearsBeforeCare: 10, lastCaredAt: daysAgo(30) },
    careState: 'clean', wearCount: 5, lastWornAt: daysAgo(3), isFavorite: true, createdAt: daysAgo(365), updatedAt: now,
  },
  {
    id: 'seed-9', category: 'outerwear', subcategory: 'blazer', colors: ['navy'],
    pattern: 'solid', material: 'wool', seasons: ['all-season'], formality: 4,
    brand: 'Suitsupply', size: '38R', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/navy-blazer.svg', careProfile: { type: 'dry-clean', wearsBeforeCare: 5, lastCaredAt: daysAgo(20) },
    careState: 'clean', wearCount: 4, lastWornAt: daysAgo(6), isFavorite: true, createdAt: daysAgo(200), updatedAt: now,
  },
  {
    id: 'seed-10', category: 'shoes', subcategory: 'sneakers', colors: ['white'],
    pattern: 'solid', material: 'leather', seasons: ['all-season'], formality: 1,
    brand: 'Common Projects', size: '42', condition: 'good', inventoryState: 'available',
    imageUri: '/placeholder/white-sneakers.svg', careProfile: { type: 'spot-clean', wearsBeforeCare: 10, lastCaredAt: daysAgo(14) },
    careState: 'clean', wearCount: 30, lastWornAt: daysAgo(1), isFavorite: true, createdAt: daysAgo(300), updatedAt: now,
  },
  {
    id: 'seed-11', category: 'shoes', subcategory: 'dress-shoes', colors: ['brown'],
    pattern: 'solid', material: 'leather', seasons: ['all-season'], formality: 5,
    brand: 'Meermin', size: '42', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/brown-shoes.svg', careProfile: { type: 'leather-care', wearsBeforeCare: 8, lastCaredAt: daysAgo(15) },
    careState: 'clean', wearCount: 6, lastWornAt: daysAgo(10), isFavorite: false, createdAt: daysAgo(150), updatedAt: now,
  },
  {
    id: 'seed-12', category: 'shoes', subcategory: 'chelsea-boots', colors: ['black'],
    pattern: 'solid', material: 'leather', seasons: ['autumn', 'winter'], formality: 3,
    brand: 'R.M. Williams', size: '42', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/black-boots.svg', careProfile: { type: 'leather-care', wearsBeforeCare: 8, lastCaredAt: daysAgo(20) },
    careState: 'clean', wearCount: 8, lastWornAt: daysAgo(4), isFavorite: true, createdAt: daysAgo(400), updatedAt: now,
  },
  {
    id: 'seed-13', category: 'accessories', subcategory: 'watch', colors: ['black'],
    pattern: 'solid', material: 'synthetic', seasons: ['all-season'], formality: 3,
    brand: 'Seiko', size: 'OS', condition: 'excellent', inventoryState: 'available',
    imageUri: '/placeholder/black-watch.svg', careProfile: { type: 'spot-clean', wearsBeforeCare: 30, lastCaredAt: daysAgo(60) },
    careState: 'clean', wearCount: 50, lastWornAt: daysAgo(1), isFavorite: true, createdAt: daysAgo(500), updatedAt: now,
  },
  {
    id: 'seed-14', category: 'accessories', subcategory: 'belt', colors: ['brown'],
    pattern: 'solid', material: 'leather', seasons: ['all-season'], formality: 3,
    brand: 'Anderson\'s', size: '34', condition: 'good', inventoryState: 'available',
    imageUri: '/placeholder/brown-belt.svg', careProfile: { type: 'leather-care', wearsBeforeCare: 20, lastCaredAt: null },
    careState: 'clean', wearCount: 15, lastWornAt: daysAgo(2), isFavorite: false, createdAt: daysAgo(250), updatedAt: now,
  },
  {
    id: 'seed-15', category: 'tops', subcategory: 'hoodie', colors: ['grey'],
    pattern: 'solid', material: 'cotton', seasons: ['autumn', 'winter'], formality: 1,
    brand: 'Nike', size: 'L', condition: 'good', inventoryState: 'in-laundry',
    imageUri: '/placeholder/grey-hoodie.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: null },
    careState: 'in-care', wearCount: 8, lastWornAt: daysAgo(2), isFavorite: false, createdAt: daysAgo(100), updatedAt: now,
  },
  {
    id: 'seed-16', category: 'bottoms', subcategory: 'shorts', colors: ['navy'],
    pattern: 'solid', material: 'cotton', seasons: ['summer'], formality: 1,
    brand: 'Patagonia', size: '32', condition: 'excellent', inventoryState: 'stored',
    imageUri: '/placeholder/navy-shorts.svg', careProfile: { type: 'machine-wash', wearsBeforeCare: 3, lastCaredAt: daysAgo(90) },
    careState: 'clean', wearCount: 5, lastWornAt: daysAgo(60), isFavorite: false, createdAt: daysAgo(200), updatedAt: now,
  },
];
