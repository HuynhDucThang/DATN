import express from "express";
import * as CommentController from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:apartmentId", CommentController.createComment);
router.get("/:apartmentId", CommentController.getCommentByapartmentId);

export default router;
