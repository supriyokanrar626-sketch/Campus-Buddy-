import express from "express";
import { login, logout, register } from "../controllers/user.js";
import isAuthenticated from "../middleware/isAuthentication.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// router.post("/register", register);
// router.post("/login", login);
// router.get("/logout", logout);

// NEW: check if user is logged in
router.get("/me", isAuthenticated, (req, res) => {
    return res.status(200).json({
        success: true,
        userId: req.id,
    });
});

export default router;