import express from "express";
import { fixOldProfilePictures } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/dev/fix-profile-pics", fixOldProfilePictures);

export default router;
