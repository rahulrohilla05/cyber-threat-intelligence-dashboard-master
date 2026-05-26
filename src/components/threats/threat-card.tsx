import type { Threat } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, CalendarDays, ExternalLink, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ThreatCardProps {
  threat: Threat;
}

const severityColors: Record<Threat['severity'], string> = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-600/20 text-red-500 border-red-600/30',
};

export function ThreatCard({ threat }: ThreatCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-primary/20 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">{threat.title}</CardTitle>
          <Badge variant="outline" className={severityColors[threat.severity]}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {threat.severity}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs pt-1">
          <CalendarDays className="h-3 w-3 mr-1.5" />
          {format(parseISO(threat.date), 'MMM d, yyyy HH:mm')} &bull; Source: {threat.source}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{threat.description}</p>
        <div className="mt-3">
          <Badge variant="secondary">{threat.category}</Badge>
          {threat.tags?.slice(0,2).map(tag => <Badge key={tag} variant="outline" className="ml-1 text-xs">{tag}</Badge>)}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/dashboard/threat-feed/${threat.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <Info className="mr-2 h-4 w-4" /> Details
          </Button>
        </Link>
        <Link href={`/dashboard/ai-summary?threatId=${threat.id}`} className="flex-1">
          <Button className="w-full bg-primary/90 hover:bg-primary">
            AI Summary <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
