import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await User.updateMany(
      { profilePicture: null }, // only users without a picture
      { $set: { profilePicture: "/images/avatar-placeholder.webp" } },
    );

    console.log("Migration complete:", result.modifiedCount, "users updated");
    process.exit();
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

runMigration();
