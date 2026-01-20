import { groqModel } from "#src/model.ts";
import { streamText } from "ai";


const result = streamText({
    model: groqModel,
    prompt: 'Write a short poem about my GirlFirend Neha'
})

for await (const chuck of result.textStream){
    process.stdout.write(chuck)
}
const usage = await result.usage
console.dir({usage}, {depth: null})
