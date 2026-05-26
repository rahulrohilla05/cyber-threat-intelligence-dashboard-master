"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockThreats } from '@/lib/mock-data';
import { SEVERITY_LEVELS } from '@/lib/constants';

const chartConfig = {
  New: { label: "New", color: "hsl(210, 100%, 60%)" },
  Investigating: { label: "Investigating", color: "hsl(40, 100%, 60%)" },
  Resolved: { label: "Resolved", color: "hsl(130, 65%, 58%)" },
} satisfies ChartConfig

export function SeverityTimelineChart() {
  // Group threats by severity and count
  const data = SEVERITY_LEVELS.map(severity => {
    const severityThreats = mockThreats.filter(t => t.severity === severity);
    const statusCounts = {
      New: severityThreats.filter(t => t.status === 'New').length,
      Investigating: severityThreats.filter(t => t.status === 'Investigating').length,
      Resolved: severityThreats.filter(t => t.status === 'Resolved').length,
    };

    return {
      severity,
      total: severityThreats.length,
      ...statusCounts,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
          <YAxis 
            type="category" 
            dataKey="severity" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="New" stackId="status" fill="var(--color-New)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="Investigating" stackId="status" fill="var(--color-Investigating)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="Resolved" stackId="status" fill="var(--color-Resolved)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
