import { groqModel } from '#src/model.ts';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type UIMessage,
} from 'ai';

// TODO: replace all instances of UIMessage with MyMessage
export type MyMessage = UIMessage<
  unknown,
  {
    'slack-message':string;
    'slace-message-feedback': string
    
  }
>;

const formatMessageHistory = (messages: UIMessage[]) => {
  return messages
    .map((message) => {
      return `${message.role}: ${message.parts
        .map((part) => {
          if (part.type === 'text') {
            return part.text;
          }

          return '';
        })
        .join('')}`;
    })
    .join('\n');
};

const WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM = `You are writing a Slack message for a user based on the conversation history. Only return the Slack message, no other text.`;
const EVALUATE_SLACK_MESSAGE_SYSTEM = `You are evaluating the Slack message produced by the user.

  Evaluation criteria:
  - The Slack message should be written in a way that is easy to understand.
  - It should be appropriate for a professional Slack conversation.
`;
const WRITE_SLACK_MESSAGE_FINAL_SYSTEM = `You are writing a Slack message based on the conversation history, a first draft, and some feedback given about that draft.

  Return only the final Slack message, no other text.
`;

export const POST = async (req: Request): Promise<Response> => {
  // TODO: change to MyMessage[]
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const stream = createUIMessageStream<MyMessage>({
    execute: async ({ writer }) => {
      // TODO: write a { type: 'start' } message via writer.write
        writer.write({
            type: 'start'
        })
      // TODO - change to streamText and write to the stream as custom data parts
      const writeSlackResult = streamText({
        model:groqModel,
        system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}
        `,
      });

      const msgId = crypto.randomUUID();
      let firstDraft = '';

      for await (const message of writeSlackResult.textStream) {
        firstDraft += message;
        writer.write({
          id: msgId,
          type: 'data-slack-message',
          data: firstDraft,
        });
      }



  

      // TODO - change to streamText and write to the stream as custom data parts
      const evaluateSlackResult = streamText({
        model: groqModel,
        system: EVALUATE_SLACK_MESSAGE_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          Slack message:
          ${writeSlackResult.text}
        `,
      });

      const msgFId = crypto.randomUUID();
      let feedbackDraft = '';

      for await (const message of writeSlackResult.textStream) {
        feedbackDraft += message;
        writer.write({
          id: msgId,
          type: 'data-slace-message-feedback',
          data: feedbackDraft,
        });
      }


      const finalSlackAttempt = streamText({
        model: groqModel,
        system: WRITE_SLACK_MESSAGE_FINAL_SYSTEM,
        prompt: `
          Conversation history:
          ${formatMessageHistory(messages)}

          First draft:
          ${firstDraft}

          Previous feedback:
          ${feedbackDraft}
        `,
      });

      // TODO: merge the final slack attempt into the stream,
      // sending sendStart: false
      writer.merge(finalSlackAttempt.toUIMessageStream({
        sendStart: false
      }));
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
