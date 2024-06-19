import Reviews from "../models/reviews.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";

export const createReview = CatchAsync(async (req, res, next) => {
  //   console.log(req.files);
  const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path);
  const image = imageUpload.secure_url;
  const { reviewText, name, region, ratings } = req.body;
  const review = await Reviews.create({
    reviewText,
    name,
    region,
    ratings,
    image,
  });
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
    message: "Review Fetched Successfully",
    reviews,
  });
});
export const getReview = CatchAsync(async (req, res, next) => {
  const review = await Reviews.findByPk(req.params.id);
  res.status(200).json({
    success: true,
    message: "Review Fetched Successfully",
    review,
  });
});

export const updateReview = CatchAsync(async (req, res, next) => {
  let imageUrl;
  if (req.files && req.files.image && req.files.image[0]) {
    const imageUpload = await cloudinary.uploader.upload(
      req.files.image[0].path
    );
    imageUrl = imageUpload.secure_url;
  }

  const existingReview = await Reviews.findByPk(req.params.id);

  if (!existingReview) {
    return next(new AppError("Review not found!", 404));
  }
  existingReview.reviewText = req.body.reviewText
    ? req.body.reviewText
    : existingReview.reviewText;
  existingReview.name = req.body.name ? req.body.name : existingReview.name;
  existingReview.region = req.body.region
    ? req.body.region
    : existingReview.region;
  existingReview.ratings = req.body.ratings
    ? req.body.ratings
    : existingReview.ratings;
  existingReview.image = imageUrl ? imageUrl : existingReview.image;

  await existingReview.save();
  res.status(200).json({
    status: "success",
    message: "Review Updated Successfully",
    review: existingReview,
    // updatedReview,
  });
});

export const deleteReview = CatchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const review = await Reviews.findByPk(req.params.id);
  console.log(review);
  if (!review) {
    return next(new AppError("Review not Found with that ID!", 404));
  }
  await review.destroy();

  res.status(200).json({
    status: "success",
    message: "Review Deleted successfully ",
  });
});
