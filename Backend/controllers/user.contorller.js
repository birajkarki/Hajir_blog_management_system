import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import createSendToken from "../utils/token.js";
import crypto from "crypto";
import { Op } from "sequelize";

export const registerUser = CatchAsync(async (req, res, next) => {
  const { username, email, password, roles } = req.body;

  // console.log(username, email, password);

  const checkEmail = await User.findOne({ where: { email } });
  if (checkEmail) {
    return next(new AppError("User already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);
  let user = await User.create({
    username,
    email,
    password: hashedPassword,
    roles,
  });
  // console.log(user);

  createSendToken(user, "User Registered Successfully", 201, res);
});

export const loginUser = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("Invalid credentials!", 404));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid credentials!", 404));
  }

  createSendToken(user, "User Logged In Successfully", 200, res);
});

export const forgetPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    res.status(201).json({
      success: true,
      message: `Email sent to sandipstha139@gmail.com successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validate: false });

    return next(new AppError(err.message, 500));
  }
});

export const resetPassword = CatchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  let user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError("Token Expired or Invalid!", 404));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save({ validate: true });

  createSendToken(user, "Password Reset Successfully", 200, res);
});

export const getAllUser = CatchAsync(async (req, res, next) => {
  const users = await User.findAll();

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

export const deleteUser = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(req.params.id);
  await User.destroy({ where: { id } });

  res.status(200).json({
    status: "success",
    message: "User deleted Successfully",
  });
});

export const logoutUser = CatchAsync(async (req, res, next) => {
  res
    .status(200)
    .cookie("jwt", " ", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged out Successfully!",
    });
});

export const getUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  res.status(200).json({
    status: "success",
    message: "User data fetched Successfully",
    user,
  });
});

export const getMe = CatchAsync(async (req, res, next) => {
  // console.log(req.user);
  req.params.id = req.user.dataValues.id;
  next();
});
