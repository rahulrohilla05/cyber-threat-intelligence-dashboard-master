"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartData } from "@/types";

interface CommonThreatsChartProps {
  data: ChartData[];
}

const chartConfig = {
  threats: {
    label: "Threat Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function CommonThreatsChart({ data }: CommonThreatsChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data available for common threats.</p>;
  }
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
          <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}}/>
          <Bar dataKey="value" fill="var(--color-threats)" radius={[4, 4, 0, 0]} name="Threat Count" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
