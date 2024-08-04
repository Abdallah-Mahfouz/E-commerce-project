import express from "express";
import * as CTC from "./cart.Controllers.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "../../validation/cart.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const cartRouter = express.Router();

//================================================

cartRouter.post(
  "/",
  validation(CV.createCart),
  auth([systemRoles.admin]),
  CTC.createCart
);

cartRouter.put(
  "/",
  validation(CV.removeCart),
  auth([systemRoles.admin]),
  CTC.removeCart
);
cartRouter.put(
  "/clear",
  validation(CV.clearCart),
  auth([systemRoles.admin]),
  CTC.clearCart
);

//================================================

export default cartRouter;
