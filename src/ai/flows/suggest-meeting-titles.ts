'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting meeting titles based on keywords.
 *
 * The flow takes keywords as input and returns an array of suggested meeting titles.
 * - suggestMeetingTitles - A function that calls the suggestMeetingTitlesFlow with the input and returns the output.
 * - SuggestMeetingTitlesInput - The input type for the suggestMeetingTitles function.
 * - SuggestMeetingTitlesOutput - The return type for the suggestMeetingTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeetingTitlesInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords to generate meeting titles from, e.g. project status.'),
});
export type SuggestMeetingTitlesInput = z.infer<typeof SuggestMeetingTitlesInputSchema>;

const SuggestMeetingTitlesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested meeting titles.'),
});
export type SuggestMeetingTitlesOutput = z.infer<typeof SuggestMeetingTitlesOutputSchema>;

export async function suggestMeetingTitles(input: SuggestMeetingTitlesInput): Promise<SuggestMeetingTitlesOutput> {
  return suggestMeetingTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMeetingTitlesPrompt',
  input: {schema: SuggestMeetingTitlesInputSchema},
  output: {schema: SuggestMeetingTitlesOutputSchema},
  prompt: `You are a meeting title generator. Given the following keywords, generate 5 possible meeting titles.
Keywords: {{{keywords}}}`,
});

const suggestMeetingTitlesFlow = ai.defineFlow(
  {
    name: 'suggestMeetingTitlesFlow',
    inputSchema: SuggestMeetingTitlesInputSchema,
    outputSchema: SuggestMeetingTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
