// This code defines a Mongoose schema for a message model in a chat application.
// The schema includes fields for the sender and receiver (both referencing the User model),
// the content of the message, and a timestamp.

import mongoose from "mongoose";
//message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
