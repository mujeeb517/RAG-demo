import { CharacterTextSplitter } from 'langchain/text_splitter';
import { readFile } from 'fs/promises';


async function splitDocs() {
    const text = await readFile('./data/podcasts.txt', 'utf-8');

    const splitter = new CharacterTextSplitter({
        separator: ' ',
        chunkSize: 150,
        chunkOverlap: 15,
    });

    const output = await splitter.createDocuments([text]);
    console.log(output);
}

splitDocs();