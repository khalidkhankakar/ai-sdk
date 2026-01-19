import { googleModel, groqModel } from "#src/model.ts";
import { generateText, streamObject, streamText } from "ai";
import { z } from "zod";

const prompt = 'What is the chemical formula of Salt water?';

const result = streamText({
        model: groqModel,
        prompt
})


for await (const chuck of result.textStream){
    process.stdout.write(chuck);
}

const finalText = result.text;

const streamObj = streamObject({
        model: groqModel,
        prompt: `Give the name of the chemical element with the formula ${finalText}`,
        schema: z.object({
                facts: z.array(z.string()).describe("A list of interesting facts about the chemical element.")
        })
})

for await (const obj of streamObj.partialObjectStream){
    console.log(obj);
}

