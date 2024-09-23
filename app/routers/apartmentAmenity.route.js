import express from "express";
import * as ApartmentAmenityController from "../controllers/apartmentAmenity.controller.js";
import { isUser } from "../middlewares/authentications.js";
import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `./app/public/apartment-amenity`;
    createDirectoryIfNotExists(directory);
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
const router = express.Router();

router.get("/icon/:icon", ApartmentAmenityController.getIconApartmentAmenity);
router.get("/", isUser, ApartmentAmenityController.getapartmentAmentitys);
router.post(
  "/",
  isUser,
  upload.single("icon"),
  ApartmentAmenityController.createapartmentAmentity
);

export default router;
