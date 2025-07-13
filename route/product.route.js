import express from "express";
import {
  addProduct,
  deleteProduct,
  listProduct,
  singleProduct,
  updateProduct,
} from "../controller/product.controller.js";
import upload from "../middleware/multer.js";
import { jwtCheck } from "../middleware/auth.middleware.js";

const productRoute = express.Router();

productRoute.get("/", listProduct);
productRoute.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  addProduct
);
productRoute.delete("/:id", deleteProduct);
productRoute.get("/:id", singleProduct);
productRoute.put(
  "/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  updateProduct
);

export default productRoute;
