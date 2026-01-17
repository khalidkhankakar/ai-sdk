import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

import { config } from 'dotenv';
config();


export const groqModel = groq('openai/gpt-oss-20b')

export const googleModel = google('gemma-3-12b-it')