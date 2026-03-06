import { Router } from "express";
import { agent } from "../agent/agents.js";
const router = Router();
router.post("/agent", async (req, res) => {
    const { message } = req.body;
    const result = await agent.invoke({
        messages: [
            { role: "user", content: message }
        ]
    });
    console.log("Results: ", result);
    const finalMessage = result.messages[result.messages.length - 1];
    res.json({
        response: finalMessage.content
    });
});
export default router;
