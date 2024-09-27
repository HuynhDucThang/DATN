import express from "express";
import * as CommentController from "../controllers/comment.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.get("/", CommentController.getCommentByapartmentId);
router.post("/:apartmentId", isUser, CommentController.createComment);

export default router;
