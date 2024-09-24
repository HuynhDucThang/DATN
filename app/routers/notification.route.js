import express from "express";
import * as NotificationController from "../controllers/notification.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.delete("/", isUser, NotificationController.deleteNotification);
router.get("/", isUser, NotificationController.getNotifications);

export default router;
