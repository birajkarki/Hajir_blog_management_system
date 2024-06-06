import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategoryID,
  updateSubCategory,
  getAllSubCategory,
} from "../controllers/subcategory.controller.js";
import { verifyCategory, verifyTemplate } from '../middlewares/verification.js';
import protect from "../middlewares/protect.js";

const router = express.Router();

router.use(verifyTemplate);

router.route("/").get(getAllSubCategory).post(protect,createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryID)
  .put(protect,updateSubCategory)
  .delete(protect,deleteSubCategory);

export default router;
