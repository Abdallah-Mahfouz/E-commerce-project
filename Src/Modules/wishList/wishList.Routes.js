import express from "express";
import * as CPC from "./wishList.controllers.js";
import { auth } from "../../middleware/auth.js";
import * as CBV from "../../validation/wishList.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================

const wishListRouter = express.Router({
  mergeParams: true,
});

//================================================
wishListRouter.post(
  "/",
    validation(CBV.createWishList),
  auth([systemRoles.user, systemRoles.admin]),
  CPC.createWishList
);
wishListRouter.put("/",
  validation(CBV.removeWishList),
  auth([systemRoles.user, systemRoles.admin]),
  CPC.removeWishList

);

//================================================

export default wishListRouter;
