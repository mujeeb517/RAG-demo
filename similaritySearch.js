import { supabase } from './config.js';
import openai from "./config.js";

async function main(input) {
    try {

        // feed all the data into supabase
        // call match_documents supabase postgres custom function 

        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input,
        });
        const embedding = embeddingRes.data[0].embedding;

        const { data } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_count: 2,
            match_threshold: 0.5
        });
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

const query = "Jamin' in the Big Easy";
main(query);

