import express from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { verifyCSRFToken } from "./adminRoutes.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", verifyCSRFToken, createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", verifyCSRFToken, updateCategory);
router.delete("/:id", verifyCSRFToken, deleteCategory);

export default router;
