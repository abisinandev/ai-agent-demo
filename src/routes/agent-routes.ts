import { Router } from "express";
import { agent } from "../agent/agents.js";

const NO_INFO_MARKER = "No relevant information found in the knowledge base";
const WARNING_RESPONSE = "⚠️ I can only answer questions about mutual funds, SEBI, and investments. I don't have information on that topic in my knowledge base.";

const router = Router();
router.post("/agent", async (req, res) => {

  const { message } = req.body;
  const result = await agent.invoke({
    messages: [
      { role: "user", content: message }
    ]
  });

  const ragWasEmpty = result.messages.some(
    (m: any) => m._getType?.() === "tool" && m.content?.includes(NO_INFO_MARKER)
  );

  if (ragWasEmpty) {
    console.log("⚠️  RAG found no relevant chunks. Blocking LLM answer.");
    res.json({ response: WARNING_RESPONSE });
    return;
  }

  const finalMessage = result.messages[result.messages.length - 1];
  res.json({ response: finalMessage.content });

});

export default router;
