import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { readFile } from 'fs/promises';
import openai, { supabase } from './config.js';


async function splitDocs() {
    const text = await readFile('./data/movies.txt', 'utf-8');

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 150,
        chunkOverlap: 15,
    });

    const output = await splitter.createDocuments([text]);
    return output;
}

async function storeEmeddings() {
    try {
        const chunkData = await splitDocs();

        const embeddings = await Promise.all(
            chunkData.map(async chunk => {
                const embeddingRes = await openai.embeddings.create({
                    model: 'text-embedding-ada-002',
                    input: chunk.pageContent,
                });

                return {
                    content: chunk,
                    embedding: embeddingRes.data[0].embedding,
                }
            })
        );
        const { error } = await supabase.from('movies').insert(embeddings);
        if (error) throw error;
        console.log("All embeddings generated and stored in Supabase.");
    } catch (err) {
        console.error(err);
    }
}

storeEmeddings();