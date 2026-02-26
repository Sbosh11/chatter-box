import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authLimiter, forgotPasswordLimiter } from "../middleware/rateLimit.js";
import { upload } from "../lib/cloudinary.config.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

router.put(
  "/update-profile",
  verifyToken,
  upload.single("profilePicture"),
  updateProfile,
);
router.get("/test", (req, res) => res.send("Auth route working"));
/*router.get("/check", verifyToken, (req, res) => {
  if (req.user) {
    res.status(200).json(req.user, { message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});*/
router.get("/check", verifyToken, (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({
      user: req.user,
      message: "Authenticated",
    });
  } catch (error) {
    console.error("CHECK AUTH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
