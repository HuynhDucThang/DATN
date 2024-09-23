import ApartmentAmentityModel from "../models/apartmentAmentity.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import path from "path";
import fs from "fs";

export const createapartmentAmentity = catchAsync(async (req, res, next) => {
  const body = req.body;

  const fileUrl = `${req.protocol}://${req.get("host")}/api/apartment-amenity/icon/${
    req.file.filename
  }`;

  const apartmentAmentity = await ApartmentAmentityModel.create({
    ...body,
    icon: fileUrl,
  });

  return res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: apartmentAmentity,
  });
});

export const getapartmentAmentitys = catchAsync(async (req, res) => {
  const apartmentAmentitys = await ApartmentAmentityModel.find().lean();

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    data: apartmentAmentitys,
  });
});

export const getIconApartmentAmenity = catchAsync(async (req, res, next) => {
  const imageName = req.params.icon;

  const imagePath = path.join("app", "public", "apartment-amenity", imageName);
  
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

export const editapartmentAmentity = catchAsync(async (req, res, next) => {
  const apartmentAmentityId = req.params.apartmentAmentityId;

  const apartmentAmentity = await ApartmentAmentityModel.findById(apartmentAmentityId);

  if (!apartmentAmentity) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  const updateData = req.body;

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const updatedStore = await apartmentAmentity.updateOne(updateData);

  res.status(200).json({
    message: "Chỉnh sửa thành công",
    data: updatedStore,
  });
});

export const deleteapartmentAmentity = catchAsync(async (req, res, next) => {
  const apartmentAmentityId = req.params.apartmentAmentityId;

  const apartmentAmentity = await ApartmentAmentityModel.findById(apartmentAmentityId);

  if (!apartmentAmentity) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  await apartmentAmentity.remove();

  res.status(200).json({
    message: "Xoá thành công",
    data: null,
  });
});
