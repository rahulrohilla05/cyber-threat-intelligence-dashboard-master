"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { TimeSeriesData } from "@/types";
import { format, parseISO } from 'date-fns';

interface TrendsLineChartProps {
  data: TimeSeriesData[];
}

const chartConfig = {
  threats: {
    label: "Threats",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function TrendsLineChart({ data }: TrendsLineChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data available for threat trends.</p>;
  }

  const formattedData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM yy'), // Format date for X-axis display
  }));


  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
          <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1.5 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-threats)"
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: "var(--color-threats)",
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
            name="Threat Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
