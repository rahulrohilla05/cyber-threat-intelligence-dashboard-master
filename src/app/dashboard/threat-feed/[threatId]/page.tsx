"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Threat } from '@/types';
import { mockThreats } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, CalendarDays, FileText, ShieldCheck, Layers, Tag, BarChart, Brain, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

const severityColors: Record<Threat['severity'], string> = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-600/20 text-red-500 border-red-600/30',
};

export default function ThreatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threatId = params.threatId as string;
  const [threat, setThreat] = useState<Threat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (threatId) {
      // Simulate fetching threat details
      const foundThreat = mockThreats.find(t => t.id === threatId);
      setThreat(foundThreat || null);
    }
    setIsLoading(false);
  }, [threatId]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!threat) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Threat Not Found</h1>
        <p className="text-muted-foreground mb-4">The threat you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/threat-feed')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Threat Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-card-foreground/5 border-b">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-2xl lg:text-3xl text-primary">{threat.title}</CardTitle>
            <Badge variant="outline" className={`px-3 py-1 text-sm ${severityColors[threat.severity]}`}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              {threat.severity}
            </Badge>
          </div>
          <CardDescription className="flex items-center text-sm pt-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            Reported on: {format(parseISO(threat.date), 'MMMM d, yyyy HH:mm')} &bull; Source: {threat.source}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Description</h3>
              <p className="text-muted-foreground leading-relaxed">{threat.description}</p>
            </div>
             <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Layers className="mr-2 h-5 w-5 text-primary" />Category</h3>
              <Badge variant="secondary" className="text-base px-3 py-1">{threat.category}</Badge>
            </div>
            {threat.tags && threat.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {threat.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-secondary/30">
              <CardHeader><CardTitle className="text-md">Status</CardTitle></CardHeader>
              <CardContent><Badge variant={threat.status === 'Resolved' ? 'default' : 'destructive'}>{threat.status || 'N/A'}</Badge></CardContent>
            </Card>
             {threat.affectedSystems && threat.affectedSystems.length > 0 && (
              <Card className="bg-secondary/30">
                <CardHeader><CardTitle className="text-md">Affected Systems</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {threat.affectedSystems.map(system => <li key={system}>{system}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}
            {threat.mitigation && (
               <Card className="bg-secondary/30">
                <CardHeader><CardTitle className="text-md flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-green-500" />Mitigation</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{threat.mitigation}</p></CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-card-foreground/5 border-t p-6 flex justify-end gap-3">
          <Link href={`/dashboard/ai-summary?threatId=${threat.id}&threatTitle=${encodeURIComponent(threat.title)}`}>
            <Button>
              <Brain className="mr-2 h-4 w-4" /> Get AI Summary
            </Button>
          </Link>
          <Link href={`/dashboard/analytics?category=${threat.category}`}>
            <Button variant="outline">
             <BarChart className="mr-2 h-4 w-4" /> View Related Analytics
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
