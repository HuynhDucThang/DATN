import ErrorHandler from "../utils/errorHandle.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization.split(" ");
  const token = bearer?.[1];

  if (!token) {
    return next(new ErrorHandler("Your must authentication !!", 400));
  }
  
  const userId = jwt.verify(token, process.env.JWT_SECRET);

  if (!userId) {
    return next(new ErrorHandler("Token Wrong !!", 400));
  }

  req.userId = userId;

  next();
};

export const isUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userId) {
      next();
    } else {
      return next(new ErrorHandler(400, "user is not authentication"));
    }
  });
};
