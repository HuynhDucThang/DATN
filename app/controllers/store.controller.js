import StoreModel from "../models/store.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import reviewModel from "../models/review.model.js";
import path from "path";
import fs from "fs";

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

export const getStoreById = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;

  const [foundStore, foundReviews] = await Promise.all([
    StoreModel.findById(storeId),
    reviewModel.find({ store: storeId }).populate("author store"),
  ]);

  if (!foundStore) {
    return next(new ErrorHandler("Cửa hàng không tồn tại", 404));
  }

  let total_rating = 0;
  const ratingFields = ["serve", "price", "food_safety", "space", "smell"];

  const ratingAverages = ratingFields.reduce((result, field) => {
    const averageRating =
      foundReviews.length > 0
        ? foundReviews.reduce((sum, review) => sum + review.rating[field], 0) /
          foundReviews.length
        : 0;
    result[field] = averageRating;
    total_rating += averageRating;
    return result;
  }, {});

  return res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: {
      ...ratingAverages,
      total_rating: total_rating / 5,
      foundStore,
      foundReviews,
    },
  });
});

export const getStores = catchAsync(async (req, res, next) => {
  const search = req.query.search;

  const query = {};

  if (search) {
    query["$or"] = [
      { name: { $regex: new RegExp(search, "i") } },
      { address: { $regex: new RegExp(search, "i") } },
    ];
  }

  const stores = await StoreModel.find(query).populate("owner");

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    data: stores,
  });
});

export const uploadImagesStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;
  const foundStore = await StoreModel.findById(storeId);

  if (!foundStore) {
    return next(new ErrorHandler("Không tìm thấy bài riviu", 404));
  }

  const newImages = req.files.map((file) => file.originalname);
  foundStore.images = newImages;

  await foundStore.save();

  return res.status(200).json({
    message: "upload ảnh thành công",
    // data: newStore,
  });
});

export const getImageStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;
  const imageName = req.params.imageName;

  const imagePath = path.join("app", "public", "stores", storeId, imageName);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi đọc ảnh.");
    }

    // Trả về ảnh dưới dạng binary
    res.writeHead(200, { "Content-Type": "image/png" }); // Điều chỉnh kiểu ảnh tương ứng với loại ảnh bạn đang sử dụng
    res.end(data, "binary");
  });
});

export const getStoresByUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const stores = await StoreModel.find({
    owner: userId,
  });

  res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: stores,
  });
});

export const getTopStores = catchAsync(async (req, res, next) => {
  const topStores = await reviewModel.aggregate([
    {
      $group: {
        _id: "$store",
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

  const idsStore = topStores.map((store) => store._id);

  const result = await StoreModel.find({ _id: { $in: idsStore } });

  res.status(200).json({
    message: "Lấy thông tin top cửa hàng thành công",
    data: result,
  });
});

export const editStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;

  const store = await StoreModel.findById(storeId);

  if (!store) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  const updateData = req.body;

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const updatedStore = await store.updateOne(updateData);

  res.status(200).json({
    message: "Chỉnh sửa thành công",
    data: updatedStore,
  });
});

export const deleteStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;

  const store = await StoreModel.findById(storeId);

  if (!store) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  await store.deleteOne();

  await reviewModel.deleteMany({ store: store._id });

  res.status(200).json({
    message: "Xoá cửa hàng thành công",
    data: null,
  });
});
