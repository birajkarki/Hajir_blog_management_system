import express from "express";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
} from "../controllers/template.controller.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

router.route("/").get(getAllTemplates).post(protect, createTemplate);
router
  .route("/:id")
  .get(getTemplate)
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

export default router;
