import NotificationModel from "../models/notification.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import path from "path";
import fs from "fs";

export const createNotification = catchAsync(async (req, res, next) => {
  const body = req.body;

  const notification = await NotificationModel.create(body);

  return res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: notification,
  });
});

export const getNotifications = catchAsync(async (req, res) => {
  const notification = await NotificationModel.find().lean();

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    data: notification,
  });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const notificationId = req.params.notificationId;

  const notification = await NotificationModel.findById(notificationId);

  if (!notification) {
    return next(new ErrorHandler("Không tìm thấy địa điểm này", 404));
  }

  await notification.remove();

  res.status(200).json({
    message: "Xoá thành công",
    data: null,
  });
});
