import { tool } from "@langchain/core/tools";
import { z } from "zod";
export const currencyTool = tool(async ({ fromCurrency, toCurrency, amount }) => {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await res.json();
    const rate = data.rates[toCurrency];
    console.log('Rate: ', rate);
    const converted = rate * amount;
    return `${amount} ${fromCurrency} equals ${converted} ${toCurrency}`;
}, {
    name: "currency_converter",
    description: "Convert money from one currency to another. Use this whenever the user asks about currency conversion.",
    schema: z.object({
        fromCurrency: z.string().describe("Currency code like INR, USD"),
        toCurrency: z.string().describe("Currency code like USD, EUR"),
        amount: z.number().describe("Amount of money to convert"),
    }),
});
