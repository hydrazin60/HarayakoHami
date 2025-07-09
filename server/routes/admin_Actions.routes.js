import express from "express";
import { UserRegister } from "../controllers/Admin_Actions/user.auth.controller.js";

const router = express.Router();

router.post("/register", UserRegister);

export default router;