import openai from './config.js';

async function main() {
    const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: 'Hello, world!',
    });
    console.log(embeddingRes.data[0].embedding);
}

main();