import Reviews from "../models/reviews.model.js";
import { CatchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";

export const createReview = CatchAsync(async (req, res, next) => {
  //   console.log(req.files);
  const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path);
  const image = imageUpload.secure_url;
  const { reviewText, name, region, ratings } = req.body;
  const review = await Reviews.create({ reviewText, name, region, ratings, image });
  res.status(200).json({
    success: true,
    message: "Review Created Successfully",
    review,
  });
});
export const getReviews = CatchAsync(async (req, res, next) => {
  const reviews = await Reviews.findAll();
  res.status(200).json({
    success: true,
    message: "Review Created Successfully",
    reviews,
  });
  //   if (!reviews) {
  //     return next(new AppError("Reviews not found", 404));
  //   }
});
