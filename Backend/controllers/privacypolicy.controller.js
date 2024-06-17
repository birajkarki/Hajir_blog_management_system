import PrivacyAndPolicy from "../models/privacypolicy.model.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createPP = CatchAsync(async (req, res, next) => {
  //   console.log(req.files);
  const privacyAndPolicy = await PrivacyAndPolicy.create(req.body);
  res.status(200).json({
    success: true,
    message: "Privacy and Policy Created Successfully",
    privacyAndPolicy,
  });
});
export const getPP = CatchAsync(async (req, res, next) => {
  const privacyAndPolicy = await PrivacyAndPolicy.findAll();
  res.status(200).json({
    success: true,
    message: "Privacy and Policy Created Successfully",
    privacyAndPolicy,
  });
  //   if (!reviews) {
  //     return next(new AppError("Reviews not found", 404));
  //   }
});
