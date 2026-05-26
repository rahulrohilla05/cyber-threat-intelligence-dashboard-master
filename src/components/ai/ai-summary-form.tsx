"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Wand2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  threatDetails: z.string().min(50, {
    message: "Threat details must be at least 50 characters.",
  }).max(5000, { message: "Threat details must not exceed 5000 characters."}),
});

interface AiSummaryFormProps {
  initialThreatDetails?: string;
  threatTitle?: string;
}

interface SummaryOutput {
  summary: string;
}

export function AiSummaryForm({ initialThreatDetails = "", threatTitle }: AiSummaryFormProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState<SummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      threatDetails: initialThreatDetails,
    },
  });
  
  useEffect(() => {
    if (initialThreatDetails) {
      form.setValue("threatDetails", initialThreatDetails);
    }
  }, [initialThreatDetails, form]);

  // Mock AI summary generator
  const generateMockSummary = (details: string): string => {
    const words = details.split(' ');
    const threatType = words.find(w => 
      ['malware', 'phishing', 'ransomware', 'ddos', 'breach', 'apt', 'exploit'].some(t => 
        w.toLowerCase().includes(t)
      )
    ) || 'threat';
    
    const severity = details.toLowerCase().includes('critical') ? 'Critical' :
                     details.toLowerCase().includes('high') ? 'High' :
                     details.toLowerCase().includes('medium') ? 'Medium' : 'Low';
    
    return `**Threat Summary**

Severity Level: ${severity}

This ${threatType} represents a significant cybersecurity concern that requires immediate attention. The threat exhibits advanced characteristics and has the potential to impact multiple systems and infrastructure components.

**Key Findings:**
• The threat demonstrates sophisticated evasion techniques designed to bypass traditional security measures
• Initial analysis indicates potential for widespread impact across unpatched systems
• Attack vectors include multiple entry points that could be exploited by threat actors
• Recommended immediate action includes system patching, network monitoring, and user awareness training

**Mitigation Recommendations:**
1. Apply latest security patches and updates to all affected systems
2. Implement enhanced monitoring for suspicious network activity
3. Conduct security awareness training for all personnel
4. Review and update incident response procedures
5. Consider implementing additional security controls and access restrictions

**Impact Assessment:**
The threat has the potential to cause significant disruption to operations, data integrity, and system availability. Organizations should prioritize remediation efforts based on their specific risk profile and exposure.

This summary is generated based on the provided threat intelligence and should be used in conjunction with additional security analysis and organizational context.`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSummary = generateMockSummary(values.threatDetails);
      setSummary({ summary: mockSummary });
      
      toast({
        title: "Summary Generated",
        description: "AI has successfully summarized the threat details.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error Generating Summary",
        description: "An error occurred while AI was summarizing. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      {threatTitle && <h2 className="text-2xl font-semibold">AI Summary for: <span className="text-primary">{threatTitle}</span></h2>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="threatDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Threat Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste or describe the full cybersecurity threat details here..."
                    className="min-h-[200px] resize-y text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide comprehensive details for the AI to generate an accurate summary. (Min 50, Max 5000 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Generate Summary
          </Button>
        </form>
      </Form>

      {summary && (
        <Card className="mt-8 shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <FileText className="mr-2 h-6 w-6" /> AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{summary.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
