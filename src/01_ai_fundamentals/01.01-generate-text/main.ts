import { googleModel, groqModel } from "#src/model.ts";
import { generateText } from "ai";


const prompt = 'What is the chemical formula of Salt water?';

const result = await generateText({
        model: groqModel,
        prompt
})

console.log(result.text);
