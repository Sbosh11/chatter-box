import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();
app.use(cookieParser()); // Middleware to parse cookies

const port = process.env.PORT || 5001;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  connectDB();
});
