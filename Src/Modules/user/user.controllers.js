import dotenv from "dotenv";
dotenv.config(); // Ensure environment variables are loaded
import userModel from "../../../Models/user.Models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customAlphabet } from "nanoid";
//?================================================
//!=========  signUp   =============
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, cPassword, phone, address, age, role } =
    req.body;
  //================
  const emailExist = await userModel.findOne({ email: email.toLowerCase() });
  emailExist && next(new AppError("email is already exist", 409));
  //================
  if (password !== cPassword) {
    return next(new AppError("Passwords do not match", 400));
  }
  //================
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const link = `${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`;
  //================
  const rfToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET);
  const rfLink = `${req.protocol}://${req.headers.host}/user/refreshToken/${rfToken}`;
  //================
  //to send email
  const checkSendEmail = await sendEmail(
    email,
    "confirm Your Email",
    `<a href="${link}"> confirm your email </a> <br> <a href="${rfLink}"> click here to resend the link</a>`
  );
  if (!checkSendEmail) {
    return next(new AppError("email not send", 400));
  }
  //================
  //to hash password
  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  //================
  let user = await userModel.create({
    name,
    email,
    password: hash,
    cPassword: hash,
    age,
    phone,
    address,
    role,
    passwordChangedAt: new Date(),
  });
  //*=====================================
  user
    ? res.status(201).json({ msg: "success", user })
    : next(new AppError("user not created", 400));
});

//?================================================
//?================================================
//!=========  verifyEmail   =============
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  //================
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.email) {
    return next(new AppError("invalid token", 404));
  }
  //================
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    {
      confirmed: true,
    },
    { new: true }
  );
  user
    ? res.status(201).json({ msg: "success" })
    : next(new AppError("user not found or already confirmed", 404));

  //================
  user
    ? res.status(200).json({ msg: "success" })
    : next(new AppError("error", 500));
});
//?================================================
//!=========  refreshToken   =============
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { rftoken } = req.params;
  //================
  const decoded = jwt.verify(rftoken, process.env.JWT_REFRESH_SECRET);
  if (!decoded?.email) {
    return next(new AppError("invalid payload", 404));
  }
  //================
  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
  });
  if (user) {
    next(new AppError("user not exist or already confirmed", 404));
  }
  //================
  const token = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, {
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`;
  //================
  //to send email
  const checkSendEmail = await sendEmail(
    decoded.email,
    "confirm Your Email",
    `<a href="${link}"> confirm your email </a>`
  );
  if (!checkSendEmail) {
    next(new AppError("email not send", 400));
  }
  //================
  res.status(200).json({ msg: "success" });
});
//?================================================
//!=========  forgetPassword   =============
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //================
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  //================
  const code = customAlphabet("1234567890", 5);
  const newCode = code();
  //================
  //to send email
  const checkSendEmail = await sendEmail(
    email,
    "code for reset Your Password",
    `<h1>your code is ${newCode} </h1>`
  );
  if (!checkSendEmail) {
    return next(new AppError("email not send", 400));
  }
  //================
  await userModel.updateOne(
    { email },
    {
      code: newCode,
    }
  );
  //================
  res.status(200).json({ msg: "success" });
});
//================================================================
//!=========  resetPassword   =============
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  //================
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  //================
  if (code !== user.code) {
    return next(new AppError("code not correct", 404));
  }
  //================
  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  //================
  await userModel.updateOne(
    { email },
    {
      code: "",
      password: hash,
      cPassword: hash,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );
  //================
  res.status(200).json({ msg: "success" });
});
//================================================================
//!=========  signIn   =============
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //================
  const user = await userModel.findOne({
    email: email.toLowerCase(),
    confirmed: true,
  });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  //================
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new AppError("password not correct", 404));
  }
  //================
  const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  //================
  await userModel.updateOne({ email }, { loggedIn: true });
  //================
  res.status(200).json({ msg: "success", token });
});
//================================================
//!=========  getAllUsers   =============
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({ msg: "success", data: users });
});
//================================================
//!=========  getUser   =============
export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ msg: "success", data: user });
});
//================================================
//!=========  updateUser   =============
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, phone, address, age } = req.body;

  // Find the user by ID
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update user fields
  if (name) user.name = name;
  if (email) {
    const emailExist = await userModel.findOne({ email: email.toLowerCase() });
    if (emailExist && emailExist._id.toString() !== id) {
      return next(new AppError("Email already exists", 409));
    }
    user.email = email.toLowerCase();
  }
  if (password) {
    const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    user.password = hash;
    user.cPassword = hash;
    user.passwordChangedAt = new Date();
  }
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (age) user.age = age;

  // Save updated user
  await user.save();

  res.status(200).json({ msg: "User updated successfully", data: user });
});
//================================================
//!=========  deleteUser   =============
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ msg: "success", data: user });
});
