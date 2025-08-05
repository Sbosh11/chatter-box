import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { fixOldProfilePictures } from "./controllers/user.controller.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cookieParser()); // Middleware to parse cookies

const port = process.env.PORT || 5001;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
); // Middleware for CORS
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/dev/fix-profile-pics", fixOldProfilePictures); // Route to fix old profile pictures
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  connectDB();
});
