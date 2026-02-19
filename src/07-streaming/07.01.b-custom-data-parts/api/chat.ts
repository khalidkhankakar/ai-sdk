import { googleModel } from '#src/model.ts';
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText, type UIMessage } from 'ai';




export type MyUIMessage = UIMessage<
    never, // metadata type
    {
        weather: {
            city: string;
            weather?: string;
            status: 'loading' | 'success';
        };
        notification: {
            message: string;
            level: 'info' | 'warning' | 'error';
        };
    }
>;


export const POST = async (req: Request): Promise<Response> => {

    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    const stream = createUIMessageStream<MyUIMessage>({

        execute: async ({ writer }) => {


            writer.write({
                type: 'data-notification',
                data: { message: 'Processing your request...', level: 'info' },
                transient: true, // This part won't be added to message history
            });

            // 2. Send sources (useful for RAG use cases)
            writer.write({
                type: 'source-url',
                sourceId: 'source-1',
                url: 'https://weather.com',
                title: 'Weather Data Source',
            });

            // 3. Send data parts with loading state
            writer.write({
                type: 'data-weather',
                id: 'weather-1',
                data: { city: 'San Francisco', status: 'loading' },
            });

            const result = streamText({
                model: googleModel,
                messages: await convertToModelMessages(messages),
                onFinish() {
                    // 4. Update the same data part (reconciliation)
                    writer.write({
                        type: 'data-weather',
                        id: 'weather-1', // Same ID = update existing part
                        data: {
                            city: 'San Francisco',
                            weather: 'sunny',
                            status: 'success',
                        },
                    });

                    // 5. Send completion notification (transient)
                    writer.write({
                        type: 'data-notification',
                        data: { message: 'Request completed', level: 'info' },
                        transient: true, // Won't be added to message history
                    });
                },
            });

            writer.merge(result.toUIMessageStream());

        }


    })

    return createUIMessageStreamResponse({
        stream,
    });

}
