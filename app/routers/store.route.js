import express from "express";
import {
  createStores,
  getStoreById,
  getStores,
  getImageStore,
  uploadImagesStore,
} from "../controllers/store.controller.js";

import multer from "multer";
import { createDirectoryIfNotExists } from "../utils/common.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = `./app/public/stores/${req.params.storeId}`;
    createDirectoryIfNotExists(directory);
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 10), createStores);
router.post("/upload/:storeId", upload.array("images", 10), uploadImagesStore);

router.get("/:storeId", getStoreById);
router.get("/", getStores);
// Endpoint để lấy và hiển thị ảnh
router.get("/image/:storeId/:imageName", getImageStore);

export default router;
