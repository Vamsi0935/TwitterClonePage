import express from "express";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";
import protectRoute from "../Utils/middleware.js";

const router = express.Router();
 
router.get("/", protectRoute, getNotifications);
router.delete("/delete", protectRoute, deleteNotifications);

export default router; 