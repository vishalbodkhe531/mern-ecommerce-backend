import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllSearchProduct,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProducts,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";

const productRoutes = express.Router();

// Create new product ---> /api/v1/product/new
productRoutes.post("/new", adminOnly, singleUpload, newProduct);

// Get letest product ---> /api/v1/product/letest
productRoutes.get("/letest", getLatestProducts);

// Get all unique categories ---> /api/v1/product/categories
productRoutes.get("/categories", getAllCategories);

// Get all search products with filter ---> /api/v1/product/search-product
productRoutes.get("/search-product", getAllSearchProduct);

// Get all product ---> /api/v1/product/admin-products
productRoutes.get("/admin-products", adminOnly, getAdminProducts);

// to get update delete product ---> /api/v1/product/id
productRoutes
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProducts)
  .delete(adminOnly, deleteProduct);

export default productRoutes;
