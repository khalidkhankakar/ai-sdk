import { googleModel, groqModel, openRouterModel } from '#src/model.ts';
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';



const tools = await createCalendarMCPClient().tools;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;

  const mcpClient = await createMCPClient({
    transport: {
      'type': "http",
      url: "http://localhost:3001",
    }
  });
  // Create a fresh MCP client per request to avoid shared state issues
  const tools = await mcpClient.tools();


  const modelMessages: ModelMessage[] = await convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: openRouterModel,
    system:
      'You are a helpful assistant with access to the user\'s Google Calendar. ' +
      'You can create, read, update, and delete calendar events. ' +
      'Always confirm with the user before making any changes to their calendar.',
    messages: modelMessages, // ✅ was `prompt`, which only accepts a string
    tools,
    stopWhen: stepCountIs(10), // ✅ increased from 3 — multi-step tool calls need more room
    onFinish: async () => {
      await mcpClient.close(); // ✅ safe to close here since client is per-request
    },
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({ stream });
};