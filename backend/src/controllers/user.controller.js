import User from "../models/user.model.js";

export const fixOldProfilePictures = async (req, res) => {
  try {
    const usersToFix = await User.find({
      profilePicture: "https://example.com/default-profile-picture.png",
    });

    if (usersToFix.length === 0) {
      return res.status(200).json({ message: "No users to update." });
    }

    const updates = usersToFix.map((user) => {
      user.profilePicture = `https://i.pravatar.cc/300?u=${user._id}`;
      return user.save();
    });

    await Promise.all(updates);

    res.status(200).json({ message: `Updated ${usersToFix.length} users.` });
  } catch (err) {
    console.error("Error fixing profile pictures:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};
