import StoreModel from "../models/store.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";

export const createStores = catchAsync(async (req, res, next) => {
  const body = req.body;
  let images = [];

  if (req.files) {
    images = req.files.map((file) => file.originalname);
  }

  const newStore = await StoreModel.create({ ...body, images });

  res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: newStore,
  });
});

export const getStore = catchAsync(async (req, res, next) => {});

export const getStores = catchAsync(async (req, res, next) => {
  const stores = await StoreModel.find();
  
  res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: stores,
  });
});
