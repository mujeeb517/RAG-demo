import openai from "./config.js";
import { createClient } from '@supabase/supabase-js';
import podcasts from './content.js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.DB_URL,
    process.env.SUPBASE_API_KEY
);

async function main(input) {
    try {
        const res = await Promise.all(
            input.map(async (item) => {
                const embeddingRes = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: "Hello, world!",
                });
                return { content: item, embedding: embeddingRes.data[0].embedding };
            })
        );

        const { data, error } = await supabase
            .from("documents")
            .insert(res.map((item) => ({
                content: item.content,
                embedding: item.embedding,
            })));
        if (error) {
            console.log("Error inserting data into Supabase", error);
            return;
        }

        console.log("Data inserted into Supabase", data);
    } catch (err) {
        console.log("Error in main function", err);
    }
}


main(podcasts);