import mongoose from "mongoose";
import dotenv from "dotenv";

// load .env file
dotenv.config();

const connectionString = process.env.MONGO_URL || "";

export const db = mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error.message));
