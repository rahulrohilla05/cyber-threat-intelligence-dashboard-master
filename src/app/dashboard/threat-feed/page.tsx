
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Threat } from '@/types';
import { mockThreats } from '@/lib/mock-data';
import { ThreatCard } from '@/components/threats/threat-card';
import { ThreatFilter } from '@/components/threats/threat-filter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ListFilter, Loader2, ShieldOff } from 'lucide-react'; 
import { parseISO, compareDesc } from 'date-fns';

const ITEMS_PER_PAGE = 9;

export default function ThreatFeedPage() {
  const [allThreats, setAllThreats] = useState<Threat[]>([]);
  const [filteredThreats, setFilteredThreats] = useState<Threat[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const sortedThreats = [...mockThreats].sort((a, b) => 
        compareDesc(parseISO(a.date), parseISO(b.date))
      );
      setAllThreats(sortedThreats);
      setFilteredThreats(sortedThreats);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let threats = [...allThreats];
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      threats = threats.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.source.toLowerCase().includes(term)
      );
    }
    if (filters.severity) {
      threats = threats.filter(t => t.severity === filters.severity);
    }
    if (filters.categories && filters.categories.length > 0) {
      threats = threats.filter(t => filters.categories.includes(t.category));
    }
    if (filters.dateRange?.from) {
      threats = threats.filter(t => parseISO(t.date) >= (filters.dateRange.from as Date));
    }
    if (filters.dateRange?.to) {
      threats = threats.filter(t => parseISO(t.date) <= (filters.dateRange.to as Date));
    }
    setFilteredThreats(threats);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, allThreats]);

  const paginatedThreats = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredThreats.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredThreats, currentPage]);

  const totalPages = Math.ceil(filteredThreats.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Threat Feed</h1>
          <p className="text-muted-foreground">Stay updated with the latest cybersecurity threats.</p>
        </div>
        {/* <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filters</Button> */}
      </div>
      
      <ThreatFilter onFilterChange={setFilters} />

      {paginatedThreats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedThreats.map(threat => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 flex flex-col items-center">
          <ShieldOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Threats Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or check back later for new updates.
          </p>
          {/* Image removed from here */}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
