import mongoose from "mongoose";

const apartmentTagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  icon: {
    type: String,
  },
});

export default mongoose.model("ApartmentTag", apartmentTagSchema);
