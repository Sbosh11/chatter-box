import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Assuming verifyToken sets this

    const users = await User.find(
      { _id: { $ne: currentUserId } }, // Exclude current user
      "username email profilePicture", // Only return needed fields
    );

    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
};
//fetch the conversation between the logged-in user and another user sorted by date
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: -1 }) // Newest message first
      .exec();

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send("Error fetching messages");
  }
};
//send a message to another user

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, text } = req.body;

    const images = Array.isArray(req.files)
      ? req.files.map((file) => file.path)
      : [];

    // Reject if recipientId is missing or message content is empty (no text, no images)
    if (!recipientId || (!text?.trim() && images.length === 0)) {
      return res
        .status(400)
        .send("Message content is empty or recipient missing");
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content: text,
      images,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).send("Failed to send message");
  }
};
