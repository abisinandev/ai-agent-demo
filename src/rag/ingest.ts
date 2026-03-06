import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "./embedding.js";
import { pineconeIndex } from "./pinecone.js";

const rawDocs = [
    new Document({
        pageContent:
            "SIP stands for Systematic Investment Plan. It allows regular investment in mutual funds. " +
            "You can invest as little as ₹500 per month. SIPs use rupee cost averaging to reduce risk. " +
            "They are ideal for long-term wealth creation. SIPs can be set up through a bank or fund house. " +
            "You can start, stop, or pause a SIP anytime.",
        metadata: { source: "mutual-funds-guide", topic: "SIP" },
    }),
    new Document({
        pageContent:
            "SEBI (Securities and Exchange Board of India) regulates the Indian securities market. " +
            "It oversees stock exchanges, brokers, and mutual fund companies. " +
            "SEBI was established in 1988 and given statutory powers in 1992. " +
            "Its main goal is to protect investor interests and promote market development. " +
            "SEBI issues guidelines for IPOs, mutual funds, and portfolio managers.",
        metadata: { source: "sebi-overview", topic: "Regulation" },
    }),
    new Document({
        pageContent:
            "Equity mutual funds invest mainly in company stocks. " +
            "They offer higher returns than debt funds but come with higher risk. " +
            "Types include large-cap, mid-cap, small-cap, and multi-cap funds. " +
            "Large-cap funds invest in top 100 companies by market cap. " +
            "Small-cap funds invest in smaller companies with high growth potential. " +
            "Equity funds are best suited for long-term goals (5+ years).",
        metadata: { source: "fund-types-guide", topic: "Equity Funds" },
    }),
];

export const ingestDocs = async () => {
    console.log("Starting ingestion process...");

    console.log("Step 1: Splitting documents into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 40,
    });

    const chunks = await splitter.splitDocuments(rawDocs);

    console.log("\nStep 2: Converting chunks to vectors...");
    const texts = chunks.map((c) => c.pageContent);
    await embeddings.embedDocuments(texts);

    console.log("\nStep 3: Storing vectors in Pinecone...");
    await PineconeStore.fromDocuments(chunks, embeddings, {
        pineconeIndex,
    });
    console.log("✓ All chunks inserted into Pinecone successfully!");
};

ingestDocs().catch(console.error);