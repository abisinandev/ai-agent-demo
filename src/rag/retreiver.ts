import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "./pinecone.js";
import { embeddings } from "./embedding.js";

export const getVectorStore = async () => {
  return await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
};

export const createRetriever = async () => {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({ k: 3 });
};