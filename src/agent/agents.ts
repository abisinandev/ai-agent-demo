import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { currencyTool } from "../tools/currency-tool.js";

import { ChatOllama } from "@langchain/ollama";
import { calculator } from "../tools/currency-calculator.js";

export const llm = new ChatOllama({
    model: "mistral",
    temperature: 0
});

export const agent = createReactAgent({
    llm,
    tools: [currencyTool, calculator],

    messageModifier: `
    You are a financial assistant.

    If the user asks about currency conversion,
    you MUST use the currency_converter tool.
    if user ask about multiply money use calculator.
    Never generate math questions.
    Never invent numbers.
    Always call the tool for currency conversion.
    `,
});