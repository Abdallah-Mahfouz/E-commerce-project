import express from "express";
import * as RC from "./review.controllers.js";
import { auth } from "../../middleware/auth.js";
import * as RV from "../../validation/review.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const reviewRouter = express.Router({
  mergeParams: true,
});

//================================================
reviewRouter.post(
  "/",
  validation(RV.createReview),
  auth([systemRoles.admin , systemRoles.user]),
  RC.createReview
);

reviewRouter.delete(
  "/:id",
  validation(RV.deleteReview),
  auth([systemRoles.admin, systemRoles.user]),
  RC.deleteReview
);
//================================================

export default reviewRouter;
