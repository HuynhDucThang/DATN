import NotificationModel from "../models/notification.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";

export const createNotification = catchAsync(async (req, res, next) => {
  const body = req.body;

  const notification = await NotificationModel.create(body);

  return res.status(200).json({
    message: "Tạo cửa hàng thành công",
    data: notification,
  });
});

export const getNotifications = catchAsync(async (req, res) => {
  const userId = req.userId.id;
  const notification = await NotificationModel.find({
    toUser: userId,
  }).lean();

  res.status(200).json({
    message: "tìm kiếm cửa hàng thành công",
    data: notification,
  });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const notificationIds = req.query.notificationId;

  const notification = await NotificationModel.findByIdAndDelete({
    _id: {
      $in: [notificationIds],
    },
  });

  if (!notification) {
    return next(new ErrorHandler("Không tìm thấy thông báo này", 404));
  }

  res.status(200).json({
    message: "Xoá thành công",
    data: null,
  });
});
