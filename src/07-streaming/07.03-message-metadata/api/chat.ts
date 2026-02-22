import { googleModel } from '#src/model.ts';
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import z from 'zod';


export const messageMetadataSchema = z.object({
    duration: z.number(),
    totalToken: z.number().optional()
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type MyUIMessage = UIMessage<MessageMetadata>;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyUIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: googleModel,
    messages: await convertToModelMessages(messages),
  });

  // TODO: Calculate the start time of the stream
  const startTime = Date.now();

  return result.toUIMessageStreamResponse<MyUIMessage>({
    // TODO: Add the messageMetadata function here
    // If it encounters a 'finish' part, it should return the duration
    // of the stream in milliseconds
    messageMetadata: ({part}) => {
        if(part.type == 'finish'){
            return {
                duration: Date.now() - startTime,
                totalToken: part.totalUsage.totalTokens
            }
        }
    },
  });
};
