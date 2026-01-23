import { googleModel, groqModel } from '#src/model.ts';
import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import z from 'zod';
import * as fsTools from './file-system-functionality.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: groqModel,
    messages: modelMessages,
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      You have access to the following tools:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Use these tools to record notes, create todo lists, and edit documents for the user.

      Use markdown files to store information.
    `,
    // TODO: add the tools to the streamText call,
    tools: {
      writeFile: tool({
        description: "Write to File",
        inputSchema: z.object({
          path: z
            .string()
            .describe("The path to create the file"),
          content: z
            .string()
            .describe('The content to write to the file')
        }),

        execute: async ({ content, path }) => {
          return fsTools.writeFile(path, content);
        }
      }),
      readFile: tool({
        description: 'Read a file',
        inputSchema: z.object({
          path: z
            .string()
            .describe('The path to the file to read'),
        }),
        execute: async ({ path }) => {
          return fsTools.readFile(path);
        },
      }),
      deletePath: tool({
        description: 'Delete a file or directory',
        inputSchema: z.object({
          path: z
            .string()
            .describe(
              'The path to the file or directory to delete',
            ),
        }),
        execute: async ({ path }) => {
          return fsTools.deletePath(path);
        },
      }),
      listDirectory: tool({
        description: 'List a directory',
        inputSchema: z.object({
          path: z
            .string()
            .describe('The path to the directory to list'),
        }),
        execute: async ({ path }) => {
          return fsTools.listDirectory(path);
        },
      }),
      createDirectory: tool({
        description: 'Create a directory',
        inputSchema: z.object({
          path: z
            .string()
            .describe('The path to the directory to create'),
        }),
        execute: async ({ path }) => {
          return fsTools.createDirectory(path);
        },
      }),
      exists: tool({
        description: 'Check if a file or directory exists',
        inputSchema: z.object({
          path: z
            .string()
            .describe(
              'The path to the file or directory to check',
            ),
        }),
        execute: async ({ path }) => {
          return fsTools.exists(path);
        },
      }),
      searchFiles: tool({
        description: 'Search for files',
        inputSchema: z.object({
          pattern: z
            .string()
            .describe('The pattern to search for'),
        }),
        execute: async ({ pattern }) => {
          return fsTools.searchFiles(pattern);
        },
      }),

      weather: tool({
        description: 'Get the weather summary of a place or a location',
        inputSchema: z.object({ location: z.string().describe('The location to get the weather for') }),
        needsApproval:true,
        execute: async ({ location }, { abortSignal }) => {
          const url = `https://weather-api167.p.rapidapi.com/api/weather/forecast?place=${location}`;
          const options = {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '31a66909e4msh2a1cf4703e4e230p1d7808jsnd3536f6fd34d',
              'x-rapidapi-host': 'weather-api167.p.rapidapi.com',
              Accept: 'application/json'
            }
          };

  
            const response = await fetch(url, options);
            const res = await response.json();
            return JSON.stringify(res.list[0])
         
        },
      }),

    },
    // TODO: add a custom stop condition to the streamText call
    // to force the agent to stop after 10 steps have been taken
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse();
};
