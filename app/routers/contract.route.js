import express from "express";
import * as ContractController from "../controllers/contract.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.post(
  "/webhook",
  ContractController.createContract
);
router.get("/", ContractController.getContracts);
router.post("/:apartmentId", isUser, ContractController.createSessionContract);
router.post("/:userId/user", isUser, ContractController.createSessionContract);
router.patch("/:contractId", isUser, ContractController.updateContract);
router.delete("/:contractId", isUser, ContractController.deleteContract);

export default router;
