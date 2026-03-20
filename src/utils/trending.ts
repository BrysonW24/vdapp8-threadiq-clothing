/**
 * Trending score calculation and formatting utilities
 */

export function calculateTrendingScore(params: {
  wearCount: number;
  saveCount: number;
  viewCount: number;
  daysSinceTrendStart: number;
}): number {
  const { wearCount, saveCount, viewCount, daysSinceTrendStart } = params;
  const baseScore = wearCount * 3 + saveCount * 2 + viewCount * 0.1;
  const timeDecay = Math.max(0, 1 - daysSinceTrendStart / 30);
  return Math.min(100, Math.round(baseScore * timeDecay));
}

export function formatTrendingScore(score: number): string {
  if (score >= 80) return 'Hot';
  if (score >= 50) return 'Rising';
  if (score >= 20) return 'Warming';
  return 'New';
}

export function getTrendingColor(score: number): string {
  if (score >= 80) return '#E74C3C';
  if (score >= 50) return '#F39C12';
  if (score >= 20) return '#3498DB';
  return '#95A5A6';
}
