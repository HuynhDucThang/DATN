import ReviewModel from "../models/review.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import path from "path";
import fs from "fs";
import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import storeModel from "../models/store.model.js";
import reviewModel from "../models/review.model.js";

export const createReview = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newStore = await ReviewModel.create(body);

  return res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: newStore,
  });
});

export const getReviewsByStore = catchAsync(async (req, res, next) => {
  console.log(req);
});

export const uploadImagesReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const foundReview = await ReviewModel.findById(reviewId);

  if (!foundReview) {
    return next(new ErrorHandler("Không tìm thấy bài riviu", 404));
  }

  const newImages = req.files.map((file) => file.originalname);
  foundReview.images = newImages;

  await foundReview.save();

  return res.status(200).json({
    message: "Tạo bài review thành công",
    // data: newStore,
  });
});

export const getImageReview = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const imageName = req.params.imageName;

  const imagePath = path.join("app", "public", "reviews", reviewId, imageName);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi đọc ảnh.");
    }

    // Trả về ảnh dưới dạng binary
    res.writeHead(200, { "Content-Type": "image/png" }); // Điều chỉnh kiểu ảnh tương ứng với loại ảnh bạn đang sử dụng
    res.end(data, "binary");
  });
});

export const getReviewDetail = catchAsync(async (req, res, next) => {
  const foundReview = await ReviewModel.findById(req.params.reviewId)
    .populate({
      path: "author",
      model: "User",
    })
    .populate({
      path: "store",
      model: "Store",
    })
    .populate({
      path: "comments",
      options: { sort: { created_at: -1 } },
      populate: {
        path: "author",
        model: "User",
      },
    });

  res.status(200).json({
    message: "Lấy thông tin bài review thành công",
    data: foundReview,
  });
});

export const getReviewByUser = catchAsync(async (req, res, next) => {
  const foundReview = await ReviewModel.find({
    author: req.params.userId,
  }).populate({
    path: "author",
    model: "User",
  });

  res.status(200).json({
    message: "Lấy thông tin bài review thành công",
    data: foundReview,
  });
});

export const getTopReviews = catchAsync(async (req, res, next) => {
  const topUsers = await ReviewModel.aggregate([
    {
      $group: {
        _id: "$author",
        reviewCount: { $sum: 1 },
      },
    },
    {
      $sort: { reviewCount: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const idsUser = topUsers.map((user) => user._id);

  const result = await userModel.find({ _id: { $in: idsUser } });

  res.status(200).json({
    message: "Lấy user top review",
    data: result,
  });
});

export const getReviewsByNational = catchAsync(async (req, res, next) => {
  const national = req.params.national;
  const rating = req.query.rating;

  const stores = await storeModel.find({ cuisine_national: national });

  // Lấy danh sách các ObjectId của các cửa hàng
  const storeIds = stores.map((store) => store._id);

  // Tìm các reviews có store là một trong những cửa hàng thuộc danh sách trên
  const reviews = await ReviewModel.find({ store: { $in: storeIds } }).populate(
    "author store"
  );

  let filteredReviews = [...reviews];

  if (rating) {
    filteredReviews = reviews.filter((review) => {
      const total_rating = Math.ceil(
        (review.rating.serve +
          review.rating.price +
          review.rating.space +
          review.rating.smell +
          review.rating.food_safety) /
          5
      );

      return total_rating === parseInt(rating);
    });
  }

  res.status(200).json({
    message: "Lấy user top review",
    data: filteredReviews,
  });
});

export const likeReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return next(new ErrorHandler("Không tìm thấy bài riviu", 404));
  }

  const isFavorited = review.favourities.includes(userId);

  if (isFavorited) {
    await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { $pull: { favourities: userId } },
      { new: true }
    );
  } else {
    await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { $push: { favourities: userId } },
      { new: true }
    );
  }

  res.status(200).json({
    message: "Thay đổi trạng thái thành công",
    data: null,
  });
});



export const editReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;

  const review = await reviewModel.findById(reviewId);

  if (!review) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  const updateData = req.body;

  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const updatedStore = await review.updateOne(updateData);

  res.status(200).json({
    message: "Chỉnh sửa thành công",
    data: updatedStore,
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;

  const review = await reviewModel.findById(reviewId);

  if (!review) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  await review.remove();

  res.status(200).json({
    message: "Xoá bài review thành công",
    data: null,
  });
});
