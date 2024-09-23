import express from "express";
import * as ApartmentTagController from "../controllers/apartmentTag.controller.js";
import { isUser } from "../middlewares/authentications.js";
import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `./app/public/apartment-tag`;
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

router.get("/icon/:icon", ApartmentTagController.getIconApartmentTag);
router.get("/", isUser, ApartmentTagController.getApartmentTags);
router.post(
  "/",
  isUser,
  upload.single("icon"),
  ApartmentTagController.createApartmentTag
);

export default router;
