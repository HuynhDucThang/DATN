import ApartmentTagModel from "../models/apartmentTag.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import path from "path";
import fs from "fs";

export const createApartmentTag = catchAsync(async (req, res, next) => {
  const body = req.body;

  const fileUrl = `${req.protocol}://${req.get("host")}/apartment-tag/icon/${
    req.file.filename
  }`;

  const apartmentTag = await ApartmentTagModel.create({
    ...body,
    icon: fileUrl,
  });

  return res.status(200).json({
    message: "Tạo tag thành công",
    data: apartmentTag,
  });
});

export const getApartmentTags = catchAsync(async (req, res) => {
  const apartmentTags = await ApartmentTagModel.find().lean();

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    data: apartmentTags,
  });
});

export const getIconApartmentTag = catchAsync(async (req, res, next) => {
  const imageName = req.params.icon;

  const imagePath = path.join("app", "public", "apartment-tag", imageName);

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        return next(new ErrorHandler("Không tìm thấy ảnh", 404));
      }
      return next(new ErrorHandler("Lỗi đọc ảnh", 500));
    }

    const extname = path.extname(imageName).toLowerCase();
    let contentType = 'image/png'; 

    switch (extname) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Send the image
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data, "binary");
  });
});

export const editApartmentTag = catchAsync(async (req, res, next) => {
  const apartmentTagId = req.params.apartmentTagId;

  const apartmentTag = await ApartmentTagModel.findById(apartmentTagId);

  if (!apartmentTag) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  const updateData = req.body;

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const updatedStore = await apartmentTag.updateOne(updateData);

  res.status(200).json({
    message: "Chỉnh sửa thành công",
    data: updatedStore,
  });
});

export const deleteApartmentTag = catchAsync(async (req, res, next) => {
  const apartmentTagId = req.params.apartmentTagId;

  const apartmentTag = await ApartmentTagModel.findById(apartmentTagId);

  if (!apartmentTag) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  await apartmentTag.remove();

  res.status(200).json({
    message: "Xoá thành công",
    data: null,
  });
});
