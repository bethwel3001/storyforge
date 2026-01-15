'use server';

/**
 * @fileOverview Genkit flow for suggesting a starting storyline and initial branching paths based on a user prompt.
 *
 * - `suggestStoryStart`:  A function that takes a topic or prompt and returns a suggested starting storyline with initial branching paths.
 * - `SuggestStoryStartInput`: The input type for the `suggestStoryStart` function.
 * - `SuggestStoryStartOutput`: The return type for the `suggestStoryStart` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStoryStartInputSchema = z.object({
  topic: z.string().describe('A topic or prompt for the story.'),
  genre: z.string().describe('The genre of the story.'),
});

export type SuggestStoryStartInput = z.infer<typeof SuggestStoryStartInputSchema>;

const CharacterSchema = z.object({
  name: z.string().describe('The name of the character.'),
  description: z.string().describe('A brief, vivid description of the character.'),
});

const SuggestStoryStartOutputSchema = z.object({
  characters: z.array(CharacterSchema).describe('The main characters of the story.'),
  storyline: z.string().describe('A suggested starting storyline.'),
  branchingPaths: z.array(z.string()).describe('Initial branching paths for the story.'),
});

export type SuggestStoryStartOutput = z.infer<typeof SuggestStoryStartOutputSchema>;

export async function suggestStoryStart(input: SuggestStoryStartInput): Promise<SuggestStoryStartOutput> {
  return suggestStoryStartFlow(input);
}

const suggestStoryStartPrompt = ai.definePrompt({
  name: 'suggestStoryStartPrompt',
  input: {schema: SuggestStoryStartInputSchema},
  output: {schema: SuggestStoryStartOutputSchema},
  prompt: `You are a creative story writer. Given a topic and genre in the format
// Tone  modifier core  of  theme
Example theme: "Bleak Cosmic Horror of Identity story"
, create a compelling starting point for a story.

You must define 2-3 main characters with vivid descriptions.
Then, write an opening storyline that introduces the setting and the initial situation.
Finally, suggest a few branching paths for the user to choose from.

Topic: {{{topic}}}
Genre: {{{genre}}}

Characters:
Storyline:
Branching Paths:`, 
});

const suggestStoryStartFlow = ai.defineFlow(
  {
    name: 'suggestStoryStartFlow',
    inputSchema: SuggestStoryStartInputSchema,
    outputSchema: SuggestStoryStartOutputSchema,
  },
  async input => {
    const {output} = await suggestStoryStartPrompt(input);
    return output!;
  }
);
