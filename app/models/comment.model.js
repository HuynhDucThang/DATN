import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", commentSchema);
