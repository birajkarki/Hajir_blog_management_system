import express from "express";
import {
  approveBlog,
  createBlog,
  deleteBlog,
  deleteSection,
  getAllBlogs,
  getBlogID,
  rejectBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/uploadFile.js";
import { verifyCategory, verifySubcategory, verifyTemplate } from '../middlewares/verification.js';

const router = express.Router();

router.use(verifyTemplate, verifyCategory, verifySubcategory)

router.route("/").get(getAllBlogs).post(upload.array("images", 6), createBlog);
router
  .route("/:id")
  .get(getBlogID)
  .put(upload.array("images", 5), updateBlog)
  .delete(deleteBlog);
router.route("section/:id").delete(deleteSection);
router.route("approve/:id").put(approveBlog);
router.route("reject/:id").put(rejectBlog);

export default router;
