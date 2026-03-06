import express from "express";
import dotenv from "dotenv";
import router from "./routes/agent-routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/ai", router);
app.listen(2000, () => {
    console.log("Server running on port 3000");
});
