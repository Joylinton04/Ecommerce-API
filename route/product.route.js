import express from "express";
import {
  addProduct,
  deleteProduct,
  listProduct,
  singleProduct,
} from "../controller/product.controller.js";
import upload from "../middleware/multer.js";

const productRoute = express.Router();

productRoute.post("/", listProduct);
productRoute.post(
  "/add",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
    ]),
  addProduct
);
productRoute.post("/delete",deleteProduct);
productRoute.post("/:id", singleProduct);

export default productRoute;
