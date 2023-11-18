import express from "express";
import {
  createReview,
  getReviewsByStore,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:storeId", getReviewsByStore);
// router.get("/", getStores);

export default router;
