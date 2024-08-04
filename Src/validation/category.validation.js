import Joi from "joi";
import {generalFields} from "../utils/generalFields.js";
//================================================
//!=========  createCategory   =============
export const createCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }),
  file: generalFields.file.required(),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  updateCategory   =============
export const updateCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
  }),
  file: generalFields.file,
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getCategory   =============
export const getCategory = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  // headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getAllCategory   =============
// export const getAllCategory = {
//   headers: generalFields.headers.required().unknown(true),
// };
//================================================
//!=========  deleteCategory   =============
export const deleteCategory = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
}