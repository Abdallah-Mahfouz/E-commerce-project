import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createCart   =============
export const createCart = {
  body: Joi.object({
    productId: generalFields.id.required(),
    quantity: Joi.number().min(1).integer().required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getCart   =============
export const getCart = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//================================================
//!=========  removeCart   =============
export const removeCart = {
  body: Joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  clearCart   =============
export const clearCart = {
  headers: generalFields.headers.required().unknown(true),
};

