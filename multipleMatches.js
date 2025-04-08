import openai, { supabase } from "./config.js";

// Create an embedding vector representing the query
async function createEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input
    });
    return embeddingResponse.data[0].embedding;
}

async function findNearestMatch(embedding) {
    const { data } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_count: 4,
        match_threshold: 0.5
    });

    // multiple matches
    const match = data.map(item => item.content).join('\n');
    return match;
}

// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`
}];

async function getChatCompletion(text, query) {
    chatMessages.push({
        role: 'user',
        content: `Context: ${text} Question: ${query}`
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: chatMessages,
        temperature: 0.5,
        frequency_penalty: 0.5
    });
    console.log(response.choices[0].message.content);
}

const query = "The movie with that actor from Cast Away";
main(query);

async function main(input) {
    try {
        const embedding = await createEmbedding(input);
        const match = await findNearestMatch(embedding);
        await getChatCompletion(match, input);
    } catch (err) {
        console.error(err);
    }
}