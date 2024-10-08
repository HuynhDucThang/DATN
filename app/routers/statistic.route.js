import express from "express";
import * as StatisticController from "../controllers/statistic.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.get("/overview", isUser, StatisticController.getOverviewStatistics);

export default router;