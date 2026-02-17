import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { fixOldProfilePictures } from "./controllers/user.controller.js";
import cors from "cors";
import { globalLimiter } from "./middleware/rateLimit.js";
import helmet from "helmet";

dotenv.config();
const app = express();
app.use(cookieParser()); // Middleware to parse cookies
app.use(globalLimiter);
app.use(helmet()); // Basic security headers
app.use((req, res, next) => {
  const ua = req.headers["user-agent"];

  if (!ua) {
    return res.status(403).send("Bots not allowed");
  }

  next();
});

const port = process.env.PORT || 5001;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  }),
); // Middleware for CORS
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/dev/fix-profile-pics", fixOldProfilePictures); // Route to fix old profile pictures

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  connectDB();
});
