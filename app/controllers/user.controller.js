import UserModel from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandle.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import { sendCookies } from "../utils/sendCookies.js";
import path from "path";
import fs from "fs";
import { sendVerificationEmail } from "../utils/semdMail.js";
import mongoose from "mongoose";

export const register = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = await UserModel.findOne({ email: req.body.email });

  if (user) {
    return next(new ErrorHandler("User is exist", 400));
  }

  const generateCode = Math.floor(100000 + Math.random() * 900000);

  const newUser = await UserModel.create({ ...body, verifyCode: generateCode });

  sendVerificationEmail(
    newUser.email,
    newUser._id,
    generateCode,
    "Verify your account",
    "verifyUser"
  );

  sendCookies(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please, enter your email number and password", 400)
    );
  }
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Wrong Credential", 400));
  }

  if (user.verifyCode) {
    return next(new ErrorHandler("Please, check email to verify user", 400));
  }

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    return next(new ErrorHandler("Wrong password", 400));
  }

  sendCookies(user, 200, res);
});

export const logout = catchAsync((req, res, next) => {
  res.cookie("token", "null", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

export const chekcOtp = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({ phone_number: req.body.phone_number });

  if (!user) {
    return next(new ErrorHandler("Can not found user"));
  }

  if (!user.is_verify) {
    return res.status(200).json({
      is_verify: user.is_verify,
      message: "otp unverified",
    });
  }

  return res.status(200).json({
    is_verify: user.is_verify,
    message: "otp verified",
  });
});

export const checkPhoneNumber = catchAsync(async (req, res, next) => {
  const checkPhoneNumber = await UserModel.findOne({
    phone_number: req.query.phone_number,
  });

  return res.status(200).json({
    success: true,
    checkPhoneNumber: checkPhoneNumber ? true : false,
  });
});

export const getCurrentUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const foundUser = await UserModel.findById(userId).lean();

  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy người dùng", 404));
  }

  return res.status(200).json({
    success: true,
    payload: foundUser,
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, q: searchQuery } = req.query;
  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.max(parseInt(limit, 10), 6);

  const condition = {};

  if (searchQuery) {
    condition.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [users, totalUsers] = await Promise.all([
    UserModel.find(condition).skip(skip).limit(limitNumber).lean(),
    UserModel.countDocuments(condition),
  ]);

  return res.status(200).json({
    message: "Users fetched successfully",
    data: {
      users,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
      totalUsers,
    },
  });
});

export const getCurrentUser = catchAsync(async (req, res, next) => {
  const foundUser = await UserModel.findById(req.userId.id).lean();
  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy người dùng", 404));
  }

  return res.status(200).json({
    success: true,
    data: foundUser,
  });
});

export const uploadAvatar = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const foundUser = await UserModel.findById(userId);

  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy bài riviu", 404));
  }
  foundUser.avatar = `${req.protocol}://${req.get("host")}/api/users/avatar/${
    req.file.filename
  }`;

  await foundUser.save();

  return res.status(200).json({
    message: "Tải ảnh thành công",
    payload: foundUser.avatar,
  });
});

export const getAvatar = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const imagePath = path.join("app", "public", "avatar", userId);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi đọc ảnh.");
    }

    // Trả về ảnh dưới dạng binary
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(data, "binary");
  });
});

export const verifyAccount = catchAsync(async (req, res, next) => {
  const userId = req.query.id;
  const code = req.query.code;

  const foundUser = await UserModel.findById(
    new mongoose.Types.ObjectId(userId)
  );

  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy người dùng", 400));
  }

  if (!foundUser.verifyCode) {
    return next(new ErrorHandler("Người dùng đã xác thực", 400));
  }

  if (`${foundUser.verifyCode}` !== `${code}`) {
    return next(new ErrorHandler("Mã xác thực không đúng", 400));
  }

  foundUser.verifyCode = null;
  await foundUser.save();

  return res.status(200).json({
    message: "Xác thực thành công",
    payload: null,
  });
});

export const updateAccount = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const body = req.body;

  const foundUser = await UserModel.findById(
    new mongoose.Types.ObjectId(userId)
  );

  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy người dùng", 400));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: body },
    { new: true }
  );

  if (!updatedUser) {
    return next(new ErrorHandler("Cập nhật thông tin không thành công", 500));
  }

  return res.status(200).json({
    message: "Cập nhật thành công",
    payload: updatedUser,
  });
});

export const deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const foundUser = await UserModel.findById(
    new mongoose.Types.ObjectId(userId)
  );

  if (!foundUser) {
    return next(new ErrorHandler("Không tìm thấy người dùng", 400));
  }

  await UserModel.findByIdAndDelete(userId);

  return res.status(200).json({
    message: "Xóa thành công",
    payload: null,
  });
});
