import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../lib/cloudinary.config.js";

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
router.get("/test", (req, res) => res.send("Auth route working"));
router.get("/check", verifyToken, (req, res) => {
  if (req.user) {
    res.status(200).json(req.user, { message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
