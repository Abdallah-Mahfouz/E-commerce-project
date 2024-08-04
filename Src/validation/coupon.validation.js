import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createCoupon   =============
export const createCoupon = {
  body: Joi.object({
    code: Joi.string().min(3).max(30).required(),
    amount: Joi.number().min(1).max(100).integer().required(),
    fromDate: Joi.date().greater(Date.now()).required(),
    toDate: Joi.date().greater(Joi.ref("fromDate")).required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getCoupon   =============
export const getCoupon = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//================================================
//!=========  getAllCoupon   =============
export const getAllCoupon = {
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  updateCoupon   =============
export const updateCoupon = {
  body: Joi.object({
    code: Joi.string().min(3).max(30),
    amount: Joi.number().min(1).max(100).integer(),
    fromDate: Joi.date().greater(Date.now()),
    toDate: Joi.date().greater(Joi.ref("fromDate")),
  }),
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//================================================
//!=========  deleteCoupon   =============
export const deleteCoupon = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
