import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { USER_ROLE } from "../constant/index.js";

const userSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Hãy nhập mật khẩu của bạn !!"],
      minLength: [6, "Password should have more than 8 characters"],
      select: false,
    },
    name: {
      type: String,
      // required: [true, "Please enter your name !!"],
      minLength: [4, "Name should have more than 4 characters !!"],
      maxLength: [30, "Name can't exceed than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Hãy nhập mật khẩu của bạn !!"],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    verifyCode: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    refreshPasswordToken: String,
    refreshPasswordExpire: Date,
    // automate delete before 1 minute createdAt : {type : Date, expires : '1m', default: Date.now}
  },
  {
    timestamp: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWT = async function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

userSchema.methods.getRefreshToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding resetPasswordToken to userSchema

  this.refreshPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.refreshPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
