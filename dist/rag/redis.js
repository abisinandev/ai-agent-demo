import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
export const INDEX_NAME = process.env.REDIS_INDEX_NAME || "rag-demo";
export const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD || "TgYkYotVUVrnGr3X1P6kyEvjz798rYem",
    socket: {
        host: process.env.REDIS_HOST || "redis-17721.crce206.ap-south-1-1.ec2.cloud.redislabs.com",
        port: parseInt(process.env.REDIS_PORT || "17721"),
    },
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
};
