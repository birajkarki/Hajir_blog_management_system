import express from "express";
import {
  approveBlog,
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogID,
  rejectBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/uploadFile.js";
import {
  verifyCategory,
  verifySubcategory,
  verifyTemplate,
} from "../middlewares/verification.js";

const router = express.Router();

router.use(verifyTemplate, verifyCategory, verifySubcategory);

router
  .route("/")
  .get(getAllBlogs)
  .post(
    upload.fields([
      { name: "blogImage", maxCount: 1 },
      { name: "sectionImages", maxCount: 5 },
    ]),
    createBlog
  );
router
  .route("/:id")
  .get(getBlogID)
  .put(
    upload.fields([
      { name: "blogImage", maxCount: 1 },
      { name: "sectionImages", maxCount: 5 },
    ]),
    updateBlog
  )
  .delete(deleteBlog);
router.route("approve/:id").put(approveBlog);
router.route("reject/:id").put(rejectBlog);

export default router;
