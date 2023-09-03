import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

const url = process.env.MONGODB_CONNECTION_STRING;

const server = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server is running localhost:3000");
    });
  } catch (err) {
    console.error("MongoDB connection filled!!", err);
    console.err(err), process.exit(1);
  }
};

server();
