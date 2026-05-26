
'use server';
/**
 * @fileOverview Generates a mock cybersecurity report summary.
 *
 * - generateReport - A function that generates a report summary.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const GenerateReportInputSchema = z.object({
  requestDetails: z
    .string()
    .optional()
    .describe('Optional specific details or focus areas for the report.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  reportTitle: z.string().describe('A plausible title for the generated report.'),
  reportSummary: z.string().describe('A concise summary of the cybersecurity report.'),
  generatedDate: z.string().describe('ISO date string of when the report was generated.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: z.object({
    currentDate: z.string(),
    requestDetails: GenerateReportInputSchema.shape.requestDetails,
  })},
  output: {schema: GenerateReportOutputSchema.pick({ reportTitle: true, reportSummary: true })}, // Genkit will add generatedDate in the flow
  prompt: `You are a cybersecurity analyst tasked with generating a report.
Today's date is {{{currentDate}}}.

Based on general cybersecurity knowledge and the following optional request, create a plausible report title and a concise summary (2-3 paragraphs).

{{#if requestDetails}}
Specific request focus: {{{requestDetails}}}
{{else}}
The report should cover recent general threat trends and mitigation advice.
{{/if}}

Output only the title and summary in the specified format.
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input: GenerateReportInput) => {
    const currentDate = format(new Date(), 'MMMM d, yyyy');
    const {output} = await generateReportPrompt({currentDate, requestDetails: input.requestDetails});
    
    if (!output) {
        throw new Error("Failed to generate report content from AI.");
    }

    return {
      reportTitle: output.reportTitle,
      reportSummary: output.reportSummary,
      generatedDate: new Date().toISOString(),
    };
  }
);
