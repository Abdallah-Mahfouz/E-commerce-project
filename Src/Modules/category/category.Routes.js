import express from "express";
import * as NC from "./category.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multer.js";
import * as CC from "../../validation/category.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import subCategoryRouter from "../subCategory/subCategory.Routes.js";

//================================================

const categoryRouter = express.Router();

//================================================
// merge params
categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

//================================================
categoryRouter.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validation(CC.createCategory),
  auth([systemRoles.admin]),
  NC.createCategory
);
categoryRouter.put(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validation(CC.updateCategory),
  auth([systemRoles.admin]),
  NC.updateCategory
);
categoryRouter.delete(
  "/:id",
  validation(CC.deleteCategory),
  auth([systemRoles.admin]),
  NC.deleteCategory
);
categoryRouter.get(
  "/all",
  // validation(CC.getAllCategory),
  // auth([systemRoles.admin, systemRoles.user]),
  NC.getAllCategory
);
categoryRouter.get(
  "/:id",
  validation(CC.getCategory),
  // auth([systemRoles.admin, systemRoles.user]),
  NC.getCategory
);

//================================================

export default categoryRouter;
