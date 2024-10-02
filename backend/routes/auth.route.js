import express from "express";
import {
  signupUser,
  signinUser, 
  signoutUser,
  getAllUsers,
  getMe,
} from "../controllers/auth.controller.js";
import protectRoute from "../Utils/middleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/signout", signoutUser);
router.get("/list", getAllUsers);
router.get("/me", protectRoute, getMe);

export default router;
 