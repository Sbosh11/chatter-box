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
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user:", req.user); // should show _id or id

    const { username, email, profilePicture } = req.body;
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing from token." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

export default router;
