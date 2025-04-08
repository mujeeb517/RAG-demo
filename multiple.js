import openai from "./config.js";

async function main(input) {
    const res = await Promise.all(
        input.map(async (item) => {
            const embeddingRes = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: "Hello, world!",
            });
            return { content: item, embedding: embeddingRes.data[0].embedding };
        })
    );

    console.log("All embeddings generated.", res)
}

const input = [
    "Hello, world!",
    "How are you?",
    "What is your name?",
    "Where do you live?",
    "What is your favorite color?",
];
main(input);