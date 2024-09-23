import express from "express";
import * as ApartmentController from "../controllers/apartment.controller.js";

import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDirectory = `./app/public/apartment/temp/${req.userId.id}`;
    createDirectoryIfNotExists(tempDirectory);
    cb(null, tempDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  isUser,
  upload.array("images", 10),
  ApartmentController.createApartment
);
router.get("/:apartmentId", isUser, ApartmentController.getApartmentDetail);
router.get("/", isUser, ApartmentController.getApartments);
router.get(
  "/:apartmentId/:imageName",
  ApartmentController.getImageApartment
);

router.patch("/:apartmentId", isUser, ApartmentController.editStore);

router.delete("/:apartmentId", isUser, ApartmentController.deleteApartment);

export default router;
