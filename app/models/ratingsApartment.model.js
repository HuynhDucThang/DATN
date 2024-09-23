import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  cleanliness: { type: Number, required: true, default: 0 },
  accuracy: { type: Number, required: true, default: 0 },
  check_in: { type: Number, required: true, default: 0 },
  communication: { type: Number, required: true, default: 0 },
  location: { type: Number, required: true, default: 0 },
  value: { type: Number, required: true, default: 0 },
  totalScope: { type: Number, default: 0 },
});

export default mongoose.model("RatingsApartment", ratingSchema);
