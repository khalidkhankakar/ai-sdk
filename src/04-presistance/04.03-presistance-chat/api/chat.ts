import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { appendToChatMessages, createChat, getChat } from "./presistance-layer.ts";
import { openRouterModel } from "#src/model.ts";


export const POST = async (req: Request): Promise<Response> => {

    const body: {
        messages: UIMessage[];
        id: string;
    } = await req.json();

    const { messages, id } = body;

    const lastMessage = messages[messages.length - 1];


    if (!lastMessage) {
        return new Response('No last message', { status: 400 });
    }

    if (lastMessage.role !== 'user') {
        return new Response('Last message is not from user', { status: 400 });
    }


    let chat = await getChat(id);

    if (!chat) {
        const newChat = await createChat(id, messages)
        chat = newChat
    }
    else {
        await appendToChatMessages(id, [lastMessage]);
    }


    const result = streamText({
        model: openRouterModel,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
        onFinish: async ({responseMessage})=>{

            await appendToChatMessages(id, [responseMessage]);


        }
    });


}


export const GET = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');

  if (!chatId) {
    return new Response('No chatId provided', { status: 400 });
  }

  const chat = await getChat(chatId);

  return new Response(JSON.stringify(chat), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
