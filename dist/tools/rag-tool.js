import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getVectorStore } from "../rag/retreiver.js";
// Minimum cosine similarity score (0 to 1) to consider a chunk relevant
// Chunks below this threshold are discarded — LLM then has nothing to answer from
const SIMILARITY_THRESHOLD = 0.6;
export const ragTool = tool(async ({ query }) => {
    const vectorStore = await getVectorStore();
    // Search with scores — returns [Document, score][] pairs
    const resultsWithScores = await vectorStore.similaritySearchWithScore(query, 5);
    console.log("\n🔍 RAG Raw Results (with scores):");
    resultsWithScores.forEach(([doc, score], i) => {
        console.log(`  [${i + 1}] Score: ${score.toFixed(3)} | "${doc.pageContent.slice(0, 80)}..."`);
    });
    // Filter: only keep chunks above the similarity threshold
    const relevant = resultsWithScores.filter(([_, score]) => score >= SIMILARITY_THRESHOLD);
    if (relevant.length === 0) {
        console.log("  ⚠️  No relevant chunks found above threshold. Returning no-info message.");
        return "No relevant information found in the knowledge base for this query.";
    }
    console.log(`\n✅ ${relevant.length} relevant chunk(s) above threshold ${SIMILARITY_THRESHOLD}:`);
    relevant.forEach(([doc, score], i) => {
        console.log(`  [${i + 1}] Score: ${score.toFixed(3)} | "${doc.pageContent.slice(0, 80)}..."`);
    });
    return relevant.map(([doc]) => doc.pageContent).join("\n");
}, {
    name: "financial_knowledge_search",
    description: "Search financial knowledge about mutual funds, SEBI, and investments. Use this for ALL financial questions.",
    schema: z.object({
        query: z.string(),
    }),
});
