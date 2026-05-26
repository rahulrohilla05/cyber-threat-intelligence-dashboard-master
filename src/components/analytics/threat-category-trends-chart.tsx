"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { format, parseISO, subDays } from 'date-fns';
import { mockThreats } from '@/lib/mock-data';
import { THREAT_CATEGORIES } from '@/lib/constants';

const chartConfig = {
  Malware: { label: "Malware", color: "hsl(var(--chart-1))" },
  Phishing: { label: "Phishing", color: "hsl(var(--chart-2))" },
  Ransomware: { label: "Ransomware", color: "hsl(var(--chart-3))" },
  DDoS: { label: "DDoS", color: "hsl(var(--chart-4))" },
  "Data Breach": { label: "Data Breach", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export function ThreatCategoryTrendsChart() {
  // Generate data for last 30 days
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayData: any = {
      date: format(date, 'MMM dd'),
      fullDate: dateStr,
    };

    // Count threats for each category on this day
    THREAT_CATEGORIES.slice(0, 5).forEach(category => {
      dayData[category] = mockThreats.filter(threat => {
        const threatDate = format(parseISO(threat.date), 'yyyy-MM-dd');
        return threatDate === dateStr && threat.category === category;
      }).length;
    });

    return dayData;
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            {Object.entries(chartConfig).map(([key, config]) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {Object.keys(chartConfig).map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={chartConfig[key as keyof typeof chartConfig].color}
              fill={`url(#gradient-${key})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
