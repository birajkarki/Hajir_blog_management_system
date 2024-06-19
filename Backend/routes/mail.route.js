import { Router } from "express";
import {
  createMail,
  getMail,
  getMails,
} from "../controllers/mail.controller.js";

const router = Router();
router.route("/").post(createMail).get(getMails);

router.route("/:id").get(getMail);

export default router;
