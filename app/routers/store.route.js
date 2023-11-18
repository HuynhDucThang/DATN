import express from "express";
import {
  createStores,
  getStore,
  getStores,
} from "../controllers/store.controller.js";

const router = express.Router();

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file : ", req.body.owner);
    cb(null, "./app/public/stores");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
router.post("/", upload.array("images", 10), createStores);
router.get("/:storeId", getStore);
router.get("/", getStores);

export default router;
