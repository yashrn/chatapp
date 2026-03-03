import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.status(200).json({message: "Auth route is working"});
});

router.use(arcjetProtection); // Apply Arcjet protection to all auth routes

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",  logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json({message: "Authenticated", user: req.user});
});

export default router;
