import express from "express";
import { createCategory, deleteCategory, getAllCategory, getCategoryId, updateCategory } from "../controllers/category.controller.js";
import { verifyTemplate } from '../middlewares/verification.js';

const router = express.Router();

router.use(verifyTemplate);

router.route("/").get(getAllCategory).post(createCategory);
router
  .route("/:id")
  .get(getCategoryId)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
