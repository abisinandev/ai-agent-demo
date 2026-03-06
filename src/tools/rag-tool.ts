import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getVectorStore } from "../rag/retreiver.js";

// Minimum cosine similarity score to consider a chunk relevant.
// Tune this value based on the scores you see in terminal logs:
// - Scores near 1.0 = very relevant
// - Scores below 0.7 for unrelated queries = raise this threshold
const SIMILARITY_THRESHOLD = 0.75;

export const ragTool = tool(
  async ({ query }) => {
    const vectorStore = await getVectorStore();

    const resultsWithScores = await vectorStore.similaritySearchWithScore(query, 5);

    console.log("\n🔍 RAG Raw Results (with scores):");
    resultsWithScores.forEach(([doc, score]: [any, number], i: number) => {
      console.log(`  [${i + 1}] Score: ${score.toFixed(3)} | "${doc.pageContent.slice(0, 80)}..."`);
    });

    const relevant = resultsWithScores.filter(([_, score]: [any, number]) => score >= SIMILARITY_THRESHOLD);

    if (relevant.length === 0) {
      console.log("  ⚠️  No relevant chunks found above threshold. Returning no-info message.");
      return "No relevant information found in the knowledge base for this query.";
    }


    return relevant.map(([doc]: [any, number]) => doc.pageContent).join("\n");
  },
  {
    name: "financial_knowledge_search",
    description:
      "Search financial knowledge about mutual funds, SEBI, and investments. Use this for ALL financial questions.",
    schema: z.object({
      query: z.string(),
    }),
  }
);