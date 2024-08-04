import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createOrder   =============
export const createOrder = {
  body: Joi.object({
    productId: generalFields.id.optional(),
    quantity: Joi.number().integer(),
    couponCode: Joi.string().min(3),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    paymentMethod: Joi.string().valid("card", "cash").required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//====================================================
//!=========  cancelOrder   =============
export const cancelOrder = {
  body: Joi.object({
    reason: Joi.string().required(),
  }),
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
}