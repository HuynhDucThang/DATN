import express from "express";
import {
  login,
  register,
  getCurrentUser,
  uploadAvatar,
  getAvatar,
  getCurrentUserById,
  verifyAccount,
  getUsers,
  updateAccount,
  deleteAccount,
} from "../controllers/user.controller.js";
import { isUser } from "../middlewares/authentications.js";
import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `./app/public/avatar`;
    createDirectoryIfNotExists(directory);
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    const arrs = file.originalname.split(".");
    const typeFile = arrs[arrs.length - 1];
    cb(null, `${req.params.userId}.${typeFile}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.patch("/upload/:userId", upload.single("avatar"), uploadAvatar);
router.post("/sign-up", register);
router.post("/sign-in", login);
router.put("/verify-account", verifyAccount);
router.patch("/update/:userId", updateAccount);

router.get("/me", isUser, getCurrentUser);
router.get("/:userId", isUser, getCurrentUserById);
router.get("/avatar/:userId", getAvatar);
router.get("/", isUser, getUsers);
router.delete("/:userId", deleteAccount);

export default router;
