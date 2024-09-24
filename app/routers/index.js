import express from "express";

import userRouter from "./user.route.js";
import apartmentRouter from "./apartment.route.js";
import apartmentTagRoute from "./apartmentTag.route.js";
import apartmentAmenityRoute from "./apartmentAmenity.route.js";
import contractRoute from "./contract.route.js";
import commentRoute from "./comment.route.js";
import notificationRoute from "./notification.route.js";

const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/apartment", apartmentRouter);
router.use("/api/apartment-tag", apartmentTagRoute);
router.use("/api/apartment-amenity", apartmentAmenityRoute);
router.use("/api/comment", commentRoute);
router.use("/api/contract", contractRoute);
router.use("/api/notification", notificationRoute);

export default router;
