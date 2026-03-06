import { tool } from "@langchain/core/tools";
import { z } from "zod";
export const calculator = tool(async ({ value, multiplier }) => {
    const result = value * multiplier;
    return `Result is ${result}`;
}, {
    name: "currency_calculator",
    description: "Multiply a monetary value by a number",
    schema: z.object({
        value: z.number().describe("Money value"),
        multiplier: z.number().describe("Number to multiply the value by")
    }),
});
