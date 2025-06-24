import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers); // Optionally protect with isAdmin middleware

export default router;
    