'use server';
/**
 * @fileOverview Summarizes cybersecurity threats to provide a quick understanding of key details.
 *
 * - summarizeThreat - A function that summarizes cybersecurity threats.
 * - SummarizeThreatInput - The input type for the summarizeThreat function.
 * - SummarizeThreatOutput - The return type for the summarizeThreat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeThreatInputSchema = z.object({
  threatDetails: z
    .string()
    .describe('Detailed description of the cybersecurity threat.'),
});
export type SummarizeThreatInput = z.infer<typeof SummarizeThreatInputSchema>;

const SummarizeThreatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the cybersecurity threat.'),
});
export type SummarizeThreatOutput = z.infer<typeof SummarizeThreatOutputSchema>;

export async function summarizeThreat(input: SummarizeThreatInput): Promise<SummarizeThreatOutput> {
  return summarizeThreatFlow(input);
}

const summarizeThreatPrompt = ai.definePrompt({
  name: 'summarizeThreatPrompt',
  input: {schema: SummarizeThreatInputSchema},
  output: {schema: SummarizeThreatOutputSchema},
  prompt: `You are an expert cybersecurity analyst. Please provide a concise summary of the following cybersecurity threat details:\n\n{{{threatDetails}}}`,
});

const summarizeThreatFlow = ai.defineFlow(
  {
    name: 'summarizeThreatFlow',
    inputSchema: SummarizeThreatInputSchema,
    outputSchema: SummarizeThreatOutputSchema,
  },
  async input => {
    const {output} = await summarizeThreatPrompt(input);
    return output!;
  }
);
