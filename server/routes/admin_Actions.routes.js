import express from "express";
import {
  Login,
  UserRegister,
} from "../controllers/Admin_Actions/user.auth.controller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/user/login", Login);
export default router;
