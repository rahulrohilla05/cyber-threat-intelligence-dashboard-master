
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileText, Loader2, Wand2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { generateReport, type GenerateReportOutput } from "@/ai/flows/generate-report-flow";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

const reportFormSchema = z.object({
  requestDetails: z.string().optional(),
});

export default function NewReportPage() {
  const { toast } = useToast();
  const [reportOutput, setReportOutput] = useState<GenerateReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      requestDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof reportFormSchema>) {
    setIsLoading(true);
    setReportOutput(null);
    try {
      const result = await generateReport({ requestDetails: values.requestDetails });
      setReportOutput(result);
      toast({
        title: "Report Generated",
        description: "Your cybersecurity report summary is ready.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error Generating Report",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Cybersecurity Report</h1>
          <p className="text-muted-foreground">Use AI to create a concise cybersecurity report summary.</p>
        </div>
         <Link href="/dashboard/analytics">
            <Button variant="outline">Back to Analytics</Button>
          </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Optionally provide specific details for the AI to focus on.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="requestDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Focus (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Focus on recent phishing trends and IoT vulnerabilities..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Let the AI know if there are particular areas you want the report to emphasize.
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
                Generate Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your report, please wait...</p>
         </div>
      )}

      {reportOutput && !isLoading && (
        <Card className="mt-8 shadow-xl border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-primary">
              <FileText className="mr-3 h-7 w-7" /> {reportOutput.reportTitle}
            </CardTitle>
            <CardDescription className="flex items-center text-sm pt-1 text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4" /> Generated on: {format(parseISO(reportOutput.generatedDate), "MMMM d, yyyy HH:mm")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-foreground/90">Summary:</h3>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{reportOutput.reportSummary}</p>
            {/* Image removed from here */}
          </CardContent>
        </Card>
      )}
       {!isLoading && !reportOutput && (
         <div className="text-center py-10">
            {/* Image removed from here */}
            <p className="text-muted-foreground">Fill in the parameters above and click "Generate Report".</p>
        </div>
      )}
    </div>
  );
}
