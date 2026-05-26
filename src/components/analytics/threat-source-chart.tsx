"use client"

import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockThreats } from '@/lib/mock-data';

const chartConfig = {
  total: {
    label: "Total Threats",
    color: "hsl(var(--chart-1))",
  },
  critical: {
    label: "Critical",
    color: "hsl(0, 88%, 65%)",
  },
  high: {
    label: "High",
    color: "hsl(275, 85%, 70%)",
  },
} satisfies ChartConfig

export function ThreatSourceChart() {
  const sources = ['DarkNet Forums', 'Security Vendor X', 'Internal Honeypot', 'Government Agency'];
  
  const data = sources.map(source => {
    const sourceThreats = mockThreats.filter(t => t.source === source);
    return {
      source: source.replace(' ', '\n'),
      total: sourceThreats.length,
      critical: sourceThreats.filter(t => t.severity === 'Critical').length,
      high: sourceThreats.filter(t => t.severity === 'High').length,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="source" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 10 }}
            height={60}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar 
            dataKey="critical" 
            fill="var(--color-critical)" 
            radius={[4, 4, 0, 0]}
            stackId="severity"
          />
          <Bar 
            dataKey="high" 
            fill="var(--color-high)" 
            radius={[4, 4, 0, 0]}
            stackId="severity"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--color-total)" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
