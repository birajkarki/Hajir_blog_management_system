import { Router } from "express";
import {
  createPP,
  getPP,
  updatePP,
} from "../controllers/privacypolicy.controller.js";

const router = Router();
router.route("/").post(createPP).get(getPP).patch(updatePP);

export default router;
