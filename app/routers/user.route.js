import express from "express";
import {
  login,
  register,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.post("/sign-up", register);
router.post("/sign-in", login);
router.get("/me", isUser, getCurrentUser);

export default router;
