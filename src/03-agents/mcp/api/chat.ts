import { googleModel, groqModel, openRouterModel } from '#src/model.ts';
import {webSearch} from "@exalabs/ai-sdk"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] = await convertToModelMessages(messages)

  const streamTextResult = streamText({
    model: openRouterModel,
    prompt: modelMessages,
    tools: {
      webSearch: webSearch()
    },
    stopWhen: stepCountIs(3)
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
