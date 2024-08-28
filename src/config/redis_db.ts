import { createClient } from "redis";

export const redisClient = createClient();

export async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to redis");
  } catch (error) {
    console.log(error);
  }
}
