import mongoose from "mongoose";

const apartmentAmenitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
});

export default mongoose.model("ApartmentAmentity", apartmentAmenitySchema);
