"use client"

import { mockThreats } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

export function ThreatTagCloud() {
  // Count tag occurrences
  const tagCounts: Record<string, number> = {};
  mockThreats.forEach(threat => {
    threat.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Sort by count and get top tags
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  const maxCount = Math.max(...sortedTags.map(([, count]) => count));
  const minCount = Math.min(...sortedTags.map(([, count]) => count));

  const getSize = (count: number) => {
    const normalized = (count - minCount) / (maxCount - minCount || 1);
    return 12 + normalized * 20; // Font size between 12px and 32px
  };

  const getColor = (count: number) => {
    const normalized = (count - minCount) / (maxCount - minCount || 1);
    if (normalized > 0.7) return 'destructive';
    if (normalized > 0.4) return 'default';
    return 'secondary';
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-6 min-h-[300px]">
      {sortedTags.map(([tag, count]) => (
        <Badge
          key={tag}
          variant={getColor(count)}
          className="cursor-pointer hover:scale-110 transition-transform"
          style={{ fontSize: `${getSize(count)}px`, padding: '8px 16px' }}
        >
          {tag} ({count})
        </Badge>
      ))}
    </div>
  );
}
