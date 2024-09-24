import ContractModel from "../models/contract.model.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";

export const createContract = catchAsync(async (req, res, next) => {
  const body = req.body;

  const contract = await ContractModel.create(body);

  return res.status(200).json({
    message: "Tạo hợp đồng thành công",
    data: contract,
  });
});

export const getContracts = catchAsync(async (req, res) => {
  const userId = req.userId.id;
  const contract = await ContractModel.find({
    toUser: userId,
  }).lean();

  res.status(200).json({
    message: "tìm kiếm hợp đồng thành công",
    data: contract,
  });
});
