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

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getall").get(protect, checkRole, getAllUser);
router.route("/getuser").get(getUser);
router.route("/logout").get(logoutUser);
router.route("/delete/:id").delete(protect, checkRole, deleteUser);
router.route("/forget").post(forgetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/me").get(protect, getMe, getUser);

export default router;
