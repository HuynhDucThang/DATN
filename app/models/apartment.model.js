import mongoose from "mongoose";
import { APARTMENT_TYPE } from "../constant/index.js";

const apartmentSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    images: [String],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "ApartmentTag" }],
    amentities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ApartmentAmentity" },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pricePerNight: String,
    address: String,
    rating: {
      cleanliness: { type: Number, required: true, default: 0 },
      accuracy: { type: Number, required: true, default: 0 },
      check_in: { type: Number, required: true, default: 0 },
      communication: { type: Number, required: true, default: 0 },
      location: { type: Number, required: true, default: 0 },
      value: { type: Number, required: true, default: 0 },
      totalScope: { type: Number, default: 0 },
    },
    type: {
      type: String,
      enum: Object.values(APARTMENT_TYPE),
    },
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
  },
  {
    timestamp: true,
  }
);

export default mongoose.model("Apartment", apartmentSchema);
