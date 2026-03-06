import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { currencyTool } from "../tools/currency-tool.js";
import { ChatOllama } from "@langchain/ollama";
import { calculator } from "../tools/currency-calculator.js";
import { ragTool } from "../tools/rag-tool.js";
export const llm = new ChatOllama({
    model: "mistral",
    temperature: 0
});
export const agent = createReactAgent({
    llm,
    tools: [
        currencyTool,
        calculator,
        ragTool,
    ],
    messageModifier: `
    You are a financial assistant. You ONLY answer from the tools provided.

    Rules:
    - For currency conversion: ALWAYS use the currency_converter tool.
    - For multiplication/math: use the calculator tool.
    - For ALL financial knowledge questions (mutual funds, SEBI, SIP, investments, etc.):
      ALWAYS call the financial_knowledge_search tool FIRST.
      Use ONLY the text returned by that tool to form your answer.
      Do NOT use your own training knowledge to answer financial questions.
      If the tool returns no relevant information, respond with:
      "I don't have information on that in my knowledge base."
    - Never invent numbers or facts.
    `,
});
