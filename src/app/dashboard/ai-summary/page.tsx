
"use client";
import { AiSummaryForm } from '@/components/ai/ai-summary-form';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockThreats } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';

export default function AiSummaryPage() {
  const searchParams = useSearchParams();
  const threatId = searchParams.get('threatId');
  const threatTitleParam = searchParams.get('threatTitle');
  
  const [initialDetails, setInitialDetails] = useState<string | undefined>(undefined);
  const [threatTitle, setThreatTitle] = useState<string | undefined>(threatTitleParam || undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (threatId) {
      setIsLoading(true); // Set loading to true when threatId is present to show loader
      const foundThreat = mockThreats.find(t => t.id === threatId);
      if (foundThreat) {
        setInitialDetails(foundThreat.detailsForSummary);
        if(!threatTitleParam) setThreatTitle(foundThreat.title);
      }
      setIsLoading(false); 
    } else {
      setIsLoading(false); // No threatId, so not loading specific details
    }
  }, [threatId, threatTitleParam]);

  if (isLoading && threatId) { // Only show loader if we expect to load initial details for a specific threat
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
       {!threatId && ( 
        <div className="mb-8 p-6 rounded-lg bg-card border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-primary">AI Threat Summary</h1>
              <p className="text-muted-foreground mt-2">
                Generate concise summaries of cybersecurity threats using AI. Paste any threat details below to get started.
              </p>
            </div>
            {/* Image removed from here */}
          </div>
        </div>
      )}
      <AiSummaryForm initialThreatDetails={initialDetails} threatTitle={threatTitle} />
    </div>
  );
}
