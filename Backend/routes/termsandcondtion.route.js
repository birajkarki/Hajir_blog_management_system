
import { Router } from "express";
import { createTNC, getTNC, updateTNC } from "../controllers/termsandconditions.controller.js";

const router = Router();
router.route("/").post(createTNC).get(getTNC).patch(updateTNC);

export default router;
