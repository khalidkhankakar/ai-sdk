import { groqModel } from '#src/model.ts';
import { generateText } from 'ai';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const tokenizer = new Tiktoken(
  // NOTE: o200k_base is the tokenizer for GPT-4o
  o200k_base,
);

const tokenize = (text: string) => {
  return tokenizer.encode(text);
};

let text = '';

const NUMBER_OF_TOKENS = 10_000_000;

for (let i = 0; i < NUMBER_OF_TOKENS; i++) {
  text += 'foo ';
}

const tokens = tokenize(text);

console.log(`Tokens length: ${tokens.length}`);

await generateText({
  model: groqModel,
  prompt: text,
  // NOTE: by default, the AI SDK retries the request 3 times
  // if it fails. We can prevent this by setting maxRetries to 0.
  maxRetries: 0,
});
