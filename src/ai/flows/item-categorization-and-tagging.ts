'use server';
/**
 * @fileOverview This file contains the Genkit flow for item categorization and tagging.
 *
 * It defines a function `categorizeAndTagItem` that takes an image data URI and a description
 * of an item as input, and uses an AI model to categorize the item and suggest relevant tags.
 *
 * @exports categorizeAndTagItem - The main function to categorize and tag an item.
 * @exports ItemCategorizationAndTaggingInput - The input type for the categorizeAndTagItem function.
 * @exports ItemCategorizationAndTaggingOutput - The output type for the categorizeAndTagItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemCategorizationAndTaggingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
  description: z.string().describe('A description of the item.'),
});
export type ItemCategorizationAndTaggingInput = z.infer<typeof ItemCategorizationAndTaggingInputSchema>;

const ItemCategorizationAndTaggingOutputSchema = z.object({
  category: z.string().describe('The category of the item.'),
  tags: z.array(z.string()).describe('Relevant tags for the item.'),
});
export type ItemCategorizationAndTaggingOutput = z.infer<typeof ItemCategorizationAndTaggingOutputSchema>;

export async function categorizeAndTagItem(
  input: ItemCategorizationAndTaggingInput
): Promise<ItemCategorizationAndTaggingOutput> {
  return categorizeAndTagItemFlow(input);
}

const categorizeAndTagItemPrompt = ai.definePrompt({
  name: 'categorizeAndTagItemPrompt',
  input: {schema: ItemCategorizationAndTaggingInputSchema},
  output: {schema: ItemCategorizationAndTaggingOutputSchema},
  prompt: `You are an AI assistant that categorizes items and suggests relevant tags based on an image and a description.

  Analyze the following item description and the associated image to determine its category and suggest relevant tags to improve searchability.

  Description: {{{description}}}
  Image: {{media url=photoDataUri}}

  Provide the category and tags in JSON format.
  `,
});

const categorizeAndTagItemFlow = ai.defineFlow(
  {
    name: 'categorizeAndTagItemFlow',
    inputSchema: ItemCategorizationAndTaggingInputSchema,
    outputSchema: ItemCategorizationAndTaggingOutputSchema,
  },
  async input => {
    const {output} = await categorizeAndTagItemPrompt(input);
    return output!;
  }
);
