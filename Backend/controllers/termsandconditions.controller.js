import TermsAndConditions from "../models/termsandconditions.model.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createTNC = CatchAsync(async (req, res, next) => {
  //   console.log(req.files);
  const termsAndConditions = await TermsAndConditions.create(req.body);
  res.status(201).json({
    success: true,
    message: "Terms and Conditions Created Successfully",
    termsAndConditions,
  });
});
export const getTNC = CatchAsync(async (req, res, next) => {
  const termsAndConditions = await TermsAndConditions.findAll();
  res.status(200).json({
    success: true,
    message: "Terms and Conditions Read Successfully",
    termsAndConditions,
  });
  //   if (!reviews) {
  //     return next(new AppError("Reviews not found", 404));
  //   }
});
export const updateTNC = CatchAsync(async (req, res, next) => {
  //   console.log(req.files);
  const _termsAndConditions = await TermsAndConditions.findByPk(1);
  const termsAndConditions = await _termsAndConditions.update(req.body);
  res.status(200).json({
    success: true,
    message: "Terms and Conditions Updated Successfully",
    termsAndConditions,
  });
});
