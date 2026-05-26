"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockThreats } from '@/lib/mock-data';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/constants';

const chartConfig = {
  count: {
    label: "Threat Count",
    color: "hsl(var(--chart-1))",
  },
  avgSeverity: {
    label: "Avg Severity",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ThreatRadarChart() {
  const severityScore: Record<string, number> = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4,
  };

  const data = THREAT_CATEGORIES.map(category => {
    const categoryThreats = mockThreats.filter(t => t.category === category);
    const avgSeverity = categoryThreats.length > 0
      ? categoryThreats.reduce((sum, t) => sum + severityScore[t.severity], 0) / categoryThreats.length
      : 0;

    return {
      category: category.length > 12 ? category.substring(0, 12) + '...' : category,
      count: categoryThreats.length,
      avgSeverity: Number(avgSeverity.toFixed(1)),
    };
  });

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[350px] max-h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'auto']}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Radar
            name="Threat Count"
            dataKey="count"
            stroke="var(--color-count)"
            fill="var(--color-count)"
            fillOpacity={0.6}
          />
          <Radar
            name="Avg Severity (1-4)"
            dataKey="avgSeverity"
            stroke="var(--color-avgSeverity)"
            fill="var(--color-avgSeverity)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
