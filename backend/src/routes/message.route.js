import express from "express";
import {
  getUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../lib/cloudinary.config.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/:recipientId", verifyToken, getMessages);
// Text-only message
router.post(
  "/message",
  verifyToken,
  upload.array("images", 5), // Allow optional image upload
  sendMessage
);

//router.delete("/messages/:messageId", verifyToken, deleteMessage);

export default router;
