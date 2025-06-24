import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyCSRFToken } from "./adminRoutes.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", verifyCSRFToken, createProduct);
router.get("/:id", getProductById);
router.put("/:id", verifyCSRFToken, updateProduct);
router.delete("/:id", verifyCSRFToken, deleteProduct);

export default router;
