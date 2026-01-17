import { groqModel } from '#src/model.ts';
import { streamText } from 'ai';


const prompt =
  'Write the story my School Girl.';

const stream = streamText({model:groqModel, prompt });

for await (const chuck of stream.toUIMessageStream()){
    console.log(chuck);
}
