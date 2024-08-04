import express from "express";
import * as OC from "./order.controllers.js";
import { auth } from "../../middleware/auth.js";
import * as OV from "../../validation/order.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const orderRouter = express.Router();

//================================================
orderRouter.post(
  "/",
  validation(OV.createOrder),
  auth([systemRoles.user, systemRoles.admin]),
  OC.createOrder
);
orderRouter.put(
  "/:id",
  validation(OV.cancelOrder),
  auth([systemRoles.user, systemRoles.admin]),
  OC.cancelOrder
);

//================================================
orderRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  OC.webhook
);

//================================================

export default orderRouter;