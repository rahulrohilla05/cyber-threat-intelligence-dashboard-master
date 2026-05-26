
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, BarChart2, Brain, ShieldCheck, Users } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { mockThreats } from '@/lib/mock-data';
import { TeamCollaboration } from '@/components/team/team-collaboration';
import { SecurityTips } from '@/components/security-tips/SecurityTips';

export default function DashboardOverviewPage() {
  const quickLinks = [
    { title: "Latest Threats", href: "/dashboard/threat-feed", icon: ShieldCheck, description: "View the most recent cyber threats." },
    { title: "Analytics", href: "/dashboard/analytics", icon: BarChart2, description: "Analyze threat trends and patterns." },
    { title: "AI Summary", href: "/dashboard/ai-summary", icon: Brain, description: "Get AI-powered summaries of vulnerabilities." },
    { title: "Manage Alerts", href: "/dashboard/alerts", icon: AlertTriangle, description: "Configure and review your custom alerts." },
  ];

  const firstMockThreat = mockThreats.length > 0 ? mockThreats[0] : null;

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to {APP_NAME}</h1>
          <p className="text-muted-foreground">Your central hub for cybersecurity intelligence.</p>
        </div>
        <Link href="/dashboard/threat-feed/new"> 
          <Button>Report New Threat</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link href={link.href} key={link.title} legacyBehavior>
            <a className="block">
              <Card className="hover:border-primary/70 hover:shadow-lg transition-all h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{link.title}</CardTitle>
                  <link.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      <SecurityTips />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Recent Activity</CardTitle>
            <CardDescription>Overview of recent actions and system status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {firstMockThreat && (
                <>
                  <li>New '{firstMockThreat.title}' variant detected. <Link href={`/dashboard/threat-feed/${firstMockThreat.id}`} className="text-primary hover:underline">View details</Link></li>
                  <li>AI summary generated for '{firstMockThreat.title}'. <Link href={`/dashboard/ai-summary?threatId=${firstMockThreat.id}&threatTitle=${encodeURIComponent(firstMockThreat.title)}`} className="text-primary hover:underline">Read summary</Link></li>
                </>
              )}
              <li>Critical alert 'Ransomware Spike' triggered. <Link href="/dashboard/alerts" className="text-primary hover:underline">Review alerts</Link></li>
              <li>Analytics report for Q2 2024 updated. <Link href="/dashboard/analytics" className="text-primary hover:underline">See report</Link></li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Team & Collaboration</CardTitle>
            <CardDescription>Connect with your team and manage access.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamCollaboration />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
