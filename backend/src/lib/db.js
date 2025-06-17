import mongoose from "mongoose";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    //return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
}
