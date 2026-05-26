"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommonThreatsChart } from '@/components/analytics/common-threats-chart';
import { SeverityPieChart } from '@/components/analytics/severity-pie-chart';
import { TrendsLineChart } from '@/components/analytics/trends-line-chart';
import { ThreatCategoryTrendsChart } from '@/components/analytics/threat-category-trends-chart';
import { ThreatRadarChart } from '@/components/analytics/threat-radar-chart';
import { ThreatSourceChart } from '@/components/analytics/threat-source-chart';
import { SeverityTimelineChart } from '@/components/analytics/severity-timeline-chart';
import { ThreatTagCloud } from '@/components/analytics/threat-tag-cloud';
import { mockThreats, commonThreatsData, severityDistributionData, threatTrendsData } from '@/lib/mock-data';
import { Loader2, TrendingUp, Shield, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const criticalCount = mockThreats.filter(t => t.severity === 'Critical').length;
  const highCount = mockThreats.filter(t => t.severity === 'High').length;
  const newCount = mockThreats.filter(t => t.status === 'New').length;

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Threat Analytics</h1>
          <p className="text-muted-foreground">Advanced visualizations and insights from real threat data.</p>
        </div>
        <Link href="/dashboard/reports/new">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockThreats.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{highCount}</div>
            <p className="text-xs text-muted-foreground">High priority threats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Threats</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{newCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sources">Sources & Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Threat Category Distribution</CardTitle>
                <CardDescription>Total threats detected by category type.</CardDescription>
              </CardHeader>
              <CardContent>
                <CommonThreatsChart data={commonThreatsData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Breakdown of threats by severity levels.</CardDescription>
              </CardHeader>
              <CardContent>
                <SeverityPieChart data={severityDistributionData} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Threat Category Radar</CardTitle>
                <CardDescription>Multi-dimensional view of threat categories.</CardDescription>
              </CardHeader>
              <CardContent>
                <ThreatRadarChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Severity Status Breakdown</CardTitle>
                <CardDescription>Threat status by severity level.</CardDescription>
              </CardHeader>
              <CardContent>
                <SeverityTimelineChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Trends Over Time</CardTitle>
              <CardDescription>Monthly evolution of reported threats.</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendsLineChart data={threatTrendsData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Trends (Last 30 Days)</CardTitle>
              <CardDescription>Daily threat activity by category with stacked area visualization.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatCategoryTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threats by Source</CardTitle>
              <CardDescription>Intelligence sources and their threat severity distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatSourceChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Threat Tag Cloud</CardTitle>
              <CardDescription>Most common threat tags and indicators.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatTagCloud />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
