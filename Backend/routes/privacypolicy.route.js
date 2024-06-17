import { Router } from "express";
import { createPP, getPP } from "../controllers/privacypolicy.controller.js";

const router = Router();
router.route("/").post(createPP).get(getPP);

export default router;
