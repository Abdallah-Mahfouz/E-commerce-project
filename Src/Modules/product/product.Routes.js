import express from "express";
import * as PC from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multer.js";
import * as PV from "../../validation/product.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import reviewRouter from "../review/review.Routes.js";
import wishListRouter from "../wishList/wishList.Routes.js";

//================================================

const productRouter = express.Router({
  mergeParams: true,
});

productRouter.use("/:productId/review", reviewRouter);
productRouter.use("/:productId/wishList", wishListRouter);

//================================================
productRouter.post(
  "/",
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(PV.createProduct),
  auth([systemRoles.admin]),
  PC.createProduct
);
//================
productRouter.get(
  "/",
  PC.getAllProducts
);
//================
productRouter.get(
  "/:id",
  validation(PV.getProduct),
  PC.getProduct
);
//================
productRouter.put(
  "/:id",
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(PV.updateProduct),
  auth([systemRoles.admin]),
  PC.updateProduct
);
//================
productRouter.delete(
  "/:id",
  validation(PV.deleteProduct),
  auth([systemRoles.admin]),
  PC.deleteProduct
);

//================================================

export default productRouter;
