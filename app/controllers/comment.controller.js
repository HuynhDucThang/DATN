import CommentModel from "../models/comment.model.js";
import ApartmentModel from "../models/apartment.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";

export const createComment = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const foundApartment = await ApartmentModel.findById(apartmentId).lean();

  if (!foundApartment) {
    return next(new ErrorHandler("Không tìm thấy bài riviu", 404));
  }

  const newComment = new CommentModel(req.body);
  await newComment.save();

  res.status(200).json({
    message: "Tạo bình luận thành công",
    data: newComment,
  });
});

export const getCommentByapartmentId = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;

  const comments = await CommentModel.find({
    apartment: apartmentId,
  }).populate("author").lean();

  res.status(200).json({
    message: "Lấy thông tin bình luận thành công",
    data: comments,
  });
});
