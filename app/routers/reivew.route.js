import express from "express";
import {
  createReview,
  getImageReview,
  getReviewsByStore,
  uploadImagesReview,
} from "../controllers/review.controller.js";
import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `./app/public/reviews/${req.params.reviewId}`;
    createDirectoryIfNotExists(directory);
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", createReview);
router.post(
  "/upload/:reviewId",
  upload.array("images", 10),
  uploadImagesReview
);
router.get("/:storeId", getReviewsByStore);
router.get("/image/:reviewId/:imageName", getImageReview);

export default router;
