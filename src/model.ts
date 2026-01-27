import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

import { config } from 'dotenv';
config();

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY!,
});

export const openRouterModel = openrouter('openai/gpt-oss-120b');

export const groqModel = groq('openai/gpt-oss-20b')

export const googleModel = google('gemini-2.5-flash')