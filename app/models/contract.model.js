import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  information: {
    totalMember: Number,
    totalPrice: Number,
  },
  status: {
    type: String,
  },
  content: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Contract", contractSchema);
