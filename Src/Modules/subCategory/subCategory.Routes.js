import express from "express";
import * as SCC from "./subCategory.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multer.js";
import * as SCV from "../../validation/subCategory.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const subCategoryRouter = express.Router({
  mergeParams: true,
});

//================================================
subCategoryRouter.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(SCV.createSubCategory),
  auth([systemRoles.admin]),
  SCC.createSubCategory
);
subCategoryRouter.put(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(SCV.updateSubCategory),
  auth([systemRoles.admin]),
  SCC.updateSubCategory
);
subCategoryRouter.delete(
  "/:id",
  validation(SCV.deleteSubCategory),
  auth([systemRoles.admin]),
  SCC.deleteSubCategory
);
subCategoryRouter.get(
  "/",
  // validation(SCV.getAllSubCategory),
  // auth([systemRoles.admin, systemRoles.user]),
  SCC.getAllSubCategory
);
subCategoryRouter.get(
  "/:id",
  validation(SCV.getSubCategory),
  // auth([systemRoles.admin, systemRoles.user]),
  SCC.getSubCategory
);

//================================================

export default subCategoryRouter;
