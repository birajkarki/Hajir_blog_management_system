import { Router } from "express";
import upload from "../middlewares/uploadFile.js";
import { createReview, getReviews } from "../controllers/review.controller.js";

const router = Router();
router
  .route("/")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createReview)
  .get(getReviews);

export default router;
