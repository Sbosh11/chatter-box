import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../lib/cloudinary.config.js";
// Import necessary modules and middleware

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put(
  "/profile",
  verifyToken,
  upload.single("profilePicture"),
  updateProfile
);

export default router;
