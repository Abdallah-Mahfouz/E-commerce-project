import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createSubCategory   =============
export const createSubCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }),
  file: generalFields.file.required(),
  params: Joi.object({
    categoryId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getSubCategory   =============
export const getSubCategory = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  // headers: generalFields.headers.required().unknown(true),
}
//================================================
//!=========  getAllSubCategory   =============
// export const getAllSubCategory = {
//   headers: generalFields.headers.required().unknown(true),
// }
//================================================
//!=========  updateSubCategory   =============
export const updateSubCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
  }),
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  file: generalFields.file,
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  deleteSubCategory   =============
export const deleteSubCategory = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
