import express from "express";
import {
  followUnfollowUser,
  getCoverImg,
  getProfileImg,
  getSuggestedUsers, 
  getUserProfile,
  updateUser,
  uploadCoverImg,
  uploadProfileImg,
} from "../controllers/user.controller.js";
import protectRoute from "../Utils/middleware.js";
import upload from "../Utils/multerConfig.js";

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, updateUser);
router.post("/upload/profile/:id", upload.single("profileImg"), uploadProfileImg);
router.post("/upload/cover/:id", upload.single("coverImg"), uploadCoverImg);
router.get('/user/:id/profile-image', getProfileImg);
router.get('/user/:id/cover-image', getCoverImg);

export default router;
