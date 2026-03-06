import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || "rag-demo";

async function recreateIndex() {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

    // List existing indexes
    const { indexes } = await pinecone.listIndexes();
    const exists = indexes?.some((idx) => idx.name === INDEX_NAME);

    if (exists) {
        console.log(`Deleting existing index "${INDEX_NAME}"...`);
        await pinecone.deleteIndex(INDEX_NAME);
        console.log("Deleted.");
        // Wait a moment for deletion to propagate
        await new Promise((r) => setTimeout(r, 3000));
    }

    console.log(`Creating index "${INDEX_NAME}" with 768 dimensions...`);
    await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: 768,
        metric: "cosine",
        spec: {
            serverless: {
                cloud: "aws",
                region: "us-east-1",
            },
        },
    });

    // Wait for the index to be ready
    console.log("Waiting for index to be ready...");
    let ready = false;
    while (!ready) {
        await new Promise((r) => setTimeout(r, 3000));
        const description = await pinecone.describeIndex(INDEX_NAME);
        ready = description.status?.ready === true;
        console.log(`Status: ${description.status?.state}`);
    }

    console.log(`✓ Index "${INDEX_NAME}" is ready with 768 dimensions!`);
}

recreateIndex().catch(console.error);
