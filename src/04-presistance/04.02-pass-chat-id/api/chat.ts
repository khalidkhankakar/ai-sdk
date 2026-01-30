import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';
import { openRouterModel } from '#src/model.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[]; id: string } =
    await req.json();
  const { messages, id } = body;

  console.log('id', id);

  const result = streamText({
    model: openRouterModel,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
