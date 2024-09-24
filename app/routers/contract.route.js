import express from "express";
import * as ContractController from "../controllers/contract.controller.js";
import { isUser } from "../middlewares/authentications.js";

const router = express.Router();

router.get("/", isUser, ContractController.getContracts);
router.post("/:apartmentId", isUser, ContractController.createContract);

export default router;
