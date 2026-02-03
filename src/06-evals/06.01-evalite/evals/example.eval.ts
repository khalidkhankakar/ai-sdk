import { openRouterModel } from '#src/model.ts';
import { generateText } from 'ai';
import { evalite } from 'evalite';

evalite('Capitals', {
  data: () => [
    {
      input: 'What is the capital of France?',
      expected: 'Paris',
    },
    {
      input: 'What is the capital of Germany?',
      expected: 'Berlin',
    },
    {
      input: 'What is the capital of Italy?',
      expected: 'Rome',
    },
  ],
  task: async (input) => {
    const capitalResult = await generateText({
      model: openRouterModel,
      prompt : `
      Your are helpfull assistant for answering questions about the capitals of countries.

      <question>
      ${input}
      </question>

      <output>
      Give the only the capital of the country.
      </output>

      `
    }); 

    return capitalResult.text;
  },
  scorers: [
    {
      name: 'includes',
      scorer: ({ input, output, expected }) => {
        return output.includes(expected!) ? 1 : 0;
      },
    },
  ],
});
