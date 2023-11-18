import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  title: String,
  content: String,
  images: [String],
  rating: {
    serve: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    space: {
      type: Number,
      default: 0,
    },
    smell: {
      type: Number,
      default: 0,
    },
    food_safety: {
      type: Number,
      default: 0,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  // Thêm các trường khác như điểm số, ngày tạo, ...
});

export default mongoose.model("Review", reviewSchema);
