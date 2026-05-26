'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ShieldAlert, Bug, Clock } from 'lucide-react';
import { countryThreats, getThreatColor, getCategoryColor, type CountryThreat } from '@/lib/globe-data';

const ThreatGlobe = dynamic(
  () => import('./threat-globe').then((m) => ({ default: m.ThreatGlobe })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading globe...</div> }
);

function ThreatScoreBar({ score }: { score: number }) {
  const color = getThreatColor(score);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Threat Score</span>
        <span style={{ color }} className="font-bold">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CountryDetail({ country }: { country: CountryThreat }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">{country.name}</h3>
        <Badge variant="outline" className={getCategoryColor(country.category)}>
          {country.category}
        </Badge>
      </div>

      <ThreatScoreBar score={country.threatScore} />

      <div>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
          <Bug className="h-3 w-3" /> Malware & Attack Types
        </div>
        <div className="space-y-1">
          {country.attackTypes.map((a) => (
            <div key={a.type} className="flex justify-between items-center">
              <span className="text-xs">{a.type}</span>
              <span className="text-xs font-mono text-red-400">{a.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
          <Clock className="h-3 w-3" /> Recent Incidents
        </div>
        <div className="space-y-2">
          {country.recentIncidents.map((inc, i) => (
            <div key={i} className="border-l-2 border-red-800 pl-2">
              <p className="text-xs text-muted-foreground">{inc.date}</p>
              <p className="text-xs">{inc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreatLegend() {
  const levels = [
    { label: 'Critical (85+)', color: '#ff1744' },
    { label: 'High (70–84)', color: '#ff6d00' },
    { label: 'Medium (50–69)', color: '#ffd600' },
    { label: 'Low (<50)', color: '#00e676' },
  ];
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {levels.map((l) => (
        <div key={l.label} className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
          <span className="text-muted-foreground">{l.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ThreatGlobePanel() {
  const [selected, setSelected] = useState<CountryThreat | null>(null);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-5 w-5 text-cyan-400" />
          Global Threat & Malware Intelligence
        </CardTitle>
        <ThreatLegend />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[420px] lg:h-[480px] flex-1 bg-[#020b18] rounded-bl-lg" style={{background:'radial-gradient(ellipse at center, #041428 0%, #020b18 100%)'}}>
            <ThreatGlobe onCountryClick={setSelected} />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground pointer-events-none">
              Click a marker · Drag to rotate · Scroll to zoom
            </p>
          </div>

          <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l p-4 overflow-y-auto max-h-[480px]">
            {selected ? (
              <CountryDetail country={selected} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShieldAlert className="h-4 w-4 text-cyan-400" />
                  Select a country
                </div>
                <p className="text-xs text-muted-foreground">
                  Click any red marker on the globe to view threat intelligence, malware statistics, and recent incidents for that country.
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-muted-foreground">Top Threats</p>
                  {countryThreats
                    .sort((a, b) => b.threatScore - a.threatScore)
                    .slice(0, 5)
                    .map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setSelected(c)}
                        className="w-full flex items-center justify-between text-xs hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                      >
                        <span>{c.name}</span>
                        <span style={{ color: getThreatColor(c.threatScore) }} className="font-bold">
                          {c.threatScore}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
