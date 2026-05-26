
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import type { SeverityLevel, ThreatCategory } from "@/lib/constants";
import { SEVERITY_LEVELS, THREAT_CATEGORIES } from "@/lib/constants";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface ThreatFilterProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const ALL_SEVERITIES_VALUE = "ALL_SEVERITIES_PLACEHOLDER";

export function ThreatFilter({ onFilterChange }: ThreatFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severity, setSeverity] = useState<SeverityLevel | "">("");
  const [categories, setCategories] = useState<ThreatCategory[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleApplyFilters = () => {
    onFilterChange({ searchTerm, severity, categories, dateRange });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSeverity("");
    setCategories([]);
    setDateRange({});
    onFilterChange({});
  };

  const handleCategoryChange = (category: ThreatCategory) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="p-4 mb-6 bg-card border rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-2">
          <Label htmlFor="search-threats">Search Threats</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-threats"
              type="search"
              placeholder="Search by keyword, title, source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="severity-filter">Severity</Label>
          <Select 
            value={severity} // This correctly uses "" for placeholder behavior via SelectValue
            onValueChange={(value) => {
              if (value === ALL_SEVERITIES_VALUE) {
                setSeverity(""); // Set to empty string for "Any Severity" logic
              } else {
                setSeverity(value as SeverityLevel);
              }
            }}
          >
            <SelectTrigger id="severity-filter">
              <SelectValue placeholder="Any Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_SEVERITIES_VALUE}>Any Severity</SelectItem>
              {SEVERITY_LEVELS.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <FilterIcon className="mr-2 h-4 w-4" /> Categories ({categories.length || 'All'})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-screen max-w-sm p-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter by Category</h4>
              <p className="text-sm text-muted-foreground">Select threat categories to include.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 max-h-60 overflow-y-auto pr-2">
              {THREAT_CATEGORIES.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={categories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={handleResetFilters} className="text-muted-foreground">
          <XIcon className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button onClick={handleApplyFilters}>
          <SearchIcon className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>
    </div>
  );
}

