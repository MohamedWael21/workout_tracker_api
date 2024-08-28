import mongoose from "mongoose";
import app from "./app";
import connectToMongoose from "./config/mongoose_db";
import { connectToRedis, redisClient } from "./config/redis_db";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);

  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }

  try {
    await redisClient.quit();
    console.log("Redis connection closed.");
  } catch (err) {
    console.error("Error closing Redis connection:", err);
  }

  server.close((err) => {
    if (err) {
      console.error("Error closing Express server:", err);
      process.exit(1);
    }

    console.log("Express server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
connectToMongoose();
connectToRedis();
