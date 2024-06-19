import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryId,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyTemplate } from "../middlewares/verification.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

router.use(verifyTemplate);

router.route("/").get(getAllCategory).post(protect, createCategory);
router
  .route("/:id")
  .get(getCategoryId)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
