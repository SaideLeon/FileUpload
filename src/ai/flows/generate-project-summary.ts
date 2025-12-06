'use server';

/**
 * @fileOverview Provides a GenAI-powered summary of a project's file statistics, offering actionable insights for optimization.
 *
 * - generateProjectSummary - A function that generates a summary of project file statistics.
 * - GenerateProjectSummaryInput - The input type for the generateProjectSummary function.
 * - GenerateProjectSummaryOutput - The return type for the generateProjectSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectSummaryInputSchema = z.object({
  fileCounts: z
    .record(z.number())
    .describe('A map of file extensions to their count in the project.'),
  totalSizes: z
    .record(z.number())
    .describe('A map of file extensions to their total size in bytes.'),
  uploadDates: z
    .array(z.string())
    .describe('An array of ISO formatted date strings representing file upload dates.'),
  projectName: z.string().describe('The name of the project.'),
});
export type GenerateProjectSummaryInput = z.infer<typeof GenerateProjectSummaryInputSchema>;

const GenerateProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the project file statistics.'),
  insights: z.string().describe('Actionable insights for optimizing the project files.'),
});
export type GenerateProjectSummaryOutput = z.infer<typeof GenerateProjectSummaryOutputSchema>;

export async function generateProjectSummary(input: GenerateProjectSummaryInput): Promise<GenerateProjectSummaryOutput> {
  return generateProjectSummaryFlow(input);
}

const generateProjectSummaryPrompt = ai.definePrompt({
  name: 'generateProjectSummaryPrompt',
  input: {schema: GenerateProjectSummaryInputSchema},
  output: {schema: GenerateProjectSummaryOutputSchema},
  prompt: `You are an expert file system administrator providing insights on project storage.

  Analyze the following project file statistics and provide a summary and actionable insights for optimization.

  Project Name: {{projectName}}
  File Counts: {{fileCounts}}
  Total Sizes: {{totalSizes}}
  Upload Dates: {{uploadDates}}

  Provide a summary of these metrics, along with actionable insights for optimization, such as identifying dominant file types, suggesting storage strategies, or flagging potentially redundant files.
`,
});

const generateProjectSummaryFlow = ai.defineFlow(
  {
    name: 'generateProjectSummaryFlow',
    inputSchema: GenerateProjectSummaryInputSchema,
    outputSchema: GenerateProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateProjectSummaryPrompt(input);
    return output!;
  }
);
