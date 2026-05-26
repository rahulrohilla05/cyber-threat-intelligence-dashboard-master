
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SEVERITY_LEVELS, THREAT_CATEGORIES } from '@/lib/constants';
import type { SeverityLevel, ThreatCategory } from '@/lib/constants';
import { ArrowLeft, Loader2, ShieldPlus } from 'lucide-react';

const newThreatFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(5000, "Description must not exceed 5000 characters."),
  severity: z.enum(SEVERITY_LEVELS, { required_error: "Severity is required." }),
  category: z.enum(THREAT_CATEGORIES, { required_error: "Category is required." }),
  source: z.string().min(3, "Source must be at least 3 characters."),
  tags: z.string().optional().transform(val => val ? val.split(',').map(k => k.trim()).filter(k => k) : []),
});

export default function NewThreatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newThreatFormSchema>>({
    resolver: zodResolver(newThreatFormSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: undefined,
      category: undefined,
      source: "",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newThreatFormSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you'd send this data to your backend.
    // For this mock, we'll just show a success toast.
    // You could also try to add it to a client-side managed mockThreats array if desired.
    console.log("New threat data:", {
        ...values,
        id: `threat-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'New',
    });

    toast({
      title: "Threat Reported",
      description: `"${values.title}" has been successfully reported.`,
    });
    setIsLoading(false);
    // Optionally reset form or redirect
    // form.reset();
    // router.push('/dashboard/threat-feed'); 
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <ShieldPlus className="mr-3 h-8 w-8 text-primary" /> Report New Threat
          </h1>
          <p className="text-muted-foreground">Submit details of a newly identified cybersecurity threat.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/threat-feed')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Threat Feed
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Threat Details</CardTitle>
            <CardDescription>Fill in the information about the threat you are reporting.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threat Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Zero-Day RCE in Acme Corp Software" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Provide a detailed description of the threat, including observed behaviors, affected systems, and potential impact..." className="min-h-[150px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SEVERITY_LEVELS.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select threat category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {THREAT_CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl><Input placeholder="e.g., Internal discovery, Vendor advisory, News report" {...field} /></FormControl>
                      <FormDescription>Where was this threat identified or reported?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., APT29, SolarWinds, financial-sector" {...field} /></FormControl>
                      <FormDescription>Comma-separated tags for easier categorization.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldPlus className="mr-2 h-5 w-5" />}
                  Report Threat
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-1 space-y-6">
            <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle>Reporting Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Please provide as much detail as possible.</p>
                    <p>Ensure information is accurate and verified if possible.</p>
                    <p>Avoid including sensitive PII unless crucial and properly anonymized.</p>
                    <p>Your contribution helps keep the community informed!</p>
                </CardContent>
            </Card>
             {/* Image removed from here */}
        </div>

      </div>
    </div>
  );
}
