import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "ApartmentTag" }],
  amentities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ApartmentAmentity" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pricePerNight: String,
  rooms: {
    livingRoom: {
      type: Number,
      default: 0,
    },
    bedRoom: {
      type: Number,
      default: 0,
    },
    bathRoom: {
      type: Number,
      default: 0,
    },
  },
  numOfMinRentNight: {
    type: Number,
    default: 3,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Apartment", apartmentSchema);
