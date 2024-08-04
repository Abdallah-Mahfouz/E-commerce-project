import express from "express";
import * as CPC from "./coupon.controllers.js";
import { auth } from "../../middleware/auth.js";
import * as CBV from "../../validation/coupon.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const couponRouter = express.Router();

//================================================
couponRouter.post(
  "/",
  validation(CBV.createCoupon),
  auth([systemRoles.admin]),
  CPC.createCoupon
);
couponRouter.get(
  "/",
  validation(CBV.getAllCoupon),
  auth([systemRoles.admin]),
  CPC.getAllCoupons
);
couponRouter.get(
  "/:id",
  validation(CBV.getCoupon),
  auth([systemRoles.admin]),
  CPC.getCoupon
);
couponRouter.delete(
  "/:id",
  validation(CBV.deleteCoupon),
  auth([systemRoles.admin]),
  CPC.deleteCoupon
);
couponRouter.put(
  "/:id",
  validation(CBV.updateCoupon),
  auth([systemRoles.admin]),
  CPC.updateCoupon
);
//================================================

export default couponRouter;
