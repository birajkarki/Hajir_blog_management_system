import { Router } from "express";
import { createHighlight } from "../controllers/highlight.controller.js";
import upload from "../middlewares/uploadFile.js";

const router = Router();
router
  .route("/")
  .post(upload.array("highlightSectionImages", 3), createHighlight);
export default router;
