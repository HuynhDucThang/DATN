import express from "express";
import {
  createComment,
  getCommentByReviewId,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:reviewId", createComment);
router.get("/:reviewId", getCommentByReviewId);

export default router;
