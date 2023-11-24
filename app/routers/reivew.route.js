import express from "express";
import {
  createReview,
  deleteReview,
  editReview,
  getImageReview,
  getReviewByUser,
  getReviewDetail,
  getReviewsByNational,
  getReviewsByStore,
  getTopReviews,
  likeReview,
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
router.patch("/like/:reviewId/:userId", likeReview);
router.get("/:national/post", getReviewsByNational);
// router.get("/categories/food-national", getCategories);

router.get("/top/users", getTopReviews);
router.get("/:userId/me", getReviewByUser);
router.get("/:reviewId/detail", getReviewDetail);
router.get("/:storeId", getReviewsByStore);
router.get("/image/:reviewId/:imageName", getImageReview);

router.patch("/:reviewId", editReview);
router.delete("/:reviewId", deleteReview);

export default router;
