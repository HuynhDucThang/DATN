import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  raing: {
    cleanliness: { type: Number, required: true, default: 0 },
    accuracy: { type: Number, required: true, default: 0 },
    check_in: { type: Number, required: true, default: 0 },
    communication: { type: Number, required: true, default: 0 },
    location: { type: Number, required: true, default: 0 },
    value: { type: Number, required: true, default: 0 },
    totalScope: { type: Number, default: 0 },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", commentSchema);
