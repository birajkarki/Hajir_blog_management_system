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
import {
  verifyCategory,
  verifySubcategory,
  verifyTemplate,
} from "../middlewares/verification.js";
import protect from "../middlewares/protect.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router
  .route("/")
  .get(getAllBlogs)
  .post(

    protect,
    upload.fields([
      { name: "blogImage", maxCount: 1 },
      { name: "sectionImages", maxCount: 5 },
    ]),
    createBlog
  );



router
  .route("/:id")
  .get(getBlogID)
  .patch(
    protect,
    upload.fields([
      { name: "blogImage", maxCount: 1 },
      { name: "sectionImages", maxCount: 5 },
    ]),
    updateBlog
  )
  .delete(deleteBlog);
router.route("/section/:id").delete(protect, deleteSection);
router.route("/approve/:id").put(protect, checkRole, approveBlog);
router.route("/reject/:id").put(protect, checkRole, rejectBlog);
export default router;
