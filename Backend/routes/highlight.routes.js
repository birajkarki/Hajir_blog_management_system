import { Router } from "express";
import {
  createHighlight,
  getHighlights,
  updateHighlight,
} from "../controllers/highlight.controller.js";
import upload from "../middlewares/uploadFile.js";
import protect from "../middlewares/protect.js";

const router = Router();
router
  .route("/")
  .post(protect, upload.array("highlightSectionImages", 3), createHighlight)
  .get(getHighlights)
  .patch(
    protect,
    upload.fields([{ name: "highlightSectionImages", maxCount: 3 }]),
    updateHighlight
  );
export default router;
