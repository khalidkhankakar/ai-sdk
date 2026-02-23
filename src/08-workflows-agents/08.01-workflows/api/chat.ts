import { googleModel, groqModel } from '#src/model.ts';
import { generateText, streamText, type UIMessage } from 'ai';

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
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const {text} = await generateText({
    model: groqModel,
      prompt: `
      Conversation history:
      ${formatMessageHistory(messages)}
    `,
    system: WRITE_SLACK_MESSAGE_FIRST_DRAFT_SYSTEM
  }); // Write Slack message

  console.log({
    formattedMessage: formatMessageHistory(messages),
  })

  const { text: evaluatedText } = await generateText({ model: googleModel,    prompt: `
      Conversation history:
      ${formatMessageHistory(messages)}

      Slack message:
      ${text}
    `, system: EVALUATE_SLACK_MESSAGE_SYSTEM }); // Evaluate Slack message

  const finalSlackAttempt = streamText({ model: googleModel,  prompt: `
      Conversation history:
      ${formatMessageHistory(messages)}

      First draft:
      ${text}

      Previous feedback:
      ${evaluatedText}
    `, system: WRITE_SLACK_MESSAGE_FINAL_SYSTEM }); // Write final Slack message

  return finalSlackAttempt.toUIMessageStreamResponse();
};
