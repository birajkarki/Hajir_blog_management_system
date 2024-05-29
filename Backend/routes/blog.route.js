import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/uploadFile.js";

const router = express.Router();

router.route("/").get(getAllBlogs).post(upload.array("images", 5), createBlog);
router.route("/:id").get(getBlog).put(upload.array("images", 5),updateBlog).delete(deleteBlog);

export default router;
