import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";

//!=========  createReview   =============
export const createReview = {
  body: Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),
  params: Joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//=============================================
//!=========  deleteReview   =============
export const deleteReview = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
}