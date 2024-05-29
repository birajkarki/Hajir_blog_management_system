import express from "express";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
} from "../controllers/template.controller.js";

const router = express.Router();

router.route("/").get(getAllTemplates).post(createTemplate);
router
  .route("/:id")
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

export default router;
