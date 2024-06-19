import { Router } from "express";
import upload from "../middlewares/uploadFile.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();
router
  .route("/")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createReview)
  .get(getReviews);

router
  .route("/:id")
  .get(getReview)
  .patch(upload.fields([{ name: "image", maxCount: 1 }]), updateReview)
  .delete(deleteReview);

export default router;
