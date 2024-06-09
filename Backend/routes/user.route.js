import express from "express";
import {
  deleteUser,
  forgetPassword,
  getAllUser,
  getMe,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/user.contorller.js";
import protect from "../middlewares/protect.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();
// getAllUser=>protect, checkRole,
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getall").get(getAllUser);
router.route("/logout").get(logoutUser);
router.route("/:id").delete(deleteUser);
router.route("/forget").post(forgetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/me").get(protect, getMe, getUser);
router.route("/:id").get(getUser);

export default router;
