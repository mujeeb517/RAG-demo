import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});


export const supabase = createClient(
    process.env.DB_URL,
    process.env.SUPBASE_API_KEY
);

export default openai;