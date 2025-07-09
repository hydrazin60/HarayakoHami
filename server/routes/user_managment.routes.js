import express from "express";
import {
  getAllUsers,
  viewOtherProfile,
  viewOwnProfile,
} from "../controllers/User_Management/userManagment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const usermanagmentRoutes = express.Router();

usermanagmentRoutes.get("/profile", isAuthenticated, viewOwnProfile);
usermanagmentRoutes.get("/profile/:userId", isAuthenticated, viewOtherProfile);
usermanagmentRoutes.get("/all_user", isAuthenticated, getAllUsers);
export default usermanagmentRoutes;
