import express from "express";
import * as ContractController from "../controllers/contract.controller.js";

const router = express.Router();

router.post(
  "/webhook-stripe",
  ContractController.createContract
);

export default router;
