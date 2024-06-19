import Mail from "../models/mail.model.js";
import Reviews from "../models/reviews.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createMail = CatchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return next(new AppError("Please fill the form completely"));
  }
  const mail = await Mail.create({
    name,
    email,
    message,
  });
  res.status(200).json({
    success: true,
    message: "Message Sent Successfully",
    mail,
  });
});
export const getMails = CatchAsync(async (req, res, next) => {
  const mails = await Mail.findAll();
  res.status(200).json({
    success: true,
    result: mails.length,
    message: "Mails Fetched Successfully",
    mails,
  });
});
export const getMail = CatchAsync(async (req, res, next) => {
  const mail = await Mail.findByPk(req.params.id);
  res.status(200).json({
    success: true,
    message: "Review Fetched Successfully",
    mail,
  });
});
