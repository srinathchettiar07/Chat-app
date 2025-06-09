import express from "express";
import { signup, login, logout ,updateProfile, checkAuth } from "../controllers/auth.route.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-Profile",ensureAuthenticated ,updateProfile)

router.get("/check", ensureAuthenticated, checkAuth)

export default router;
