import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createWishList   =============
export const createWishList = {
  params: Joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//=============================================
//!=========  deleteWishList   =============
export const removeWishList = {
  params: Joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
}