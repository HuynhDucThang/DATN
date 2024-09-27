import ApartmentModel from "../models/apartment.model.js";
import CommentModel from "../models/comment.model.js";

import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import path from "path";
import fs from "fs";
import { createDirectoryIfNotExists } from "../utils/common.js";

export const createApartment = catchAsync(async (req, res, next) => {
  const body = req.body;
  let images = [];

  const newApartment = await ApartmentModel.create({
    ...body,
    owner: req.userId.id,
  });
  const apartmentDirectory = path.join(
    "app",
    "public",
    "apartment",
    newApartment._id.toString()
  );
  createDirectoryIfNotExists(apartmentDirectory);

  if (req.files) {
    images = req.files.map((file) => file.originalname);
  }

  if (req.files) {
    images = await Promise.all(
      req.files.map(async (file) => {
        const originalName = file.originalname;
        const destinationPath = path.join(apartmentDirectory, originalName);
        const tempFilePath = path.join(
          "app",
          "public",
          "apartment",
          "temp",
          req.userId.id,
          originalName
        );

        await fs.promises.rename(tempFilePath, destinationPath);

        return `${req.protocol}://${req.get("host")}/api/apartment/${
          newApartment._id
        }/${originalName}`;
      })
    );

    await ApartmentModel.findByIdAndUpdate(
      newApartment._id,
      { images },
      { new: true }
    );
  }

  res.status(200).json({
    message: "Tạo căn hộ thành công",
    data: { ...newApartment, images },
  });
});

export const getApartmentDetail = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;

  const foundApartment = await ApartmentModel.findById(apartmentId)
    .populate("owner amentities")
    .lean();

  if (!foundApartment) {
    return next(new ErrorHandler("Căn hộ không tồn tại", 400));
  }

  return res.status(200).json({
    message: "Thành công",
    payload: foundApartment,
  });
});

export const getApartments = catchAsync(async (req, res, next) => {
  const tagIds = req.query.tag ?? [];
  const query = {};

  if (req.query.isApproved !== undefined)
    query["isApproved"] = req.query.isApproved;

  if (tagIds.length)
    query["tags"] = {
      $in: tagIds,
    };

  const apartment = await ApartmentModel.find(query)
    .populate("owner rating")
    .lean();

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    payload: apartment,
  });
});

export const uploadImagesApartment = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const foundApartment = await ApartmentModel.findById(apartmentId);

  if (!foundApartment) {
    return next(new ErrorHandler("Không tìm thấy căn hộ", 404));
  }

  const newImages = req.files.map((file) => file.originalname);
  foundApartment.images = newImages;

  await foundApartment.save();

  return res.status(200).json({
    message: "upload ảnh thành công",
    // data: newStore,
  });
});

export const getImageApartment = catchAsync(async (req, res) => {
  const apartmentId = req.params.apartmentId;
  const imageName = req.params.imageName;

  const imagePath = path.join(
    "app",
    "public",
    "apartment",
    apartmentId,
    imageName
  );
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi đọc ảnh.");
    }

    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(data, "binary");
  });
});

export const editStore = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;

  const apartment = await ApartmentModel.findById(apartmentId);

  if (!apartment) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  const updateData = req.body;

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const updatedStore = await store.apartment(updateData);

  res.status(200).json({
    message: "Chỉnh sửa thành công",
    data: updatedStore,
  });
});

export const deleteApartment = catchAsync(async (req, res, next) => {
  const { apartmentId } = req.params;

  const apartment = await ApartmentModel.findByIdAndDelete(apartmentId);

  if (!apartment) {
    return next(new ErrorHandler("Không tìm thấy căn hộ này", 404));
  }

  await Promise.all([CommentModel.deleteMany({ apartment: apartment._id })]);

  res.status(200).json({
    message: "Xoá căn hộ thành công",
    data: null,
  });
});