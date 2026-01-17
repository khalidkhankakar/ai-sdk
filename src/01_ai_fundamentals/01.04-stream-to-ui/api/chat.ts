import { groqModel } from '#src/model.ts';

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  const messages: UIMessage[] = body.messages;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = await convertToModelMessages(messages);

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: groqModel,
    prompt: modelMessages,
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
