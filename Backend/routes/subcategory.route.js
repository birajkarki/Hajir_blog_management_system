import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategoryID,
  updateSubCategory,
  getAllSubCategory,
} from "../controllers/subcategory.controller.js";
import { verifyCategory, verifyTemplate } from '../middlewares/verification.js';

const router = express.Router();

router.use(verifyTemplate, verifyCategory);

router.route("/").get(getAllSubCategory).post(createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryID)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

export default router;
