import ReviewModel from "../models/review.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";

export const createReview = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newStore = await ReviewModel.create(body);

  res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: newStore,
  });
});

export const getReviewsByStore = catchAsync(async (req, res, next) => {
    console.log(req);
});
