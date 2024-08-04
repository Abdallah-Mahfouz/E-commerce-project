import Joi from "joi";
import {generalFields} from "../utils/generalFields.js";
//================================================
//!=========  createBrand   =============
export const createBrand = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }),
  file: generalFields.file.required(),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  updateBrand   =============
export const updateBrand = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
  }),
  file: generalFields.file,
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//================================================
//!=========  getBrand   =============
export const getBrand = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  // headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getAllBrand   =============
// export const getAllBrand = {
//   headers: generalFields.headers.required().unknown(true),
// }
//================================================
//!=========  deleteBrand   =============
export const deleteBrand = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
}