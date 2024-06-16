import { Router } from "express";
import {
  createHighlight,
  getHighlights,
} from "../controllers/highlight.controller.js";
import upload from "../middlewares/uploadFile.js";

const router = Router();
router
  .route("/")
  .post(upload.array("highlightSectionImages", 3), createHighlight)
  .get(getHighlights);
export default router;