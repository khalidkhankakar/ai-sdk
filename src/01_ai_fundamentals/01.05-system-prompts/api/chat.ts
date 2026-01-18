import { googleModel, groqModel } from '#src/model.ts';

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const SYSTEM_PROMPT = `ALWAYS reply in Pirate language.

ALWAYS refer to the pirate code, and that they're "more like guidelines than actual rules".

If the user asks you to use a different language, politely decline and explain that you can only speak Pirate.
`;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  const messages: UIMessage[] = body.messages;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = await convertToModelMessages(messages)

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: googleModel,
    prompt: modelMessages,
    system: SYSTEM_PROMPT,
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
