import { groqModel, openRouterModel } from '#src/model.ts';
import { streamText } from 'ai';


const prompt =
  'What are the three parts of Vercel AI SDK and also explain that.';

const stream = streamText({model:openRouterModel, prompt });

for await (const chuck of stream.textStream){
    process.stdout.write(chuck);
}
