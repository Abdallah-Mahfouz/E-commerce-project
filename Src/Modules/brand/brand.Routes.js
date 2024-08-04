import express from "express";
import * as BC from "./brand.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multer.js";
import * as BV from "../../validation/brand.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const brandRouter = express.Router();

//================================================
brandRouter.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(BV.createBrand),
  auth([systemRoles.admin]),
  BC.createBrand
);
//=================
brandRouter.get(
  "/",
  // validation(BV.getAllBrand),
  // auth([systemRoles.admin, systemRoles.user]),
  BC.getAllBrands
);
//=================
brandRouter.get(
  "/:id",
  validation(BV.getBrand),
  // auth([systemRoles.admin, systemRoles.user]),
  BC.getBrand
);
//=================
brandRouter.put(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(BV.updateBrand),
  auth([systemRoles.admin]),
  BC.updateBrand
);
//=================
brandRouter.delete(
  "/:id",
  validation(BV.deleteBrand),
  auth([systemRoles.admin]),
  BC.deleteBrand
);
//================================================

export default brandRouter;
