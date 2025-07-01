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
  "/update-profile",
  verifyToken,
  upload.single("profilePicture"),
  updateProfile
);

router.get("/check", verifyToken, (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
