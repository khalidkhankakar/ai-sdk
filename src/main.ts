import { convertToModelMessages, type UIMessage } from "ai";
import { groqModel, googleModel } from "./model.ts";

console.log('Learn the AI SDK v5!');


// Display the model information
// console.dir(groqModel, {depth: null})
// console.dir(googleModel, {depth: null})

// Difference between UIMessage and ModelMessage

// it is used to represent the message in the user interface and also the database
const uiMessages: Array<UIMessage> = [
    {
        id: "1",
        role: "user",
        parts:[
            {
                type: "text",
                text: "Hello, how are you?"

            }
        ]
    },
    {
        id: "2",
        role: "assistant",
        parts:[
            {
                type: "text",
                text: "I'm good, thank you!"
            }
        ]
    },
  {
    role: 'user',
    id: '3',
    parts: [
      {
        type: 'file',
        filename: 'document.pdf',
        url: 'https://example.com/document.pdf',
        mediaType: 'application/pdf'
      }
    ]
  }

]

const modelMessage = await convertToModelMessages(uiMessages)

console.dir(uiMessages, {depth: null})
console.dir(modelMessage, {depth: null})